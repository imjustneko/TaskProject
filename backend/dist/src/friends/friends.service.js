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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const USER_SELECT = {
    id: true, username: true, displayName: true,
    avatarUrl: true, bio: true, status: true,
};
let FriendsService = class FriendsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendRequest(requesterId, recipientId) {
        if (requesterId === recipientId) {
            throw new common_1.BadRequestException('Cannot add yourself');
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
            if (existing.status === client_1.FriendStatus.ACCEPTED)
                throw new common_1.ConflictException('Already friends');
            if (existing.status === client_1.FriendStatus.PENDING)
                throw new common_1.ConflictException('Request already sent');
            throw new common_1.ConflictException('Cannot send request');
        }
        return this.prisma.friend.create({
            data: { requesterId, recipientId },
            include: { recipient: { select: USER_SELECT } },
        });
    }
    async acceptRequest(requestId, userId) {
        const req = await this.prisma.friend.findUnique({ where: { id: requestId } });
        if (!req)
            throw new common_1.NotFoundException('Request not found');
        if (req.recipientId !== userId)
            throw new common_1.ForbiddenException();
        if (req.status !== client_1.FriendStatus.PENDING)
            throw new common_1.BadRequestException('Request is no longer pending');
        return this.prisma.friend.update({
            where: { id: requestId },
            data: { status: client_1.FriendStatus.ACCEPTED },
            include: { requester: { select: USER_SELECT } },
        });
    }
    async declineRequest(requestId, userId) {
        const req = await this.prisma.friend.findUnique({ where: { id: requestId } });
        if (!req)
            throw new common_1.NotFoundException('Request not found');
        if (req.recipientId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.friend.update({
            where: { id: requestId },
            data: { status: client_1.FriendStatus.DECLINED },
        });
    }
    async unfriend(userId, friendId) {
        const friendship = await this.prisma.friend.findFirst({
            where: {
                status: client_1.FriendStatus.ACCEPTED,
                OR: [
                    { requesterId: userId, recipientId: friendId },
                    { requesterId: friendId, recipientId: userId },
                ],
            },
        });
        if (!friendship)
            throw new common_1.NotFoundException('Friendship not found');
        await this.prisma.friend.delete({ where: { id: friendship.id } });
    }
    async getFriends(userId) {
        const friendships = await this.prisma.friend.findMany({
            where: {
                status: client_1.FriendStatus.ACCEPTED,
                OR: [{ requesterId: userId }, { recipientId: userId }],
            },
            include: {
                requester: { select: USER_SELECT },
                recipient: { select: USER_SELECT },
            },
        });
        return friendships.map((f) => f.requesterId === userId ? f.recipient : f.requester);
    }
    async getIncomingRequests(userId) {
        return this.prisma.friend.findMany({
            where: { recipientId: userId, status: client_1.FriendStatus.PENDING },
            include: { requester: { select: USER_SELECT } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getSentRequests(userId) {
        return this.prisma.friend.findMany({
            where: { requesterId: userId, status: client_1.FriendStatus.PENDING },
            include: { recipient: { select: USER_SELECT } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getRelationship(userId, targetId) {
        return this.prisma.friend.findFirst({
            where: {
                OR: [
                    { requesterId: userId, recipientId: targetId },
                    { requesterId: targetId, recipientId: userId },
                ],
            },
        });
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendsService);
//# sourceMappingURL=friends.service.js.map