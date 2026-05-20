import { MessagesService, SendMessageDto } from './messages.service';
import type { SafeUser } from '../users/users.service';
interface AuthRequest {
    user: SafeUser;
}
export declare class MessagesController {
    private readonly messages;
    constructor(messages: MessagesService);
    conversations(req: AuthRequest): Promise<({
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        recipientId: string | null;
        type: import("@prisma/client").$Enums.MessageType;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    })[]>;
    getDMs(req: AuthRequest, userId: string, cursor?: string): Promise<({
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        recipientId: string | null;
        type: import("@prisma/client").$Enums.MessageType;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    })[]>;
    sendDM(req: AuthRequest, userId: string, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        recipientId: string | null;
        type: import("@prisma/client").$Enums.MessageType;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    }>;
    getRoomMessages(req: AuthRequest, roomId: string, cursor?: string): Promise<({
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        recipientId: string | null;
        type: import("@prisma/client").$Enums.MessageType;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    })[]>;
    sendRoomMessage(req: AuthRequest, roomId: string, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        recipientId: string | null;
        type: import("@prisma/client").$Enums.MessageType;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    }>;
}
export {};
