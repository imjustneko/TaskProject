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
    TASK_INCLUDE = { labels: { include: { label: true } } };
    async create(userId, dto) {
        const { labelIds, ...rest } = dto;
        return this.prisma.task.create({
            data: {
                userId,
                ...rest,
                date: rest.date ? new Date(rest.date) : null,
                labels: labelIds?.length
                    ? { create: labelIds.map(labelId => ({ labelId })) }
                    : undefined,
            },
            include: this.TASK_INCLUDE,
        });
    }
    async findToday(userId, includeCompleted = false) {
        const now = new Date();
        return this.prisma.task.findMany({
            where: {
                userId,
                ...(includeCompleted ? {} : { isCompleted: false }),
                OR: [
                    { date: null },
                    { date: { gte: (0, tasks_utils_1.startOfDay)(now), lte: (0, tasks_utils_1.endOfDay)(now) } },
                ],
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            include: this.TASK_INCLUDE,
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
            include: this.TASK_INCLUDE,
        });
    }
    async findHistory(userId) {
        return this.prisma.task.findMany({
            where: { userId, isCompleted: true },
            orderBy: { completedAt: 'desc' },
            take: 100,
            include: this.TASK_INCLUDE,
        });
    }
    async findById(id, userId) {
        const task = await this.prisma.task.findUnique({ where: { id }, include: this.TASK_INCLUDE });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (task.userId !== userId)
            throw new common_1.ForbiddenException();
        return task;
    }
    async update(id, userId, dto) {
        await this.findById(id, userId);
        const { labelIds, ...rest } = dto;
        if (labelIds !== undefined) {
            await this.prisma.taskLabel.deleteMany({ where: { taskId: id } });
            if (labelIds.length) {
                await this.prisma.taskLabel.createMany({ data: labelIds.map(labelId => ({ taskId: id, labelId })) });
            }
        }
        return this.prisma.task.update({
            where: { id },
            data: { ...rest, date: rest.date !== undefined ? (rest.date ? new Date(rest.date) : null) : undefined },
            include: this.TASK_INCLUDE,
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
            include: this.TASK_INCLUDE,
        });
    }
    async getStreak(userId) {
        const logs = await this.prisma.taskLog.findMany({
            where: { userId, status: 'DONE' },
            select: { date: true },
            orderBy: { date: 'desc' },
        });
        const doneDays = new Set(logs.map(l => l.date.toISOString().slice(0, 10)));
        const today = (0, tasks_utils_1.startOfDay)(new Date()).toISOString().slice(0, 10);
        const yesterday = (0, tasks_utils_1.startOfDay)(new Date(Date.now() - 86400000)).toISOString().slice(0, 10);
        let current = 0;
        let check = doneDays.has(today) ? today : (doneDays.has(yesterday) ? yesterday : null);
        if (check) {
            const d = new Date(check + 'T12:00:00');
            while (doneDays.has(d.toISOString().slice(0, 10))) {
                current++;
                d.setDate(d.getDate() - 1);
            }
        }
        let best = 0;
        let run = 0;
        const sorted = [...doneDays].sort();
        for (let i = 0; i < sorted.length; i++) {
            if (i === 0) {
                run = 1;
            }
            else {
                const prev = new Date(sorted[i - 1] + 'T12:00:00');
                prev.setDate(prev.getDate() + 1);
                if (prev.toISOString().slice(0, 10) === sorted[i])
                    run++;
                else
                    run = 1;
            }
            if (run > best)
                best = run;
        }
        return { current, best };
    }
    async setDailyStatus(taskId, userId, status, note) {
        await this.findById(taskId, userId);
        const date = (0, tasks_utils_1.startOfDay)(new Date());
        return this.prisma.taskLog.upsert({
            where: { taskId_userId_date: { taskId, userId, date } },
            create: { taskId, userId, date, status, note },
            update: { status, note },
        });
    }
    async clearDailyStatus(taskId, userId) {
        await this.findById(taskId, userId);
        const date = (0, tasks_utils_1.startOfDay)(new Date());
        await this.prisma.taskLog.deleteMany({
            where: { taskId, userId, date },
        });
    }
    async getTodayLogs(userId) {
        const date = (0, tasks_utils_1.startOfDay)(new Date());
        return this.prisma.taskLog.findMany({
            where: { userId, date },
            include: { task: true },
        });
    }
    async getDailyLogs(userId, fromStr, toStr) {
        const from = fromStr ? new Date(fromStr) : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return (0, tasks_utils_1.startOfDay)(d); })();
        const to = toStr ? new Date(toStr) : (0, tasks_utils_1.endOfDay)(new Date());
        return this.prisma.taskLog.findMany({
            where: { userId, date: { gte: from, lte: to } },
            include: { task: true },
            orderBy: { date: 'desc' },
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