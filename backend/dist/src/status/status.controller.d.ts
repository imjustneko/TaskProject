import { StatusService, SetStatusDto } from './status.service';
import type { SafeUser } from '../users/users.service';
interface AuthRequest {
    user: SafeUser;
}
export declare class StatusController {
    private readonly status;
    constructor(status: StatusService);
    set(req: AuthRequest, dto: SetStatusDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.StatusType;
        customText: string | null;
        emoji: string | null;
    }>;
    clear(req: AuthRequest): Promise<void>;
}
export {};
