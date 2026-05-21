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
    today(req: AuthRequest): Promise<({
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
    plans(req: AuthRequest): Promise<({
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
    history(req: AuthRequest): Promise<({
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
    getTodayLogs(req: AuthRequest): Promise<({
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
    setDailyStatus(req: AuthRequest, id: string, status: LogStatus, note?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogStatus;
        userId: string;
        date: Date;
        taskId: string;
        note: string | null;
    }>;
    clearDailyStatus(req: AuthRequest, id: string): Promise<void>;
    findOne(req: AuthRequest, id: string): Promise<{
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
    update(req: AuthRequest, id: string, dto: UpdateTaskDto): Promise<{
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
    remove(req: AuthRequest, id: string): Promise<void>;
    toggleComplete(req: AuthRequest, id: string): Promise<{
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
}
export {};
