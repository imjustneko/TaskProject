import { FriendsService } from './friends.service';
import type { SafeUser } from '../users/users.service';
interface AuthRequest {
    user: SafeUser;
}
export declare class FriendsController {
    private readonly friends;
    constructor(friends: FriendsService);
    list(req: AuthRequest): Promise<{
        id: string;
        username: string;
        displayName: string;
        avatarUrl: string | null;
        bio: string | null;
        status: {
            id: string;
            updatedAt: Date;
            presence: import("@prisma/client").$Enums.PresenceType;
            userId: string;
            type: import("@prisma/client").$Enums.StatusType;
            customText: string | null;
            emoji: string | null;
        } | null;
    }[]>;
    incoming(req: AuthRequest): Promise<({
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
            status: {
                id: string;
                updatedAt: Date;
                presence: import("@prisma/client").$Enums.PresenceType;
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    })[]>;
    sent(req: AuthRequest): Promise<({
        recipient: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
            status: {
                id: string;
                updatedAt: Date;
                presence: import("@prisma/client").$Enums.PresenceType;
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    })[]>;
    sendRequest(req: AuthRequest, targetId: string): Promise<{
        recipient: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
            status: {
                id: string;
                updatedAt: Date;
                presence: import("@prisma/client").$Enums.PresenceType;
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    }>;
    accept(req: AuthRequest, requestId: string): Promise<{
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
            status: {
                id: string;
                updatedAt: Date;
                presence: import("@prisma/client").$Enums.PresenceType;
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    }>;
    decline(req: AuthRequest, requestId: string): Promise<void>;
    unfriend(req: AuthRequest, friendId: string): Promise<void>;
}
export {};
