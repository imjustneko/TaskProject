import { StatusType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class SetStatusDto {
    type: StatusType;
    customText?: string;
    emoji?: string;
}
export declare class StatusService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    setStatus(userId: string, dto: SetStatusDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.StatusType;
        customText: string | null;
        emoji: string | null;
    }>;
    clearStatus(userId: string): Promise<void>;
}
