import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService, type SafeUser } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { User } from '@prisma/client';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: SafeUser;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    await this.users.checkUniqueness(dto.email, dto.username);

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        displayName: dto.displayName,
        passwordHash,
      },
    });

    const tokens = this.generateTokens(user);
    return { user: this.users.sanitize(user), ...tokens };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (user.isBlocked) throw new ForbiddenException('Account has been suspended');
    if (!user.passwordHash) throw new UnauthorizedException('This account uses Google or Apple sign-in');

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid email or password');

    const tokens = this.generateTokens(user);
    return { user: this.users.sanitize(user), ...tokens };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    try {
      this.jwt.verify(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isBlocked) throw new UnauthorizedException();

    return this.generateTokens(user);
  }

  async checkUsernameAvailable(username: string): Promise<{ available: boolean }> {
    const exists = await this.prisma.user.findUnique({ where: { username } });
    return { available: !exists };
  }

  async googleLogin(accessToken: string): Promise<AuthResponse> {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new UnauthorizedException('Invalid Google token');
    const info = await res.json() as { id: string; email: string; name?: string; picture?: string };
    if (!info.id || !info.email) throw new UnauthorizedException('Invalid Google token');

    let user = await this.prisma.user.findUnique({ where: { googleId: info.id } });

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email: info.email } });
      if (user) {
        user = await this.prisma.user.update({ where: { id: user.id }, data: { googleId: info.id } });
      } else {
        const username = await this.users.generateUniqueUsername(info.email, info.name);
        user = await this.prisma.user.create({
          data: {
            email: info.email,
            username,
            displayName: info.name ?? info.email.split('@')[0],
            googleId: info.id,
            avatarUrl: info.picture ?? null,
          },
        });
      }
    }

    if (user.isBlocked) throw new ForbiddenException('Account has been suspended');
    const tokens = this.generateTokens(user);
    return { user: this.users.sanitize(user), ...tokens };
  }

  async appleLogin(idToken: string, displayName: string): Promise<AuthResponse> {
    const JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
    let payload: { sub?: string; email?: string };
    try {
      const { payload: p } = await jwtVerify(idToken, JWKS, {
        issuer: 'https://appleid.apple.com',
        audience: this.config.getOrThrow('APPLE_CLIENT_ID'),
      });
      payload = p as { sub?: string; email?: string };
    } catch {
      throw new UnauthorizedException('Invalid Apple token');
    }

    if (!payload.sub) throw new UnauthorizedException('Invalid Apple token');
    const appleId = payload.sub;
    const email = payload.email ?? `${appleId}@privaterelay.appleid.com`;

    let user = await this.prisma.user.findUnique({ where: { appleId } });

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        user = await this.prisma.user.update({ where: { id: user.id }, data: { appleId } });
      } else {
        const username = await this.users.generateUniqueUsername(email, displayName);
        user = await this.prisma.user.create({
          data: {
            email,
            username,
            displayName: displayName || email.split('@')[0],
            appleId,
          },
        });
      }
    }

    if (user.isBlocked) throw new ForbiddenException('Account has been suspended');
    const tokens = this.generateTokens(user);
    return { user: this.users.sanitize(user), ...tokens };
  }

  private generateTokens(user: User): AuthTokens {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwt.sign(payload, {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      refresh_token: this.jwt.sign(
        { sub: user.id },
        {
          secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
    };
  }
}
