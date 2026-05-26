import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from '../messages/messages.service';
import { PrismaService } from '../prisma/prisma.service';

interface AuthSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
      const allowed = process.env.FRONTEND_URL ?? 'http://localhost:3000';
      if (!origin || origin === allowed) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  },
  namespace: '/',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // userId → Set of socket IDs (one user can have multiple tabs open)
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly messages: MessagesService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthSocket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      const payload = this.jwt.verify(token, {
        secret: this.config.getOrThrow('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub as string },
        select: { id: true, isBlocked: true },
      });

      if (!user || user.isBlocked) {
        client.disconnect();
        return;
      }

      client.userId = user.id;
      client.join(`user:${user.id}`);

      if (!this.userSockets.has(user.id)) this.userSockets.set(user.id, new Set());
      this.userSockets.get(user.id)!.add(client.id);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthSocket) {
    if (client.userId) {
      const sockets = this.userSockets.get(client.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(client.userId);
          this.server.emit('user:offline', { userId: client.userId });
        }
      }
    }
  }

  /** Called by AdminService when a user is blocked. */
  disconnectUser(userId: string) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    for (const socketId of sockets) {
      const socket = this.server.sockets.sockets.get(socketId);
      socket?.disconnect();
    }
    this.userSockets.delete(userId);
  }

  @SubscribeMessage('join:room')
  handleJoinRoom(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);
    return { event: 'joined', data: { roomId: data.roomId } };
  }

  @SubscribeMessage('leave:room')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
  }

  @SubscribeMessage('send:message')
  async handleMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { recipientId?: string; roomId?: string; content: string },
  ) {
    if (!client.userId) return;
    const dto = { content: data.content };

    if (data.roomId) {
      const msg = await this.messages.sendRoomMessage(data.roomId, client.userId, dto);
      this.server.to(`room:${data.roomId}`).emit('message:new', msg);
    } else if (data.recipientId) {
      const msg = await this.messages.sendDM(client.userId, data.recipientId, dto);
      this.server.to(`user:${data.recipientId}`).emit('message:new', msg);
      this.server.to(`user:${client.userId}`).emit('message:new', msg);
    }
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { chatId: string },
  ) {
    client.to(data.chatId).emit('typing:indicator', {
      userId: client.userId,
      chatId: data.chatId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { chatId: string },
  ) {
    client.to(data.chatId).emit('typing:indicator', {
      userId: client.userId,
      chatId: data.chatId,
      isTyping: false,
    });
  }

  emitStatusUpdate(userId: string, status: unknown) {
    this.server.emit('status:changed', { userId, status });
  }
}
