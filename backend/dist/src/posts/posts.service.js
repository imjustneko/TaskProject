"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const AUTHOR_SELECT = {
    id: true, username: true, displayName: true, avatarUrl: true,
    status: true,
};
const POST_INCLUDE = (userId) => ({
    user: { select: AUTHOR_SELECT },
    _count: { select: { likes: true, comments: true } },
    likes: userId ? { where: { userId }, select: { id: true } } : false,
});
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFeed(currentUserId, cursor) {
        const posts = await this.prisma.post.findMany({
            include: {
                user: { select: AUTHOR_SELECT },
                _count: { select: { likes: true, comments: true } },
                likes: { where: { userId: currentUserId }, select: { id: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        });
        return posts.map(p => ({
            ...p,
            likedByMe: p.likes.length > 0,
            likesCount: p._count.likes,
            commentsCount: p._count.comments,
            likes: undefined,
            _count: undefined,
        }));
    }
    async getUserPosts(targetUserId, currentUserId) {
        const posts = await this.prisma.post.findMany({
            where: { userId: targetUserId },
            include: {
                user: { select: AUTHOR_SELECT },
                _count: { select: { likes: true, comments: true } },
                likes: { where: { userId: currentUserId }, select: { id: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        return posts.map(p => ({
            ...p,
            likedByMe: p.likes.length > 0,
            likesCount: p._count.likes,
            commentsCount: p._count.comments,
            likes: undefined,
            _count: undefined,
        }));
    }
    async create(userId, content, imageUrl) {
        if (!content?.trim() && !imageUrl) {
            throw new common_1.BadRequestException('Post must have text or image');
        }
        return this.prisma.post.create({
            data: { userId, content: content?.trim(), imageUrl },
            include: {
                user: { select: AUTHOR_SELECT },
                _count: { select: { likes: true, comments: true } },
            },
        });
    }
    async delete(postId, userId) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.userId !== userId)
            throw new common_1.ForbiddenException('Not your post');
        await this.prisma.post.delete({ where: { id: postId } });
    }
    async toggleLike(postId, userId) {
        const existing = await this.prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } },
        });
        if (existing) {
            await this.prisma.postLike.delete({ where: { id: existing.id } });
            return { liked: false };
        }
        else {
            await this.prisma.postLike.create({ data: { postId, userId } });
            return { liked: true };
        }
    }
    async getComments(postId) {
        return this.prisma.postComment.findMany({
            where: { postId },
            include: { user: { select: AUTHOR_SELECT } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addComment(postId, userId, content) {
        if (!content.trim())
            throw new common_1.BadRequestException('Comment cannot be empty');
        return this.prisma.postComment.create({
            data: { postId, userId, content: content.trim() },
            include: { user: { select: AUTHOR_SELECT } },
        });
    }
    async deleteComment(commentId, userId) {
        const c = await this.prisma.postComment.findUnique({ where: { id: commentId } });
        if (!c)
            throw new common_1.NotFoundException();
        if (c.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.postComment.delete({ where: { id: commentId } });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map