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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tasks_utils_1 = require("./tasks.utils");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.task.create({
            data: {
                userId,
                ...dto,
                date: dto.date ? new Date(dto.date) : null,
            },
        });
    }
    async findToday(userId) {
        const now = new Date();
        return this.prisma.task.findMany({
            where: {
                userId,
                isCompleted: false,
                OR: [
                    { date: null },
                    { date: { gte: (0, tasks_utils_1.startOfDay)(now), lte: (0, tasks_utils_1.endOfDay)(now) } },
                ],
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        });
    }
    async findPlans(userId) {
        const tomorrow = (0, tasks_utils_1.startOfDay)(new Date());
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.prisma.task.findMany({
            where: {
                userId,
                isCompleted: false,
                date: { gte: tomorrow },
            },
            orderBy: { date: 'asc' },
        });
    }
    async findHistory(userId) {
        return this.prisma.task.findMany({
            where: { userId, isCompleted: true },
            orderBy: { completedAt: 'desc' },
            take: 100,
        });
    }
    async findById(id, userId) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (task.userId !== userId)
            throw new common_1.ForbiddenException();
        return task;
    }
    async update(id, userId, dto) {
        await this.findById(id, userId);
        return this.prisma.task.update({
            where: { id },
            data: {
                ...dto,
                date: dto.date !== undefined ? (dto.date ? new Date(dto.date) : null) : undefined,
            },
        });
    }
    async remove(id, userId) {
        await this.findById(id, userId);
        await this.prisma.task.delete({ where: { id } });
    }
    async toggleComplete(id, userId) {
        const task = await this.findById(id, userId);
        return this.prisma.task.update({
            where: { id },
            data: {
                isCompleted: !task.isCompleted,
                completedAt: !task.isCompleted ? new Date() : null,
            },
        });
    }
    async getStats(userId) {
        const [total, completed, today] = await Promise.all([
            this.prisma.task.count({ where: { userId } }),
            this.prisma.task.count({ where: { userId, isCompleted: true } }),
            this.prisma.task.count({
                where: {
                    userId,
                    isCompleted: false,
                    OR: [
                        { date: null },
                        {
                            date: {
                                gte: (0, tasks_utils_1.startOfDay)(new Date()),
                                lte: (0, tasks_utils_1.endOfDay)(new Date()),
                            },
                        },
                    ],
                },
            }),
        ]);
        return { total, completed, today };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map