import { PostsService } from './posts.service';
import type { SafeUser } from '../users/users.service';
declare class CreatePostDto {
    content?: string;
    imageUrl?: string;
}
declare class AddCommentDto {
    content: string;
}
interface AuthRequest {
    user: SafeUser;
}
export declare class PostsController {
    private readonly posts;
    constructor(posts: PostsService);
    getFeed(req: AuthRequest, cursor?: string): Promise<{
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
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string | null;
    }[]>;
    getUserPosts(req: AuthRequest, userId: string): Promise<{
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
                userId: string;
                type: import("@prisma/client").$Enums.StatusType;
                customText: string | null;
                emoji: string | null;
            } | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string | null;
    }[]>;
    create(req: AuthRequest, dto: CreatePostDto): Promise<{
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
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string | null;
    }>;
    delete(req: AuthRequest, id: string): Promise<void>;
    like(req: AuthRequest, id: string): Promise<{
        liked: boolean;
    }>;
    getComments(id: string): Promise<({
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
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    })[]>;
    addComment(req: AuthRequest, id: string, dto: AddCommentDto): Promise<{
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
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    }>;
    deleteComment(req: AuthRequest, commentId: string): Promise<void>;
}
export {};
