import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { RoomRole, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

const MEMBER_SELECT = {
  id: true, username: true, displayName: true, avatarUrl: true,
  status: true,
};

const ROOM_INCLUDE = {
  members: {
    include: { user: { select: MEMBER_SELECT } },
    orderBy: { joinedAt: 'asc' as const },
  },
  tasks: {
    include: { task: true },
    orderBy: { createdAt: 'asc' as const },
  },
  emojis: {
    orderBy: { createdAt: 'asc' as const },
  },
};

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        ...dto,
        createdById: userId,
        members: { create: { userId, role: RoomRole.OWNER } },
      },
      include: ROOM_INCLUDE,
    });
  }

  async getMyRooms(userId: string) {
    const memberships = await this.prisma.roomMember.findMany({
      where: { userId },
      include: { room: { include: ROOM_INCLUDE } },
      orderBy: { joinedAt: 'desc' },
    });
    return memberships.map(m => m.room);
  }

  async getPublicRooms(userId: string) {
    const myRoomIds = (await this.prisma.roomMember.findMany({
      where: { userId },
      select: { roomId: true },
    })).map(m => m.roomId);

    return this.prisma.room.findMany({
      where: {
        isPublic: true,
        id: { notIn: myRoomIds },
      },
      include: ROOM_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRoom(id: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: ROOM_INCLUDE,
    });
    if (!room) throw new NotFoundException('Room not found');
    const isMember = room.members.some(m => m.userId === userId);
    if (!isMember && !room.isPublic) throw new ForbiddenException('Not a member');
    return room;
  }

  async invite(roomId: string, inviterId: string, targetUserId: string) {
    await this.assertMember(roomId, inviterId);
    const exists = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: targetUserId } },
    });
    if (exists) throw new ConflictException('User is already a member');
    return this.prisma.roomMember.create({
      data: { roomId, userId: targetUserId, role: RoomRole.MEMBER },
      include: { user: { select: MEMBER_SELECT } },
    });
  }

  async join(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    if (!room.isPublic) throw new ForbiddenException('Room is private');
    const exists = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (exists) throw new ConflictException('Already a member');
    return this.prisma.roomMember.create({
      data: { roomId, userId, role: RoomRole.MEMBER },
    });
  }

  async leave(roomId: string, userId: string) {
    await this.assertMember(roomId, userId);
    await this.prisma.roomMember.delete({
      where: { roomId_userId: { roomId, userId } },
    });
  }

  async update(roomId: string, userId: string, dto: Partial<{ name: string; description: string | null; activityType: string | null; isPublic: boolean; imageUrl: string | null }>) {
    const member = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member || member.role !== RoomRole.OWNER) throw new ForbiddenException('Only the owner can edit this room');
    return this.prisma.room.update({
      where: { id: roomId },
      data: dto as Prisma.RoomUpdateInput,
      include: ROOM_INCLUDE,
    });
  }

  async delete(roomId: string, userId: string) {
    const member = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member || member.role !== RoomRole.OWNER) throw new ForbiddenException('Only the owner can delete');
    await this.prisma.room.delete({ where: { id: roomId } });
  }

  async addTask(roomId: string, userId: string, title: string) {
    await this.assertMember(roomId, userId);
    const task = await this.prisma.task.create({
      data: { userId, title, isPublic: true },
    });
    return this.prisma.roomTask.create({
      data: { roomId, taskId: task.id },
      include: { task: true },
    });
  }

  async setTaskStatus(
    roomId: string,
    taskId: string,
    userId: string,
    status: 'DONE' | 'FAILED' | 'SKIP' | 'RESET',
  ) {
    await this.assertMember(roomId, userId);
    const rt = await this.prisma.roomTask.findFirst({ where: { roomId, taskId } });
    if (!rt) throw new NotFoundException('Task not in this room');

    const remove = (arr: string[]) => arr.filter(id => id !== userId);
    const add = (arr: string[]) => (arr.includes(userId) ? arr : [...arr, userId]);

    let completedBy = remove(rt.completedBy);
    let failedBy = remove(rt.failedBy);
    let skippedBy = remove(rt.skippedBy);

    if (status === 'DONE') completedBy = add(completedBy);
    else if (status === 'FAILED') failedBy = add(failedBy);
    else if (status === 'SKIP') skippedBy = add(skippedBy);

    return this.prisma.roomTask.update({
      where: { id: rt.id },
      data: {
        completedBy: { set: completedBy },
        failedBy: { set: failedBy },
        skippedBy: { set: skippedBy },
      },
      include: { task: true },
    });
  }

  async addEmoji(roomId: string, userId: string, name: string, imageUrl: string) {
    await this.assertMember(roomId, userId);
    return this.prisma.roomEmoji.create({
      data: { roomId, name, imageUrl, addedById: userId },
    });
  }

  async getEmojis(roomId: string) {
    return this.prisma.roomEmoji.findMany({
      where: { roomId },
      orderBy: { name: 'asc' },
    });
  }

  async deleteEmoji(emojiId: string, userId: string) {
    const emoji = await this.prisma.roomEmoji.findUnique({ where: { id: emojiId } });
    if (!emoji) throw new NotFoundException('Emoji not found');
    if (emoji.addedById !== userId) throw new ForbiddenException();
    await this.prisma.roomEmoji.delete({ where: { id: emojiId } });
  }

  private async assertMember(roomId: string, userId: string) {
    const m = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!m) throw new ForbiddenException('Not a member of this room');
    return m;
  }
}
