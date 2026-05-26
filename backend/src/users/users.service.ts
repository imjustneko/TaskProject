import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash'>;

type SafeUserWithStatus = SafeUser & { status?: { presence?: string } | null };

function maskInvisible(user: SafeUserWithStatus, viewerId?: string | null): SafeUserWithStatus {
  if (!user.status?.presence) return user;
  if (user.status.presence !== 'INVISIBLE') return user;
  if (user.id === viewerId) return user;
  return { ...user, status: { ...user.status, presence: 'OFFLINE' } };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  sanitize(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { status: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string, viewerId?: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { status: true },
    });
    if (!user) return null;
    return maskInvisible(this.sanitize(user), viewerId);
  }

  async checkUniqueness(email: string, username: string): Promise<void> {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { email: true, username: true },
    });
    if (exists) {
      if (exists.email === email) throw new ConflictException('Email already in use');
      throw new ConflictException('Username already taken');
    }
  }

  async search(query: string, currentUserId: string): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          { isBlocked: false },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { displayName: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: { status: true },
      take: 20,
    });
    return users.map(u => maskInvisible(this.sanitize(u), currentUserId));
  }

  async getEmojis(userId: string) {
    return this.prisma.userEmoji.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async addEmoji(userId: string, name: string, imageUrl: string) {
    return this.prisma.userEmoji.upsert({
      where: { userId_name: { userId, name } },
      create: { userId, name, imageUrl },
      update: { imageUrl },
    });
  }

  async deleteEmoji(id: string, userId: string) {
    const emoji = await this.prisma.userEmoji.findUnique({ where: { id } });
    if (!emoji || emoji.userId !== userId) return;
    await this.prisma.userEmoji.delete({ where: { id } });
  }

  async getPublicStats(username: string, viewerId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { status: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const [completedCount, publicTasks, logs] = await Promise.all([
      this.prisma.task.count({ where: { userId: user.id, isCompleted: true } }),
      this.prisma.task.findMany({
        where: { userId: user.id, isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { labels: { include: { label: true } } },
      }),
      this.prisma.taskLog.findMany({
        where: { userId: user.id, status: 'DONE' },
        select: { date: true },
        orderBy: { date: 'desc' },
      }),
    ]);

    const doneDays = new Set(logs.map(l => l.date.toISOString().slice(0, 10)));
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let streak = 0;
    const startDay = doneDays.has(todayStr) ? todayStr : doneDays.has(yesterdayStr) ? yesterdayStr : null;
    if (startDay) {
      const d = new Date(startDay + 'T12:00:00');
      while (doneDays.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
    }

    const safeUser = maskInvisible(this.sanitize(user), viewerId);
    return { user: safeUser, completedCount, streak, publicTasks };
  }

  async generateUniqueUsername(email: string, displayName?: string | null): Promise<string> {
    const base = (email.split('@')[0] ?? displayName ?? 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 18) || 'user';

    let candidate = base.length >= 3 ? base : `${base}_user`;
    for (let i = 1; i <= 9999; i++) {
      const exists = await this.prisma.user.findUnique({ where: { username: candidate } });
      if (!exists) return candidate;
      candidate = `${base}${i}`;
    }
    return `user_${Date.now().toString(36)}`;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.passwordHash) throw new BadRequestException('OAUTH_ACCOUNT');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('WRONG_PASSWORD');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async updateProfile(
    id: string,
    data: { displayName?: string; bio?: string; avatarUrl?: string | null },
  ): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { status: true },
    });
    return this.sanitize(user);
  }
}
