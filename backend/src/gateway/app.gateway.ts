import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from '../messages/messages.service';

interface AuthSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly messages: MessagesService,
  ) {}

  async handleConnection(client: AuthSocket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers?.authorization?.replace('Bearer ', '');
      const payload = this.jwt.verify(token, {
        secret: this.config.getOrThrow('JWT_SECRET'),
      });
      client.userId = payload.sub as string;
      client.join(`user:${client.userId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthSocket) {
    if (client.userId) {
      this.server.emit('user:offline', { userId: client.userId });
    }
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
    @MessageBody()
    data: { recipientId?: string; roomId?: string; content: string },
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
