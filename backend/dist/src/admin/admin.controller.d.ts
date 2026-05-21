import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
    stats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        totalTasks: number;
        completedTasks: number;
        totalRooms: number;
    }>;
    users(search?: string, page?: string): Promise<{
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
    recent(): Promise<{
        id: string;
        email: string;
        username: string;
        displayName: string;
        avatarUrl: string | null;
        isBlocked: boolean;
        createdAt: Date;
    }[]>;
    block(id: string): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    unblock(id: string): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    deleteUser(id: string): Promise<void>;
}
