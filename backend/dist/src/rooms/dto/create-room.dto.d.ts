import { StatusType } from '@prisma/client';
export declare class CreateRoomDto {
    name: string;
    description?: string;
    activityType?: StatusType;
    isPublic?: boolean;
}
