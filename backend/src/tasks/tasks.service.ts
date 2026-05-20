import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { startOfDay, endOfDay } from './tasks.utils';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        ...dto,
        date: dto.date ? new Date(dto.date) : null,
      },
    });
  }

  async findToday(userId: string) {
    const now = new Date();
    return this.prisma.task.findMany({
      where: {
        userId,
        isCompleted: false,
        OR: [
          { date: null },
          { date: { gte: startOfDay(now), lte: endOfDay(now) } },
        ],
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findPlans(userId: string) {
    const tomorrow = startOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.prisma.task.findMany({
      where: {
        userId,
        isCompleted: false,
        date: { gte: tomorrow },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findHistory(userId: string) {
    return this.prisma.task.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: 'desc' },
      take: 100,
    });
  }

  async findById(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    await this.findById(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date !== undefined ? (dto.date ? new Date(dto.date) : null) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.task.delete({ where: { id } });
  }

  async toggleComplete(id: string, userId: string) {
    const task = await this.findById(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: {
        isCompleted: !task.isCompleted,
        completedAt: !task.isCompleted ? new Date() : null,
      },
    });
  }

  async getStats(userId: string) {
    const [total, completed, today] = await Promise.all([
      this.prisma.task.count({ where: { userId } }),
      this.prisma.task.count({ where: { userId, isCompleted: true } }),
      this.prisma.task.count({
        where: {
          userId,
          isCompleted: false,
          OR: [
            { date: null },
            {
              date: {
                gte: startOfDay(new Date()),
                lte: endOfDay(new Date()),
              },
            },
          ],
        },
      }),
    ]);
    return { total, completed, today };
  }
}
