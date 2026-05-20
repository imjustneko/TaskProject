import {
  Controller, Get, Post, Delete, Param, Body,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateRoomDto) {
    return this.rooms.create(req.user.id, dto);
  }

  @Get()
  list(@Request() req: AuthRequest) {
    return this.rooms.getMyRooms(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.rooms.getRoom(id, req.user.id);
  }

  @Post(':id/invite/:userId')
  invite(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.rooms.invite(id, req.user.id, userId);
  }

  @Delete(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  leave(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.rooms.leave(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.rooms.delete(id, req.user.id);
  }

  @Post(':id/tasks')
  addTask(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    return this.rooms.addTask(id, req.user.id, title);
  }

  @Post(':id/tasks/:taskId/complete')
  toggleTask(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Param('taskId') taskId: string,
  ) {
    return this.rooms.toggleTaskCompletion(id, taskId, req.user.id);
  }
}
