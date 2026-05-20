import { PrismaService } from '../prisma/prisma.service';
export declare class FriendsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sendRequest(requesterId: string, recipientId: string): Promise<{
        recipient: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    }>;
    acceptRequest(requestId: string, userId: string): Promise<{
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    }>;
    declineRequest(requestId: string, userId: string): Promise<void>;
    unfriend(userId: string, friendId: string): Promise<void>;
    getFriends(userId: string): Promise<{
        id: string;
        username: string;
        displayName: string;
        avatarUrl: string | null;
        bio: string | null;
        status: {
            id: string;
            updatedAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.StatusType;
            customText: string | null;
            emoji: string | null;
        } | null;
    }[]>;
    getIncomingRequests(userId: string): Promise<({
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    })[]>;
    getSentRequests(userId: string): Promise<({
        recipient: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    })[]>;
    getRelationship(userId: string, targetId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendStatus;
        requesterId: string;
        recipientId: string;
    } | null>;
}
