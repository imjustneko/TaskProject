import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto, AppleAuthDto } from './dto/oauth.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // ── Sensitive endpoints: 10 req/min ───────────────────────────────────────

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() dto: GoogleAuthDto) {
    return this.auth.googleLogin(dto.token);
  }

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async appleLogin(@Body() dto: AppleAuthDto) {
    return this.auth.appleLogin(dto.idToken, dto.displayName);
  }

  // ── Email-sending endpoints: 5 req/min ────────────────────────────────────

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.auth.resendVerification(dto.email);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.auth.forgotPassword(email);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.auth.resetPassword(token, password);
  }

  // ── No throttle needed ────────────────────────────────────────────────────

  @SkipThrottle()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.token);
  }

  @SkipThrottle()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.auth.refresh(refreshToken);
  }

  @SkipThrottle()
  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.auth.checkUsernameAvailable(username ?? '');
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: { user: Express.User }) {
    return req.user;
  }
}
