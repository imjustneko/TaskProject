import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, Request, HttpCode, HttpStatus,
  UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';

class UpdateRoomDto {
  @IsOptional() @IsString() @MaxLength(80) name?: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsOptional() @IsString() activityType?: string;
  @IsOptional() @IsBoolean() isPublic?: boolean;
  @IsOptional() @IsString() imageUrl?: string;
}
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Request as ExpressRequest } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest extends ExpressRequest { user: SafeUser }

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

  @Get('public')
  publicRooms(@Request() req: AuthRequest) {
    return this.rooms.getPublicRooms(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.rooms.getRoom(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req: AuthRequest, @Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.rooms.update(id, req.user.id, dto);
  }

  @Post(':id/join')
  join(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.rooms.join(id, req.user.id);
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

  @Post(':id/tasks/:taskId/status')
  setTaskStatus(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body('status') status: 'DONE' | 'FAILED' | 'SKIP' | 'RESET',
  ) {
    return this.rooms.setTaskStatus(id, taskId, req.user.id, status);
  }

  // keep old toggle endpoint for backward compat
  @Post(':id/tasks/:taskId/complete')
  toggleTask(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Param('taskId') taskId: string,
  ) {
    return this.rooms.setTaskStatus(id, taskId, req.user.id, 'DONE');
  }

  @Get(':id/emojis')
  listEmojis(@Param('id') id: string) {
    return this.rooms.getEmojis(id);
  }

  @Post(':id/emojis')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'emojis'),
      filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 256 * 1024 },
    fileFilter: (_, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new BadRequestException('Only image files') as unknown as null, false);
    },
  }))
  async addEmoji(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!name?.trim()) throw new BadRequestException('Emoji name required');
    const port = process.env.PORT ?? 3001;
    const baseUrl = `${req.protocol}://${req.hostname}:${port}`;
    const imageUrl = `${baseUrl}/uploads/emojis/${file.filename}`;
    return this.rooms.addEmoji(id, req.user.id, name.trim().toLowerCase().replace(/\s+/g, '_'), imageUrl);
  }

  @Delete(':id/emojis/:emojiId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEmoji(@Request() req: AuthRequest, @Param('emojiId') emojiId: string) {
    return this.rooms.deleteEmoji(emojiId, req.user.id);
  }
}
