import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from '../messages/messages.service';
interface AuthSocket extends Socket {
    userId?: string;
}
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwt;
    private readonly config;
    private readonly messages;
    server: Server;
    constructor(jwt: JwtService, config: ConfigService, messages: MessagesService);
    handleConnection(client: AuthSocket): Promise<void>;
    handleDisconnect(client: AuthSocket): void;
    handleJoinRoom(client: AuthSocket, data: {
        roomId: string;
    }): {
        event: string;
        data: {
            roomId: string;
        };
    };
    handleLeaveRoom(client: AuthSocket, data: {
        roomId: string;
    }): void;
    handleMessage(client: AuthSocket, data: {
        recipientId?: string;
        roomId?: string;
        content: string;
    }): Promise<void>;
    handleTypingStart(client: AuthSocket, data: {
        chatId: string;
    }): void;
    handleTypingStop(client: AuthSocket, data: {
        chatId: string;
    }): void;
    emitStatusUpdate(userId: string, status: unknown): void;
}
export {};
