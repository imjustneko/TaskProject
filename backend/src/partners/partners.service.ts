import {
  Injectable, ConflictException, NotFoundException,
  ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PartnerStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay } from '../tasks/tasks.utils';

const USER_SELECT = {
  id: true, username: true, displayName: true, avatarUrl: true, bio: true, status: true,
};

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async sendRequest(requesterId: string, partnerId: string) {
    if (requesterId === partnerId) throw new BadRequestException('Cannot partner with yourself');
    const existing = await this.prisma.accountabilityPair.findFirst({
      where: {
        OR: [
          { requesterId, partnerId },
          { requesterId: partnerId, partnerId: requesterId },
        ],
      },
    });
    if (existing) {
      if (existing.status === PartnerStatus.ACTIVE) throw new ConflictException('Already partners');
      if (existing.status === PartnerStatus.PENDING) throw new ConflictException('Request already sent');
      // re-request after decline: update
      return this.prisma.accountabilityPair.update({
        where: { id: existing.id },
        data: { status: PartnerStatus.PENDING, requesterId, partnerId },
        include: { partner: { select: USER_SELECT } },
      });
    }
    return this.prisma.accountabilityPair.create({
      data: { requesterId, partnerId },
      include: { partner: { select: USER_SELECT } },
    });
  }

  async accept(pairId: string, userId: string) {
    const pair = await this.prisma.accountabilityPair.findUnique({ where: { id: pairId } });
    if (!pair) throw new NotFoundException();
    if (pair.partnerId !== userId) throw new ForbiddenException();
    return this.prisma.accountabilityPair.update({
      where: { id: pairId },
      data: { status: PartnerStatus.ACTIVE },
      include: { requester: { select: USER_SELECT } },
    });
  }

  async decline(pairId: string, userId: string) {
    const pair = await this.prisma.accountabilityPair.findUnique({ where: { id: pairId } });
    if (!pair) throw new NotFoundException();
    if (pair.partnerId !== userId) throw new ForbiddenException();
    await this.prisma.accountabilityPair.update({
      where: { id: pairId },
      data: { status: PartnerStatus.DECLINED },
    });
  }

  async remove(pairId: string, userId: string) {
    const pair = await this.prisma.accountabilityPair.findUnique({ where: { id: pairId } });
    if (!pair) throw new NotFoundException();
    if (pair.requesterId !== userId && pair.partnerId !== userId) throw new ForbiddenException();
    await this.prisma.accountabilityPair.delete({ where: { id: pairId } });
  }

  async getIncomingRequests(userId: string) {
    return this.prisma.accountabilityPair.findMany({
      where: { partnerId: userId, status: PartnerStatus.PENDING },
      include: { requester: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyPartners(userId: string) {
    const pairs = await this.prisma.accountabilityPair.findMany({
      where: {
        status: PartnerStatus.ACTIVE,
        OR: [{ requesterId: userId }, { partnerId: userId }],
      },
      include: {
        requester: { select: USER_SELECT },
        partner: { select: USER_SELECT },
      },
    });

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const results = await Promise.all(pairs.map(async pair => {
      const partnerId = pair.requesterId === userId ? pair.partnerId : pair.requesterId;
      const partnerUser = pair.requesterId === userId ? pair.partner : pair.requester;

      const [todayTotal, todayDone, streak] = await Promise.all([
        this.prisma.task.count({
          where: {
            userId: partnerId,
            OR: [{ date: null }, { date: { gte: todayStart, lte: todayEnd } }],
          },
        }),
        this.prisma.task.count({
          where: {
            userId: partnerId,
            isCompleted: true,
            completedAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        this.getStreakCount(partnerId),
      ]);

      return {
        pairId: pair.id,
        partner: partnerUser,
        todayTotal,
        todayDone,
        streak,
      };
    }));

    return results;
  }

  private async getStreakCount(userId: string): Promise<number> {
    const logs = await this.prisma.taskLog.findMany({
      where: { userId, status: 'DONE' },
      select: { date: true },
      orderBy: { date: 'desc' },
    });
    const doneDays = new Set(logs.map(l => l.date.toISOString().slice(0, 10)));
    const today = startOfDay(new Date()).toISOString().slice(0, 10);
    const yesterday = startOfDay(new Date(Date.now() - 86400000)).toISOString().slice(0, 10);

    let current = 0;
    const check = doneDays.has(today) ? today : doneDays.has(yesterday) ? yesterday : null;
    if (check) {
      const d = new Date(check + 'T12:00:00');
      while (doneDays.has(d.toISOString().slice(0, 10))) {
        current++;
        d.setDate(d.getDate() - 1);
      }
    }
    return current;
  }

  async isFriend(userId: string, targetId: string) {
    const f = await this.prisma.friend.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId, recipientId: targetId },
          { requesterId: targetId, recipientId: userId },
        ],
      },
    });
    return !!f;
  }

  async getPairStatus(userId: string, targetId: string) {
    return this.prisma.accountabilityPair.findFirst({
      where: {
        OR: [
          { requesterId: userId, partnerId: targetId },
          { requesterId: targetId, partnerId: userId },
        ],
      },
    });
  }
}
