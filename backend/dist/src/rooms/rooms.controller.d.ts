import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import type { SafeUser } from '../users/users.service';
interface AuthRequest {
    user: SafeUser;
}
export declare class RoomsController {
    private readonly rooms;
    constructor(rooms: RoomsService);
    create(req: AuthRequest, dto: CreateRoomDto): Promise<{
        tasks: ({
            task: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                date: Date | null;
                time: string | null;
                category: string | null;
                priority: import("@prisma/client").$Enums.Priority;
                isPublic: boolean;
                isCompleted: boolean;
                imageUrl: string | null;
                completedAt: Date | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roomId: string;
            taskId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        members: ({
            user: {
                id: string;
                username: string;
                displayName: string;
                avatarUrl: string | null;
                status: {
                    id: string;
                    updatedAt: Date;
                    userId: string;
                    type: import("@prisma/client").$Enums.StatusType;
                    customText: string | null;
                    emoji: string | null;
                } | null;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.RoomRole;
            userId: string;
            roomId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublic: boolean;
        activityType: import("@prisma/client").$Enums.StatusType | null;
        createdById: string;
    }>;
    list(req: AuthRequest): Promise<({
        tasks: ({
            task: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                date: Date | null;
                time: string | null;
                category: string | null;
                priority: import("@prisma/client").$Enums.Priority;
                isPublic: boolean;
                isCompleted: boolean;
                imageUrl: string | null;
                completedAt: Date | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roomId: string;
            taskId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        members: ({
            user: {
                id: string;
                username: string;
                displayName: string;
                avatarUrl: string | null;
                status: {
                    id: string;
                    updatedAt: Date;
                    userId: string;
                    type: import("@prisma/client").$Enums.StatusType;
                    customText: string | null;
                    emoji: string | null;
                } | null;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.RoomRole;
            userId: string;
            roomId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublic: boolean;
        activityType: import("@prisma/client").$Enums.StatusType | null;
        createdById: string;
    })[]>;
    findOne(req: AuthRequest, id: string): Promise<{
        tasks: ({
            task: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                date: Date | null;
                time: string | null;
                category: string | null;
                priority: import("@prisma/client").$Enums.Priority;
                isPublic: boolean;
                isCompleted: boolean;
                imageUrl: string | null;
                completedAt: Date | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roomId: string;
            taskId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        members: ({
            user: {
                id: string;
                username: string;
                displayName: string;
                avatarUrl: string | null;
                status: {
                    id: string;
                    updatedAt: Date;
                    userId: string;
                    type: import("@prisma/client").$Enums.StatusType;
                    customText: string | null;
                    emoji: string | null;
                } | null;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.RoomRole;
            userId: string;
            roomId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublic: boolean;
        activityType: import("@prisma/client").$Enums.StatusType | null;
        createdById: string;
    }>;
    invite(req: AuthRequest, id: string, userId: string): Promise<{
        user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            status: {
                id: string;
                updatedAt: Date;
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
    } & {
        id: string;
        role: import("@prisma/client").$Enums.RoomRole;
        userId: string;
        roomId: string;
        joinedAt: Date;
    }>;
    leave(req: AuthRequest, id: string): Promise<void>;
    delete(req: AuthRequest, id: string): Promise<void>;
    addTask(req: AuthRequest, id: string, title: string): Promise<{
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isPublic: boolean;
            isCompleted: boolean;
            imageUrl: string | null;
            completedAt: Date | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        roomId: string;
        taskId: string;
        completedBy: string[];
        failedBy: string[];
        skippedBy: string[];
    }>;
    toggleTask(req: AuthRequest, id: string, taskId: string): Promise<{
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isPublic: boolean;
            isCompleted: boolean;
            imageUrl: string | null;
            completedAt: Date | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        roomId: string;
        taskId: string;
        completedBy: string[];
        failedBy: string[];
        skippedBy: string[];
    }>;
}
export {};
