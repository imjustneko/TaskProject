import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
