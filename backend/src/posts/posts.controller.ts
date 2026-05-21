import {
  Controller, Get, Post, Delete, Param, Body,
  UseGuards, Request, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import type { SafeUser } from '../users/users.service';

class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  taskId?: string;
}

class AddCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  content: string;
}

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get('feed')
  getFeed(@Request() req: AuthRequest, @Query('cursor') cursor?: string) {
    return this.posts.getFeed(req.user.id, cursor);
  }

  @Get('user/:userId')
  getUserPosts(@Request() req: AuthRequest, @Param('userId') userId: string) {
    return this.posts.getUserPosts(userId, req.user.id);
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreatePostDto) {
    return this.posts.create(req.user.id, dto.content, dto.imageUrl, dto.taskId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.posts.delete(id, req.user.id);
  }

  @Post(':id/like')
  like(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.posts.toggleLike(id, req.user.id);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.posts.getComments(id);
  }

  @Post(':id/comments')
  addComment(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: AddCommentDto,
  ) {
    return this.posts.addComment(id, req.user.id, dto.content);
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(@Request() req: AuthRequest, @Param('commentId') commentId: string) {
    return this.posts.deleteComment(commentId, req.user.id);
  }
}
