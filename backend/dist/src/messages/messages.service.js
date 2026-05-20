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
exports.MessagesService = exports.SendMessageDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
class SendMessageDto {
    content;
    imageUrl;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "imageUrl", void 0);
const SENDER_SELECT = {
    id: true, username: true, displayName: true, avatarUrl: true,
};
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDMs(userId, otherUserId, cursor) {
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
    async sendDM(senderId, recipientId, dto) {
        return this.prisma.message.create({
            data: { senderId, recipientId, content: dto.content, imageUrl: dto.imageUrl },
            include: { sender: { select: SENDER_SELECT } },
        });
    }
    async getRoomMessages(roomId, userId, cursor) {
        const member = await this.prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (!member)
            throw new common_1.ForbiddenException('Not a member of this room');
        return this.prisma.message.findMany({
            where: { roomId, isDeleted: false },
            include: { sender: { select: SENDER_SELECT } },
            orderBy: { createdAt: 'desc' },
            take: 50,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        });
    }
    async sendRoomMessage(roomId, senderId, dto) {
        const member = await this.prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId: senderId } },
        });
        if (!member)
            throw new common_1.ForbiddenException('Not a member of this room');
        return this.prisma.message.create({
            data: { senderId, roomId, content: dto.content, imageUrl: dto.imageUrl },
            include: { sender: { select: SENDER_SELECT } },
        });
    }
    async getConversationList(userId) {
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
        const seen = new Set();
        return messages.filter((m) => {
            const otherId = m.senderId === userId ? m.recipientId : m.senderId;
            if (seen.has(otherId))
                return false;
            seen.add(otherId);
            return true;
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map