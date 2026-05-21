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
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findToday(userId: string, includeCompleted?: boolean): Promise<({
        labels: ({
            label: {
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findPlans(userId: string): Promise<({
        labels: ({
            label: {
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findHistory(userId: string): Promise<({
        labels: ({
            label: {
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findById(id: string, userId: string): Promise<{
        labels: ({
            label: {
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    update(id: string, userId: string, dto: UpdateTaskDto): Promise<{
        labels: ({
            label: {
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<void>;
    toggleComplete(id: string, userId: string): Promise<{
        labels: ({
            label: {
                id: string;
                createdAt: Date;
                userId: string;
                name: string;
                color: string;
            };
        } & {
            labelId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        date: Date | null;
        time: string | null;
        category: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        isCompleted: boolean;
        isPublic: boolean;
        imageUrl: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getStreak(userId: string): Promise<{
        current: number;
        best: number;
    }>;
    setDailyStatus(taskId: string, userId: string, status: LogStatus, note?: string): Promise<{
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        taskId: string;
        status: import("@prisma/client").$Enums.LogStatus;
        note: string | null;
    }>;
    clearDailyStatus(taskId: string, userId: string): Promise<void>;
    getTodayLogs(userId: string): Promise<({
        task: {
            id: string;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isCompleted: boolean;
            isPublic: boolean;
            imageUrl: string | null;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    } & {
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        taskId: string;
        status: import("@prisma/client").$Enums.LogStatus;
        note: string | null;
    })[]>;
    getDailyLogs(userId: string, fromStr: string, toStr: string): Promise<({
        task: {
            id: string;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isCompleted: boolean;
            isPublic: boolean;
            imageUrl: string | null;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    } & {
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        taskId: string;
        status: import("@prisma/client").$Enums.LogStatus;
        note: string | null;
    })[]>;
    getStats(userId: string): Promise<{
        total: number;
        completed: number;
        today: number;
    }>;
}
