import { StatusType, PresenceType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class SetStatusDto {
    type: StatusType;
    presence?: PresenceType;
    customText?: string;
    emoji?: string;
}
export declare class SetPresenceDto {
    presence: PresenceType;
}
export declare class StatusService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    setStatus(userId: string, dto: SetStatusDto): Promise<{
        id: string;
        updatedAt: Date;
        presence: import("@prisma/client").$Enums.PresenceType;
        userId: string;
        type: import("@prisma/client").$Enums.StatusType;
        customText: string | null;
        emoji: string | null;
    }>;
    setPresence(userId: string, presence: PresenceType): Promise<{
        id: string;
        updatedAt: Date;
        presence: import("@prisma/client").$Enums.PresenceType;
        userId: string;
        type: import("@prisma/client").$Enums.StatusType;
        customText: string | null;
        emoji: string | null;
    }>;
    clearStatus(userId: string): Promise<void>;
    static maskPresence(status: {
        presence: PresenceType;
    } | null, viewerId: string | null, ownerId: string): typeof status;
}
