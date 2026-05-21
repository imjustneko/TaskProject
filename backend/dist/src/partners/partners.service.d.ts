import { PrismaService } from '../prisma/prisma.service';
export declare class PartnersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sendRequest(requesterId: string, partnerId: string): Promise<{
        partner: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PartnerStatus;
        requesterId: string;
        partnerId: string;
    }>;
    accept(pairId: string, userId: string): Promise<{
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PartnerStatus;
        requesterId: string;
        partnerId: string;
    }>;
    decline(pairId: string, userId: string): Promise<void>;
    remove(pairId: string, userId: string): Promise<void>;
    getIncomingRequests(userId: string): Promise<({
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PartnerStatus;
        requesterId: string;
        partnerId: string;
    })[]>;
    getMyPartners(userId: string): Promise<{
        pairId: string;
        partner: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
            bio: string | null;
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
        todayTotal: number;
        todayDone: number;
        streak: number;
    }[]>;
    private getStreakCount;
    isFriend(userId: string, targetId: string): Promise<boolean>;
    getPairStatus(userId: string, targetId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PartnerStatus;
        requesterId: string;
        partnerId: string;
    } | null>;
}
