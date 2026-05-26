import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, activeUsers, totalTasks, completedTasks, totalRooms] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isBlocked: false } }),
        this.prisma.task.count(),
        this.prisma.task.count({ where: { isCompleted: true } }),
        this.prisma.room.count(),
      ]);
    return { totalUsers, activeUsers, totalTasks, completedTasks, totalRooms };
  }

  async getUsers(search?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' as const } },
            { displayName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, email: true, username: true, displayName: true,
          avatarUrl: true, role: true, isBlocked: true, createdAt: true,
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async blockUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: true },
      select: { id: true, isBlocked: true },
    });
  }

  async unblockUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false },
      select: { id: true, isBlocked: true },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async setRole(userId: string, role: 'USER' | 'ADMIN') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true },
    });
  }

  async getRecentUsers(limit = 5) {
    return this.prisma.user.findMany({
      select: {
        id: true, username: true, displayName: true,
        avatarUrl: true, email: true, createdAt: true, isBlocked: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
