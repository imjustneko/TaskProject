import { LabelsService } from './labels.service';
import type { SafeUser } from '../users/users.service';
declare class CreateLabelDto {
    name: string;
    color?: string;
}
declare class UpdateLabelDto {
    name?: string;
    color?: string;
}
interface AuthRequest {
    user: SafeUser;
}
export declare class LabelsController {
    private readonly labels;
    constructor(labels: LabelsService);
    list(req: AuthRequest): Promise<({
        _count: {
            tasks: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
    })[]>;
    create(req: AuthRequest, dto: CreateLabelDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
    }>;
    update(req: AuthRequest, id: string, dto: UpdateLabelDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
    }>;
    remove(req: AuthRequest, id: string): Promise<void>;
}
export {};
