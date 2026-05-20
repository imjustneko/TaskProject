import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService, type SafeUser } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}
export interface AuthResponse {
    user: SafeUser;
    access_token: string;
    refresh_token: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly users;
    private readonly jwt;
    private readonly config;
    constructor(prisma: PrismaService, users: UsersService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens>;
    private generateTokens;
}
