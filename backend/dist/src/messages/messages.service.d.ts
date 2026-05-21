import { PrismaService } from '../prisma/prisma.service';
export declare class SendMessageDto {
    content: string;
    imageUrl?: string;
}
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDMs(userId: string, otherUserId: string, cursor?: string): Promise<({
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        imageUrl: string | null;
        recipientId: string | null;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    })[]>;
    sendDM(senderId: string, recipientId: string, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        imageUrl: string | null;
        recipientId: string | null;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    }>;
    getRoomMessages(roomId: string, userId: string, cursor?: string): Promise<({
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        imageUrl: string | null;
        recipientId: string | null;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    })[]>;
    sendRoomMessage(roomId: string, senderId: string, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        imageUrl: string | null;
        recipientId: string | null;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    }>;
    getConversationList(userId: string): Promise<({
        sender: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        imageUrl: string | null;
        recipientId: string | null;
        content: string | null;
        senderId: string;
        roomId: string | null;
        isDeleted: boolean;
    })[]>;
}
