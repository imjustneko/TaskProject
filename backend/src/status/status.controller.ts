import {
  Controller, Put, Patch, Delete, Body, UseGuards,
  Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { StatusService, SetStatusDto, SetPresenceDto } from './status.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @Put()
  set(@Request() req: AuthRequest, @Body() dto: SetStatusDto) {
    return this.status.setStatus(req.user.id, dto);
  }

  @Patch('presence')
  setPresence(@Request() req: AuthRequest, @Body() dto: SetPresenceDto) {
    return this.status.setPresence(req.user.id, dto.presence);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clear(@Request() req: AuthRequest) {
    return this.status.clearStatus(req.user.id);
  }
}
