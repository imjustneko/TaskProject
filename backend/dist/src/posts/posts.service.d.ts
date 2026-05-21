import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getFeed(currentUserId: string, cursor?: string): Promise<{
        likedByMe: boolean;
        likesCount: number;
        commentsCount: number;
        likes: undefined;
        _count: undefined;
        user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        taskId: string | null;
        content: string | null;
    }[]>;
    getUserPosts(targetUserId: string, currentUserId: string): Promise<{
        likedByMe: boolean;
        likesCount: number;
        commentsCount: number;
        likes: undefined;
        _count: undefined;
        user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        taskId: string | null;
        content: string | null;
    }[]>;
    create(userId: string, content?: string, imageUrl?: string, taskId?: string): Promise<{
        likedByMe: boolean;
        likesCount: number;
        commentsCount: number;
        likes: undefined;
        _count: undefined;
        user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        taskId: string | null;
        content: string | null;
    }>;
    delete(postId: string, userId: string): Promise<void>;
    toggleLike(postId: string, userId: string): Promise<{
        liked: boolean;
    }>;
    getComments(postId: string): Promise<({
        user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
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
        userId: string;
        content: string;
        postId: string;
    })[]>;
    addComment(postId: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
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
        userId: string;
        content: string;
        postId: string;
    }>;
    deleteComment(commentId: string, userId: string): Promise<void>;
}
