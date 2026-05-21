import {
  Controller, Get, Patch, Post, Delete, Body, Param,
  UseGuards, Request, Query, UploadedFile, UseInterceptors, BadRequestException,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from './users.service';

interface AuthRequest extends ExpressRequest { user: SafeUser }

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

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'avatars'),
      filename: (_, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new BadRequestException('Only image files are allowed') as unknown as null, false);
    },
  }))
  async uploadAvatar(
    @Request() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const port = process.env.PORT ?? 3001;
    const baseUrl = `${req.protocol}://${req.hostname}:${port}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;
    return this.users.updateProfile(req.user.id, { avatarUrl });
  }

  @Get('me/emojis')
  listEmojis(@Request() req: AuthRequest) {
    return this.users.getEmojis(req.user.id);
  }

  @Post('me/emojis')
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
    @Body('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!name?.trim()) throw new BadRequestException('Emoji name required');
    const port = process.env.PORT ?? 3001;
    const baseUrl = `${req.protocol}://${req.hostname}:${port}`;
    const imageUrl = `${baseUrl}/uploads/emojis/${file.filename}`;
    return this.users.addEmoji(req.user.id, name.trim().toLowerCase().replace(/\s+/g, '_'), imageUrl);
  }

  @Delete('me/emojis/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEmoji(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.users.deleteEmoji(id, req.user.id);
  }

  @Get('search')
  search(@Request() req: AuthRequest, @Query('q') q: string) {
    return this.users.search(q ?? '', req.user.id);
  }

  @Get(':username')
  getByUsername(@Request() req: AuthRequest, @Param('username') username: string) {
    return this.users.findByUsername(username, req.user.id);
  }
}
