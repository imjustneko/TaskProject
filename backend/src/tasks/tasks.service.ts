import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import type { LogStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { startOfDay, endOfDay } from './tasks.utils';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly TASK_INCLUDE = { labels: { include: { label: true } } };

  async create(userId: string, dto: CreateTaskDto) {
    const { labelIds, ...rest } = dto;
    return this.prisma.task.create({
      data: {
        userId,
        ...rest,
        date: rest.date ? new Date(rest.date) : null,
        labels: labelIds?.length
          ? { create: labelIds.map(labelId => ({ labelId })) }
          : undefined,
      },
      include: this.TASK_INCLUDE,
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
      include: this.TASK_INCLUDE,
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
      include: this.TASK_INCLUDE,
    });
  }

  async findHistory(userId: string) {
    return this.prisma.task.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: 'desc' },
      take: 100,
      include: this.TASK_INCLUDE,
    });
  }

  async findById(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id }, include: this.TASK_INCLUDE });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    await this.findById(id, userId);
    const { labelIds, ...rest } = dto as UpdateTaskDto & { labelIds?: string[] };
    if (labelIds !== undefined) {
      await this.prisma.taskLabel.deleteMany({ where: { taskId: id } });
      if (labelIds.length) {
        await this.prisma.taskLabel.createMany({ data: labelIds.map(labelId => ({ taskId: id, labelId })) });
      }
    }
    return this.prisma.task.update({
      where: { id },
      data: { ...rest, date: rest.date !== undefined ? (rest.date ? new Date(rest.date) : null) : undefined },
      include: this.TASK_INCLUDE,
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
      include: this.TASK_INCLUDE,
    });
  }

  async getStreak(userId: string) {
    const logs = await this.prisma.taskLog.findMany({
      where: { userId, status: 'DONE' },
      select: { date: true },
      orderBy: { date: 'desc' },
    });

    const doneDays = new Set(logs.map(l => l.date.toISOString().slice(0, 10)));
    const today = startOfDay(new Date()).toISOString().slice(0, 10);
    const yesterday = startOfDay(new Date(Date.now() - 86400000)).toISOString().slice(0, 10);

    let current = 0;
    let check = doneDays.has(today) ? today : (doneDays.has(yesterday) ? yesterday : null);
    if (check) {
      const d = new Date(check + 'T12:00:00');
      while (doneDays.has(d.toISOString().slice(0, 10))) {
        current++;
        d.setDate(d.getDate() - 1);
      }
    }

    let best = 0;
    let run = 0;
    const sorted = [...doneDays].sort();
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) { run = 1; }
      else {
        const prev = new Date(sorted[i - 1] + 'T12:00:00');
        prev.setDate(prev.getDate() + 1);
        if (prev.toISOString().slice(0, 10) === sorted[i]) run++;
        else run = 1;
      }
      if (run > best) best = run;
    }

    return { current, best };
  }

  async setDailyStatus(taskId: string, userId: string, status: LogStatus, note?: string) {
    await this.findById(taskId, userId);
    const date = startOfDay(new Date());
    return this.prisma.taskLog.upsert({
      where: { taskId_userId_date: { taskId, userId, date } },
      create: { taskId, userId, date, status, note },
      update: { status, note },
    });
  }

  async clearDailyStatus(taskId: string, userId: string) {
    await this.findById(taskId, userId);
    const date = startOfDay(new Date());
    await this.prisma.taskLog.deleteMany({
      where: { taskId, userId, date },
    });
  }

  async getTodayLogs(userId: string) {
    const date = startOfDay(new Date());
    return this.prisma.taskLog.findMany({
      where: { userId, date },
      include: { task: true },
    });
  }

  async getDailyLogs(userId: string, fromStr: string, toStr: string) {
    const from = fromStr ? new Date(fromStr) : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return startOfDay(d); })();
    const to = toStr ? new Date(toStr) : endOfDay(new Date());
    return this.prisma.taskLog.findMany({
      where: { userId, date: { gte: from, lte: to } },
      include: { task: true },
      orderBy: { date: 'desc' },
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
