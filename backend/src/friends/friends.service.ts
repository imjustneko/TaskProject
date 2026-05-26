import {
  Injectable, ConflictException, NotFoundException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { FriendStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

const USER_SELECT = {
  id: true, username: true, displayName: true,
  avatarUrl: true, bio: true, status: true,
};

@Injectable()
export class FriendsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notif: NotificationsService,
  ) {}

  async sendRequest(requesterId: string, recipientId: string) {
    if (requesterId === recipientId) {
      throw new BadRequestException('Cannot add yourself');
    }
    const existing = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId, recipientId },
          { requesterId: recipientId, recipientId: requesterId },
        ],
      },
    });
    if (existing) {
      if (existing.status === FriendStatus.ACCEPTED)
        throw new ConflictException('Already friends');
      if (existing.status === FriendStatus.PENDING)
        throw new ConflictException('Request already sent');
      throw new ConflictException('Cannot send request');
    }
    const friendship = await this.prisma.friend.create({
      data: { requesterId, recipientId },
      include: { recipient: { select: USER_SELECT } },
    });
    await this.notif.create({
      userId: recipientId,
      type: 'FRIEND_REQUEST',
      fromId: requesterId,
      referenceId: friendship.id,
    });
    return friendship;
  }

  async acceptRequest(requestId: string, userId: string) {
    const req = await this.prisma.friend.findUnique({ where: { id: requestId } });
    if (!req) throw new NotFoundException('Request not found');
    if (req.recipientId !== userId) throw new ForbiddenException();
    if (req.status !== FriendStatus.PENDING)
      throw new BadRequestException('Request is no longer pending');

    const updated = await this.prisma.friend.update({
      where: { id: requestId },
      data: { status: FriendStatus.ACCEPTED },
      include: { requester: { select: USER_SELECT } },
    });
    await this.notif.create({
      userId: req.requesterId,
      type: 'FRIEND_ACCEPTED',
      fromId: userId,
      referenceId: requestId,
    });
    return updated;
  }

  async declineRequest(requestId: string, userId: string) {
    const req = await this.prisma.friend.findUnique({ where: { id: requestId } });
    if (!req) throw new NotFoundException('Request not found');
    if (req.recipientId !== userId) throw new ForbiddenException();

    await this.prisma.friend.update({
      where: { id: requestId },
      data: { status: FriendStatus.DECLINED },
    });
  }

  async unfriend(userId: string, friendId: string) {
    const friendship = await this.prisma.friend.findFirst({
      where: {
        status: FriendStatus.ACCEPTED,
        OR: [
          { requesterId: userId, recipientId: friendId },
          { requesterId: friendId, recipientId: userId },
        ],
      },
    });
    if (!friendship) throw new NotFoundException('Friendship not found');
    await this.prisma.friend.delete({ where: { id: friendship.id } });
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friend.findMany({
      where: {
        status: FriendStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { recipientId: userId }],
      },
      include: {
        requester: { select: USER_SELECT },
        recipient: { select: USER_SELECT },
      },
    });
    return friendships.map((f) =>
      f.requesterId === userId ? f.recipient : f.requester,
    );
  }

  async getIncomingRequests(userId: string) {
    return this.prisma.friend.findMany({
      where: { recipientId: userId, status: FriendStatus.PENDING },
      include: { requester: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSentRequests(userId: string) {
    return this.prisma.friend.findMany({
      where: { requesterId: userId, status: FriendStatus.PENDING },
      include: { recipient: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelationship(userId: string, targetId: string) {
    return this.prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId: userId, recipientId: targetId },
          { requesterId: targetId, recipientId: userId },
        ],
      },
    });
  }
}
