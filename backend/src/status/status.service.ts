import { Injectable } from '@nestjs/common';
import { StatusType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class SetStatusDto {
  @IsEnum(StatusType)
  type: StatusType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  customText?: string;

  @IsOptional()
  @IsString()
  emoji?: string;
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

  async clearStatus(userId: string) {
    await this.prisma.userStatus.deleteMany({ where: { userId } });
  }
}
