"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const MEMBER_SELECT = {
    id: true, username: true, displayName: true, avatarUrl: true,
    status: true,
};
const ROOM_INCLUDE = {
    members: {
        include: { user: { select: MEMBER_SELECT } },
        orderBy: { joinedAt: 'asc' },
    },
    tasks: {
        include: { task: true },
        orderBy: { createdAt: 'asc' },
    },
    emojis: {
        orderBy: { createdAt: 'asc' },
    },
};
let RoomsService = class RoomsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.room.create({
            data: {
                ...dto,
                createdById: userId,
                members: { create: { userId, role: client_1.RoomRole.OWNER } },
            },
            include: ROOM_INCLUDE,
        });
    }
    async getMyRooms(userId) {
        const memberships = await this.prisma.roomMember.findMany({
            where: { userId },
            include: { room: { include: ROOM_INCLUDE } },
            orderBy: { joinedAt: 'desc' },
        });
        return memberships.map(m => m.room);
    }
    async getPublicRooms(userId) {
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
    async getRoom(id, userId) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: ROOM_INCLUDE,
        });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const isMember = room.members.some(m => m.userId === userId);
        if (!isMember && !room.isPublic)
            throw new common_1.ForbiddenException('Not a member');
        return room;
    }
    async invite(roomId, inviterId, targetUserId) {
        await this.assertMember(roomId, inviterId);
        const exists = await this.prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId: targetUserId } },
        });
        if (exists)
            throw new common_1.ConflictException('User is already a member');
        return this.prisma.roomMember.create({
            data: { roomId, userId: targetUserId, role: client_1.RoomRole.MEMBER },
            include: { user: { select: MEMBER_SELECT } },
        });
    }
    async join(roomId, userId) {
        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        if (!room.isPublic)
            throw new common_1.ForbiddenException('Room is private');
        const exists = await this.prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (exists)
            throw new common_1.ConflictException('Already a member');
        return this.prisma.roomMember.create({
            data: { roomId, userId, role: client_1.RoomRole.MEMBER },
        });
    }
    async leave(roomId, userId) {
        await this.assertMember(roomId, userId);
        await this.prisma.roomMember.delete({
            where: { roomId_userId: { roomId, userId } },
        });
    }
    async delete(roomId, userId) {
        const member = await this.prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (!member || member.role !== client_1.RoomRole.OWNER)
            throw new common_1.ForbiddenException('Only the owner can delete');
        await this.prisma.room.delete({ where: { id: roomId } });
    }
    async addTask(roomId, userId, title) {
        await this.assertMember(roomId, userId);
        const task = await this.prisma.task.create({
            data: { userId, title, isPublic: true },
        });
        return this.prisma.roomTask.create({
            data: { roomId, taskId: task.id },
            include: { task: true },
        });
    }
    async setTaskStatus(roomId, taskId, userId, status) {
        await this.assertMember(roomId, userId);
        const rt = await this.prisma.roomTask.findFirst({ where: { roomId, taskId } });
        if (!rt)
            throw new common_1.NotFoundException('Task not in this room');
        const remove = (arr) => arr.filter(id => id !== userId);
        const add = (arr) => (arr.includes(userId) ? arr : [...arr, userId]);
        let completedBy = remove(rt.completedBy);
        let failedBy = remove(rt.failedBy);
        let skippedBy = remove(rt.skippedBy);
        if (status === 'DONE')
            completedBy = add(completedBy);
        else if (status === 'FAILED')
            failedBy = add(failedBy);
        else if (status === 'SKIP')
            skippedBy = add(skippedBy);
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
    async addEmoji(roomId, userId, name, imageUrl) {
        await this.assertMember(roomId, userId);
        return this.prisma.roomEmoji.create({
            data: { roomId, name, imageUrl, addedById: userId },
        });
    }
    async getEmojis(roomId) {
        return this.prisma.roomEmoji.findMany({
            where: { roomId },
            orderBy: { name: 'asc' },
        });
    }
    async deleteEmoji(emojiId, userId) {
        const emoji = await this.prisma.roomEmoji.findUnique({ where: { id: emojiId } });
        if (!emoji)
            throw new common_1.NotFoundException('Emoji not found');
        if (emoji.addedById !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.roomEmoji.delete({ where: { id: emojiId } });
    }
    async assertMember(roomId, userId) {
        const m = await this.prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (!m)
            throw new common_1.ForbiddenException('Not a member of this room');
        return m;
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map