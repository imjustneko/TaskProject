import { Injectable, ForbiddenException } from '@nestjs/common';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

const SENDER_SELECT = {
  id: true, username: true, displayName: true, avatarUrl: true,
};

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDMs(userId: string, otherUserId: string, cursor?: string) {
    return this.prisma.message.findMany({
      where: {
        roomId: null,
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
        isDeleted: false,
      },
      include: { sender: { select: SENDER_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

  async sendDM(senderId: string, recipientId: string, dto: SendMessageDto) {
    return this.prisma.message.create({
      data: { senderId, recipientId, content: dto.content, imageUrl: dto.imageUrl },
      include: { sender: { select: SENDER_SELECT } },
    });
  }

  async getRoomMessages(roomId: string, userId: string, cursor?: string) {
    const member = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this room');

    return this.prisma.message.findMany({
      where: { roomId, isDeleted: false },
      include: { sender: { select: SENDER_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

  async sendRoomMessage(roomId: string, senderId: string, dto: SendMessageDto) {
    const member = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: senderId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this room');

    return this.prisma.message.create({
      data: { senderId, roomId, content: dto.content, imageUrl: dto.imageUrl },
      include: { sender: { select: SENDER_SELECT } },
    });
  }

  async getConversationList(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId: null,
        isDeleted: false,
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: { select: SENDER_SELECT },
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId', 'recipientId'],
      take: 30,
    });

    const seen = new Set<string>();
    return messages.filter((m) => {
      const otherId = m.senderId === userId ? m.recipientId! : m.senderId;
      if (seen.has(otherId)) return false;
      seen.add(otherId);
      return true;
    });
  }
}
