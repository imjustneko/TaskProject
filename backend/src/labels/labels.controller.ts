import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { LabelsService } from './labels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

class CreateLabelDto {
  @IsString() @MaxLength(30) name: string;
  @IsOptional() @IsString() @Matches(/^#[0-9a-fA-F]{6}$/) color?: string;
}

class UpdateLabelDto {
  @IsOptional() @IsString() @MaxLength(30) name?: string;
  @IsOptional() @IsString() @Matches(/^#[0-9a-fA-F]{6}$/) color?: string;
}

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('labels')
export class LabelsController {
  constructor(private readonly labels: LabelsService) {}

  @Get()
  list(@Request() req: AuthRequest) {
    return this.labels.getAll(req.user.id);
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateLabelDto) {
    return this.labels.create(req.user.id, dto.name, dto.color ?? '#6366f1');
  }

  @Patch(':id')
  update(@Request() req: AuthRequest, @Param('id') id: string, @Body() dto: UpdateLabelDto) {
    return this.labels.update(id, req.user.id, dto.name, dto.color);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.labels.remove(id, req.user.id);
  }
}
