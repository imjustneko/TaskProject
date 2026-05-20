import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { RoomRole } from '@prisma/client';
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
};

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        ...dto,
        createdById: userId,
        members: { create: { userId, role: RoomRole.OWNER } },
      },
      include: ROOM_INCLUDE,
    });
    return room;
  }

  async getMyRooms(userId: string) {
    const memberships = await this.prisma.roomMember.findMany({
      where: { userId },
      include: {
        room: { include: ROOM_INCLUDE },
      },
      orderBy: { joinedAt: 'desc' },
    });
    return memberships.map(m => m.room);
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

  async leave(roomId: string, userId: string) {
    await this.assertMember(roomId, userId);
    await this.prisma.roomMember.delete({
      where: { roomId_userId: { roomId, userId } },
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

  async toggleTaskCompletion(roomId: string, taskId: string, userId: string) {
    await this.assertMember(roomId, userId);
    const rt = await this.prisma.roomTask.findFirst({
      where: { roomId, taskId },
    });
    if (!rt) throw new NotFoundException('Task not in this room');

    const already = rt.completedBy.includes(userId);
    return this.prisma.roomTask.update({
      where: { id: rt.id },
      data: {
        completedBy: already
          ? { set: rt.completedBy.filter(id => id !== userId) }
          : { push: userId },
      },
      include: { task: true },
    });
  }

  private async assertMember(roomId: string, userId: string) {
    const m = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!m) throw new ForbiddenException('Not a member of this room');
    return m;
  }
}
