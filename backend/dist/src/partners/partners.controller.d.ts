import { PartnersService } from './partners.service';
import type { SafeUser } from '../users/users.service';
interface AuthRequest {
    user: SafeUser;
}
export declare class PartnersController {
    private readonly partners;
    constructor(partners: PartnersService);
    getPartners(req: AuthRequest): Promise<{
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
    getRequests(req: AuthRequest): Promise<({
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
    getPairStatus(req: AuthRequest, targetId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PartnerStatus;
        requesterId: string;
        partnerId: string;
    } | null>;
    sendRequest(req: AuthRequest, userId: string): Promise<{
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
    accept(req: AuthRequest, pairId: string): Promise<{
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
    decline(req: AuthRequest, pairId: string): Promise<void>;
    remove(req: AuthRequest, pairId: string): Promise<void>;
}
export {};
