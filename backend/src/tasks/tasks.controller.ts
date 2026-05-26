import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Request, Query, Res, Header,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/users.service';
import type { LogStatus } from '@prisma/client';

interface AuthRequest { user: SafeUser }

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateTaskDto) {
    return this.tasks.create(req.user.id, dto);
  }

  @Get('today')
  today(@Request() req: AuthRequest, @Query('all') all?: string) {
    return this.tasks.findToday(req.user.id, all === 'true');
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

  @Get('sparkline')
  sparkline(@Request() req: AuthRequest) {
    return this.tasks.getSparkline(req.user.id);
  }

  @Get('export')
  async export(
    @Request() req: AuthRequest,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const csv = await this.tasks.exportCsv(req.user.id, from, to);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="taskyy-export-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  }

  @Get('streak')
  streak(@Request() req: AuthRequest) {
    return this.tasks.getStreak(req.user.id);
  }

  @Get('logs/daily')
  getDailyLogs(
    @Request() req: AuthRequest,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.tasks.getDailyLogs(req.user.id, from, to);
  }

  @Get('logs/today')
  getTodayLogs(@Request() req: AuthRequest) {
    return this.tasks.getTodayLogs(req.user.id);
  }

  @Post(':id/log')
  setDailyStatus(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('status') status: LogStatus,
    @Body('note') note?: string,
  ) {
    return this.tasks.setDailyStatus(id, req.user.id, status, note);
  }

  @Delete(':id/log')
  clearDailyStatus(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.tasks.clearDailyStatus(id, req.user.id);
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
