import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.label.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async create(userId: string, name: string, color: string) {
    return this.prisma.label.upsert({
      where: { userId_name: { userId, name } },
      create: { userId, name, color },
      update: { color },
    });
  }

  async update(id: string, userId: string, name?: string, color?: string) {
    const label = await this.prisma.label.findUnique({ where: { id } });
    if (!label || label.userId !== userId) throw new ForbiddenException();
    return this.prisma.label.update({
      where: { id },
      data: { name, color },
    });
  }

  async remove(id: string, userId: string) {
    const label = await this.prisma.label.findUnique({ where: { id } });
    if (!label) throw new NotFoundException();
    if (label.userId !== userId) throw new ForbiddenException();
    await this.prisma.label.delete({ where: { id } });
  }
}
