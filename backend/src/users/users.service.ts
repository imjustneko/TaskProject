import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash'>;

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

  async findByUsername(username: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { status: true },
    });
    return user ? this.sanitize(user) : null;
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
    return users.map(this.sanitize);
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
