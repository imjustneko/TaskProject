import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';

interface AuthRequest {
  user: SafeUser;
}

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateTaskDto) {
    return this.tasks.create(req.user.id, dto);
  }

  @Get('today')
  today(@Request() req: AuthRequest) {
    return this.tasks.findToday(req.user.id);
  }

  @Get('plans')
  plans(@Request() req: AuthRequest) {
    return this.tasks.findPlans(req.user.id);
  }

  @Get('history')
  history(@Request() req: AuthRequest) {
    return this.tasks.findHistory(req.user.id);
  }

  @Get('stats')
  stats(@Request() req: AuthRequest) {
    return this.tasks.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.tasks.findById(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.tasks.remove(id, req.user.id);
  }

  @Patch(':id/complete')
  toggleComplete(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.tasks.toggleComplete(id, req.user.id);
  }
}
