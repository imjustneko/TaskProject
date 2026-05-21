import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { SafeUser } from './users.service';
interface AuthRequest extends ExpressRequest {
    user: SafeUser;
}
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    me(req: AuthRequest): SafeUser;
    updateMe(req: AuthRequest, dto: UpdateProfileDto): Promise<SafeUser>;
    uploadAvatar(req: AuthRequest, file: Express.Multer.File): Promise<SafeUser>;
    listEmojis(req: AuthRequest): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        imageUrl: string;
    }[]>;
    addEmoji(req: AuthRequest, name: string, file: Express.Multer.File): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        imageUrl: string;
    }>;
    deleteEmoji(req: AuthRequest, id: string): Promise<void>;
    search(req: AuthRequest, q: string): Promise<SafeUser[]>;
    getPublicStats(req: AuthRequest, username: string): Promise<{
        user: SafeUser & {
            status?: {
                presence?: string;
            } | null;
        };
        completedCount: number;
        streak: number;
        publicTasks: ({
            labels: ({
                label: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    color: string;
                };
            } & {
                taskId: string;
                labelId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            imageUrl: string | null;
            isCompleted: boolean;
            title: string;
            description: string | null;
            date: Date | null;
            time: string | null;
            category: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            isPublic: boolean;
            completedAt: Date | null;
        })[];
    }>;
    getByUsername(req: AuthRequest, username: string): Promise<SafeUser | null>;
}
export {};
