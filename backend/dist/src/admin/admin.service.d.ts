import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        totalTasks: number;
        completedTasks: number;
        totalRooms: number;
    }>;
    getUsers(search?: string, page?: number, limit?: number): Promise<{
        users: {
            id: string;
            email: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            createdAt: Date;
            _count: {
                tasks: number;
            };
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    blockUser(userId: string): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    unblockUser(userId: string): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    deleteUser(userId: string): Promise<void>;
    getRecentUsers(limit?: number): Promise<{
        id: string;
        email: string;
        username: string;
        displayName: string;
        avatarUrl: string | null;
        isBlocked: boolean;
        createdAt: Date;
    }[]>;
}
