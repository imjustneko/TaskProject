import { Priority } from '@prisma/client';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    date?: string;
    time?: string;
    category?: string;
    priority?: Priority;
    isPublic?: boolean;
    labelIds?: string[];
}
