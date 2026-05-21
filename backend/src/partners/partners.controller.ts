import {
  Controller, Get, Post, Patch, Delete,
  Param, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly partners: PartnersService) {}

  @Get()
  getPartners(@Request() req: AuthRequest) {
    return this.partners.getMyPartners(req.user.id);
  }

  @Get('requests')
  getRequests(@Request() req: AuthRequest) {
    return this.partners.getIncomingRequests(req.user.id);
  }

  @Get('status/:targetId')
  getPairStatus(@Request() req: AuthRequest, @Param('targetId') targetId: string) {
    return this.partners.getPairStatus(req.user.id, targetId);
  }

  @Post('request/:userId')
  sendRequest(@Request() req: AuthRequest, @Param('userId') userId: string) {
    return this.partners.sendRequest(req.user.id, userId);
  }

  @Patch('accept/:pairId')
  accept(@Request() req: AuthRequest, @Param('pairId') pairId: string) {
    return this.partners.accept(pairId, req.user.id);
  }

  @Patch('decline/:pairId')
  @HttpCode(HttpStatus.NO_CONTENT)
  decline(@Request() req: AuthRequest, @Param('pairId') pairId: string) {
    return this.partners.decline(pairId, req.user.id);
  }

  @Delete(':pairId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: AuthRequest, @Param('pairId') pairId: string) {
    return this.partners.remove(pairId, req.user.id);
  }
}
