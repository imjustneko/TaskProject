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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const tasks_utils_1 = require("../tasks/tasks.utils");
const USER_SELECT = {
    id: true, username: true, displayName: true, avatarUrl: true, bio: true, status: true,
};
let PartnersService = class PartnersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendRequest(requesterId, partnerId) {
        if (requesterId === partnerId)
            throw new common_1.BadRequestException('Cannot partner with yourself');
        const existing = await this.prisma.accountabilityPair.findFirst({
            where: {
                OR: [
                    { requesterId, partnerId },
                    { requesterId: partnerId, partnerId: requesterId },
                ],
            },
        });
        if (existing) {
            if (existing.status === client_1.PartnerStatus.ACTIVE)
                throw new common_1.ConflictException('Already partners');
            if (existing.status === client_1.PartnerStatus.PENDING)
                throw new common_1.ConflictException('Request already sent');
            return this.prisma.accountabilityPair.update({
                where: { id: existing.id },
                data: { status: client_1.PartnerStatus.PENDING, requesterId, partnerId },
                include: { partner: { select: USER_SELECT } },
            });
        }
        return this.prisma.accountabilityPair.create({
            data: { requesterId, partnerId },
            include: { partner: { select: USER_SELECT } },
        });
    }
    async accept(pairId, userId) {
        const pair = await this.prisma.accountabilityPair.findUnique({ where: { id: pairId } });
        if (!pair)
            throw new common_1.NotFoundException();
        if (pair.partnerId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.accountabilityPair.update({
            where: { id: pairId },
            data: { status: client_1.PartnerStatus.ACTIVE },
            include: { requester: { select: USER_SELECT } },
        });
    }
    async decline(pairId, userId) {
        const pair = await this.prisma.accountabilityPair.findUnique({ where: { id: pairId } });
        if (!pair)
            throw new common_1.NotFoundException();
        if (pair.partnerId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.accountabilityPair.update({
            where: { id: pairId },
            data: { status: client_1.PartnerStatus.DECLINED },
        });
    }
    async remove(pairId, userId) {
        const pair = await this.prisma.accountabilityPair.findUnique({ where: { id: pairId } });
        if (!pair)
            throw new common_1.NotFoundException();
        if (pair.requesterId !== userId && pair.partnerId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.accountabilityPair.delete({ where: { id: pairId } });
    }
    async getIncomingRequests(userId) {
        return this.prisma.accountabilityPair.findMany({
            where: { partnerId: userId, status: client_1.PartnerStatus.PENDING },
            include: { requester: { select: USER_SELECT } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyPartners(userId) {
        const pairs = await this.prisma.accountabilityPair.findMany({
            where: {
                status: client_1.PartnerStatus.ACTIVE,
                OR: [{ requesterId: userId }, { partnerId: userId }],
            },
            include: {
                requester: { select: USER_SELECT },
                partner: { select: USER_SELECT },
            },
        });
        const now = new Date();
        const todayStart = (0, tasks_utils_1.startOfDay)(now);
        const todayEnd = (0, tasks_utils_1.endOfDay)(now);
        const results = await Promise.all(pairs.map(async (pair) => {
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
    async getStreakCount(userId) {
        const logs = await this.prisma.taskLog.findMany({
            where: { userId, status: 'DONE' },
            select: { date: true },
            orderBy: { date: 'desc' },
        });
        const doneDays = new Set(logs.map(l => l.date.toISOString().slice(0, 10)));
        const today = (0, tasks_utils_1.startOfDay)(new Date()).toISOString().slice(0, 10);
        const yesterday = (0, tasks_utils_1.startOfDay)(new Date(Date.now() - 86400000)).toISOString().slice(0, 10);
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
    async isFriend(userId, targetId) {
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
    async getPairStatus(userId, targetId) {
        return this.prisma.accountabilityPair.findFirst({
            where: {
                OR: [
                    { requesterId: userId, partnerId: targetId },
                    { requesterId: targetId, partnerId: userId },
                ],
            },
        });
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PartnersService);
//# sourceMappingURL=partners.service.js.map