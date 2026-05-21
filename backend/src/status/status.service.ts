import { Injectable } from '@nestjs/common';
import { StatusType, PresenceType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class SetStatusDto {
  @IsEnum(StatusType)
  type: StatusType;

  @IsOptional()
  @IsEnum(PresenceType)
  presence?: PresenceType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  customText?: string;

  @IsOptional()
  @IsString()
  emoji?: string;
}

export class SetPresenceDto {
  @IsEnum(PresenceType)
  presence: PresenceType;
}

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  async setStatus(userId: string, dto: SetStatusDto) {
    return this.prisma.userStatus.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }

  async setPresence(userId: string, presence: PresenceType) {
    return this.prisma.userStatus.upsert({
      where: { userId },
      create: { userId, type: 'WORKING', presence },
      update: { presence },
    });
  }

  async clearStatus(userId: string) {
    await this.prisma.userStatus.deleteMany({ where: { userId } });
  }

  /** Strip presence for INVISIBLE users seen by others */
  static maskPresence(status: { presence: PresenceType } | null, viewerId: string | null, ownerId: string): typeof status {
    if (!status) return status;
    if (viewerId === ownerId) return status;
    if (status.presence === PresenceType.INVISIBLE) {
      return { ...status, presence: PresenceType.INVISIBLE };
    }
    return status;
  }
}
