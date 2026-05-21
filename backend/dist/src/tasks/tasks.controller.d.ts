import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { SafeUser } from '../users/users.service';
import type { LogStatus } from '@prisma/client';
interface AuthRequest {
    user: SafeUser;
}
export declare class TasksController {
    private readonly tasks;
    constructor(tasks: TasksService);
    create(req: AuthRequest, dto: CreateTaskDto): Promise<{
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
    today(req: AuthRequest, all?: string): Promise<({
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
    plans(req: AuthRequest): Promise<({
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
    history(req: AuthRequest): Promise<({
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
    stats(req: AuthRequest): Promise<{
        total: number;
        completed: number;
        today: number;
    }>;
    streak(req: AuthRequest): Promise<{
        current: number;
        best: number;
    }>;
    getDailyLogs(req: AuthRequest, from: string, to: string): Promise<({
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
    getTodayLogs(req: AuthRequest): Promise<({
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
    setDailyStatus(req: AuthRequest, id: string, status: LogStatus, note?: string): Promise<{
        id: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        taskId: string;
        status: import("@prisma/client").$Enums.LogStatus;
        note: string | null;
    }>;
    clearDailyStatus(req: AuthRequest, id: string): Promise<void>;
    findOne(req: AuthRequest, id: string): Promise<{
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
    update(req: AuthRequest, id: string, dto: UpdateTaskDto): Promise<{
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
    remove(req: AuthRequest, id: string): Promise<void>;
    toggleComplete(req: AuthRequest, id: string): Promise<{
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
}
export {};
