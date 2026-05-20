import {
  Controller, Get, Patch, Body, Param,
  UseGuards, Request, Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from './users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@Request() req: AuthRequest) {
    return req.user;
  }

  @Patch('me')
  updateMe(@Request() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.id, dto);
  }

  @Get('search')
  search(@Request() req: AuthRequest, @Query('q') q: string) {
    return this.users.search(q ?? '', req.user.id);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.users.findByUsername(username);
  }
}
