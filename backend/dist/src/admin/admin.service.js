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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [totalUsers, activeUsers, totalTasks, completedTasks, totalRooms] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isBlocked: false } }),
            this.prisma.task.count(),
            this.prisma.task.count({ where: { isCompleted: true } }),
            this.prisma.room.count(),
        ]);
        return { totalUsers, activeUsers, totalTasks, completedTasks, totalRooms };
    }
    async getUsers(search, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { displayName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true, email: true, username: true, displayName: true,
                    avatarUrl: true, role: true, isBlocked: true, createdAt: true,
                    _count: { select: { tasks: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return { users, total, page, limit };
    }
    async blockUser(userId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: true },
            select: { id: true, isBlocked: true },
        });
    }
    async unblockUser(userId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: false },
            select: { id: true, isBlocked: true },
        });
    }
    async deleteUser(userId) {
        await this.prisma.user.delete({ where: { id: userId } });
    }
    async getRecentUsers(limit = 5) {
        return this.prisma.user.findMany({
            select: {
                id: true, username: true, displayName: true,
                avatarUrl: true, email: true, createdAt: true, isBlocked: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map