import { PrismaService } from '../prisma/prisma.service';
export declare class LabelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<({
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
    create(userId: string, name: string, color: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
    }>;
    update(id: string, userId: string, name?: string, color?: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
    }>;
    remove(id: string, userId: string): Promise<void>;
}
