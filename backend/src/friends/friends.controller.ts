import {
  Controller, Get, Post, Patch, Delete,
  Param, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get()
  list(@Request() req: AuthRequest) {
    return this.friends.getFriends(req.user.id);
  }

  @Get('requests/incoming')
  incoming(@Request() req: AuthRequest) {
    return this.friends.getIncomingRequests(req.user.id);
  }

  @Get('requests/sent')
  sent(@Request() req: AuthRequest) {
    return this.friends.getSentRequests(req.user.id);
  }

  @Post('request/:targetId')
  sendRequest(@Request() req: AuthRequest, @Param('targetId') targetId: string) {
    return this.friends.sendRequest(req.user.id, targetId);
  }

  @Patch('accept/:requestId')
  accept(@Request() req: AuthRequest, @Param('requestId') requestId: string) {
    return this.friends.acceptRequest(requestId, req.user.id);
  }

  @Patch('decline/:requestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  decline(@Request() req: AuthRequest, @Param('requestId') requestId: string) {
    return this.friends.declineRequest(requestId, req.user.id);
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfriend(@Request() req: AuthRequest, @Param('friendId') friendId: string) {
    return this.friends.unfriend(req.user.id, friendId);
  }
}
