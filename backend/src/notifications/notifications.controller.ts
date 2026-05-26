import { Controller, Get, Patch, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import type { SafeUser } from '../users/users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.notifications.findAll(req.user.id);
  }

  @Get('unread-count')
  unreadCount(@Request() req: AuthRequest) {
    return this.notifications.getUnreadCount(req.user.id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAllRead(@Request() req: AuthRequest) {
    return this.notifications.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.notifications.markRead(id, req.user.id);
  }
}
