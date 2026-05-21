import type { LogStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly TASK_INCLUDE;
    create(userId: string, dto: CreateTaskDto): Promise<{
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    findToday(userId: string): Promise<({
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    findPlans(userId: string): Promise<({
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    findHistory(userId: string): Promise<({
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    findById(id: string, userId: string): Promise<{
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    update(id: string, userId: string, dto: UpdateTaskDto): Promise<{
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    remove(id: string, userId: string): Promise<void>;
    toggleComplete(id: string, userId: string): Promise<{
        labels: ({
            label: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isPublic: boolean;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    getStreak(userId: string): Promise<{
        current: number;
        best: number;
    }>;
    setDailyStatus(taskId: string, userId: string, status: LogStatus, note?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogStatus;
        userId: string;
        date: Date;
        taskId: string;
        note: string | null;
    }>;
    clearDailyStatus(taskId: string, userId: string): Promise<void>;
    getTodayLogs(userId: string): Promise<({
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            imageUrl: string | null;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isPublic: boolean;
            isCompleted: boolean;
            completedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogStatus;
        userId: string;
        date: Date;
        taskId: string;
        note: string | null;
    })[]>;
    getDailyLogs(userId: string, fromStr: string, toStr: string): Promise<({
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            imageUrl: string | null;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isPublic: boolean;
            isCompleted: boolean;
            completedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogStatus;
        userId: string;
        date: Date;
        taskId: string;
        note: string | null;
    })[]>;
    getStats(userId: string): Promise<{
        total: number;
        completed: number;
        today: number;
    }>;
}
