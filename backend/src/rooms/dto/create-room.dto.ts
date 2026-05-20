import { IsString, IsOptional, IsBoolean, MaxLength, IsEnum } from 'class-validator';
import { StatusType } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsEnum(StatusType)
  activityType?: StatusType;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
