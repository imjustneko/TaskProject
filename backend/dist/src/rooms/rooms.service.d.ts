import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateRoomDto): Promise<{
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
    getMyRooms(userId: string): Promise<({
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
    getRoom(id: string, userId: string): Promise<{
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
    invite(roomId: string, inviterId: string, targetUserId: string): Promise<{
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
    leave(roomId: string, userId: string): Promise<void>;
    delete(roomId: string, userId: string): Promise<void>;
    addTask(roomId: string, userId: string, title: string): Promise<{
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
    toggleTaskCompletion(roomId: string, taskId: string, userId: string): Promise<{
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
    private assertMember;
}
