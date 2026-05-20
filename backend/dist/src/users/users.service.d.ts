import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
export type SafeUser = Omit<User, 'passwordHash'>;
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sanitize(user: User): SafeUser;
    findById(id: string): Promise<SafeUser>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<SafeUser | null>;
    checkUniqueness(email: string, username: string): Promise<void>;
    search(query: string, currentUserId: string): Promise<SafeUser[]>;
    updateProfile(id: string, data: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
    }): Promise<SafeUser>;
}
