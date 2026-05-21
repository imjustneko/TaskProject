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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function maskInvisible(user, viewerId) {
    if (!user.status?.presence)
        return user;
    if (user.status.presence !== 'INVISIBLE')
        return user;
    if (user.id === viewerId)
        return user;
    return { ...user, status: { ...user.status, presence: 'OFFLINE' } };
}
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    sanitize(user) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { status: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.sanitize(user);
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findByUsername(username, viewerId) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            include: { status: true },
        });
        if (!user)
            return null;
        return maskInvisible(this.sanitize(user), viewerId);
    }
    async checkUniqueness(email, username) {
        const exists = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
            select: { email: true, username: true },
        });
        if (exists) {
            if (exists.email === email)
                throw new common_1.ConflictException('Email already in use');
            throw new common_1.ConflictException('Username already taken');
        }
    }
    async search(query, currentUserId) {
        const users = await this.prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUserId } },
                    { isBlocked: false },
                    {
                        OR: [
                            { username: { contains: query, mode: 'insensitive' } },
                            { displayName: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            include: { status: true },
            take: 20,
        });
        return users.map(u => maskInvisible(this.sanitize(u), currentUserId));
    }
    async getEmojis(userId) {
        return this.prisma.userEmoji.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    }
    async addEmoji(userId, name, imageUrl) {
        return this.prisma.userEmoji.upsert({
            where: { userId_name: { userId, name } },
            create: { userId, name, imageUrl },
            update: { imageUrl },
        });
    }
    async deleteEmoji(id, userId) {
        const emoji = await this.prisma.userEmoji.findUnique({ where: { id } });
        if (!emoji || emoji.userId !== userId)
            return;
        await this.prisma.userEmoji.delete({ where: { id } });
    }
    async getPublicStats(username, viewerId) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            include: { status: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const [completedCount, publicTasks, logs] = await Promise.all([
            this.prisma.task.count({ where: { userId: user.id, isCompleted: true } }),
            this.prisma.task.findMany({
                where: { userId: user.id, isPublic: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { labels: { include: { label: true } } },
            }),
            this.prisma.taskLog.findMany({
                where: { userId: user.id, status: 'DONE' },
                select: { date: true },
                orderBy: { date: 'desc' },
            }),
        ]);
        const doneDays = new Set(logs.map(l => l.date.toISOString().slice(0, 10)));
        const todayStr = new Date().toISOString().slice(0, 10);
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let streak = 0;
        const startDay = doneDays.has(todayStr) ? todayStr : doneDays.has(yesterdayStr) ? yesterdayStr : null;
        if (startDay) {
            const d = new Date(startDay + 'T12:00:00');
            while (doneDays.has(d.toISOString().slice(0, 10))) {
                streak++;
                d.setDate(d.getDate() - 1);
            }
        }
        const safeUser = maskInvisible(this.sanitize(user), viewerId);
        return { user: safeUser, completedCount, streak, publicTasks };
    }
    async updateProfile(id, data) {
        const user = await this.prisma.user.update({
            where: { id },
            data,
            include: { status: true },
        });
        return this.sanitize(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map