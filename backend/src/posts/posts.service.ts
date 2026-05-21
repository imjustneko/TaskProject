import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const AUTHOR_SELECT = {
  id: true, username: true, displayName: true, avatarUrl: true,
  status: true,
};

const POST_INCLUDE = (userId?: string) => ({
  user: {
    select: {
      ...AUTHOR_SELECT,
      userEmojis: { select: { name: true, imageUrl: true } },
    },
  },
  task: { select: { id: true, title: true, isCompleted: true, completedAt: true, priority: true } },
  _count: { select: { likes: true, comments: true } },
  likes: userId ? { where: { userId }, select: { id: true } } : false,
});

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(currentUserId: string, cursor?: string) {
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

  async getUserPosts(targetUserId: string, currentUserId: string) {
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

  async create(userId: string, content?: string, imageUrl?: string, taskId?: string) {
    if (!content?.trim() && !imageUrl && !taskId) {
      throw new BadRequestException('Post must have text, image, or task');
    }
    const post = await this.prisma.post.create({
      data: { userId, content: content?.trim(), imageUrl, taskId: taskId || undefined },
      include: {
        user: { select: AUTHOR_SELECT },
        _count: { select: { likes: true, comments: true } },
      },
    });
    return {
      ...post,
      likedByMe: false,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      likes: undefined,
      _count: undefined,
    };
  }

  async delete(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Not your post');
    await this.prisma.post.delete({ where: { id: postId } });
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await this.prisma.postLike.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({ data: { postId, userId } });
      return { liked: true };
    }
  }

  async getComments(postId: string) {
    return this.prisma.postComment.findMany({
      where: { postId },
      include: { user: { select: AUTHOR_SELECT } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addComment(postId: string, userId: string, content: string) {
    if (!content.trim()) throw new BadRequestException('Comment cannot be empty');
    return this.prisma.postComment.create({
      data: { postId, userId, content: content.trim() },
      include: { user: { select: AUTHOR_SELECT } },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const c = await this.prisma.postComment.findUnique({ where: { id: commentId } });
    if (!c) throw new NotFoundException();
    if (c.userId !== userId) throw new ForbiddenException();
    await this.prisma.postComment.delete({ where: { id: commentId } });
  }
}
