import {
  Controller, Get, Post, Body, Param,
  UseGuards, Request, Query,
} from '@nestjs/common';
import { MessagesService, SendMessageDto } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('conversations')
  conversations(@Request() req: AuthRequest) {
    return this.messages.getConversationList(req.user.id);
  }

  @Get('dm/:userId')
  getDMs(
    @Request() req: AuthRequest,
    @Param('userId') userId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.messages.getDMs(req.user.id, userId, cursor);
  }

  @Post('dm/:userId')
  sendDM(
    @Request() req: AuthRequest,
    @Param('userId') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.sendDM(req.user.id, userId, dto);
  }

  @Get('room/:roomId')
  getRoomMessages(
    @Request() req: AuthRequest,
    @Param('roomId') roomId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.messages.getRoomMessages(roomId, req.user.id, cursor);
  }

  @Post('room/:roomId')
  sendRoomMessage(
    @Request() req: AuthRequest,
    @Param('roomId') roomId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.sendRoomMessage(roomId, req.user.id, dto);
  }
}
