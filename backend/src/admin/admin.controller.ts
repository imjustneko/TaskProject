import {
  Controller, Get, Patch, Delete, Param,
  UseGuards, Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.getStats();
  }

  @Get('users')
  users(
    @Query('search') search?: string,
    @Query('page') page?: string,
  ) {
    return this.admin.getUsers(search, page ? parseInt(page) : 1);
  }

  @Get('users/recent')
  recent() {
    return this.admin.getRecentUsers();
  }

  @Patch('users/:id/block')
  block(@Param('id') id: string) {
    return this.admin.blockUser(id);
  }

  @Patch('users/:id/unblock')
  unblock(@Param('id') id: string) {
    return this.admin.unblockUser(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.admin.deleteUser(id);
  }
}
