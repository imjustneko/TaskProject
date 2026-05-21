import type { Request as ExpressRequest } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import type { SafeUser } from '../users/users.service';
interface AuthRequest extends ExpressRequest {
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
            taskId: string;
            roomId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        emojis: {
            name: string;
            id: string;
            createdAt: Date;
            imageUrl: string;
            roomId: string;
            addedById: string;
        }[];
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
            taskId: string;
            roomId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        emojis: {
            name: string;
            id: string;
            createdAt: Date;
            imageUrl: string;
            roomId: string;
            addedById: string;
        }[];
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
    publicRooms(req: AuthRequest): Promise<({
        tasks: ({
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
            taskId: string;
            roomId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        emojis: {
            name: string;
            id: string;
            createdAt: Date;
            imageUrl: string;
            roomId: string;
            addedById: string;
        }[];
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
            taskId: string;
            roomId: string;
            completedBy: string[];
            failedBy: string[];
            skippedBy: string[];
        })[];
        emojis: {
            name: string;
            id: string;
            createdAt: Date;
            imageUrl: string;
            roomId: string;
            addedById: string;
        }[];
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
    join(req: AuthRequest, id: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.RoomRole;
        userId: string;
        roomId: string;
        joinedAt: Date;
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
        taskId: string;
        roomId: string;
        completedBy: string[];
        failedBy: string[];
        skippedBy: string[];
    }>;
    setTaskStatus(req: AuthRequest, id: string, taskId: string, status: 'DONE' | 'FAILED' | 'SKIP' | 'RESET'): Promise<{
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
        taskId: string;
        roomId: string;
        completedBy: string[];
        failedBy: string[];
        skippedBy: string[];
    }>;
    toggleTask(req: AuthRequest, id: string, taskId: string): Promise<{
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
        taskId: string;
        roomId: string;
        completedBy: string[];
        failedBy: string[];
        skippedBy: string[];
    }>;
    listEmojis(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        imageUrl: string;
        roomId: string;
        addedById: string;
    }[]>;
    addEmoji(req: AuthRequest, id: string, name: string, file: Express.Multer.File): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        imageUrl: string;
        roomId: string;
        addedById: string;
    }>;
    deleteEmoji(req: AuthRequest, emojiId: string): Promise<void>;
}
export {};
