import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { FriendsModule } from './friends/friends.module';
import { StatusModule } from './status/status.module';
import { MessagesModule } from './messages/messages.module';
import { GatewayModule } from './gateway/gateway.module';
import { RoomsModule } from './rooms/rooms.module';
import { AdminModule } from './admin/admin.module';
import { PostsModule } from './posts/posts.module';
import { LabelsModule } from './labels/labels.module';
import { PartnersModule } from './partners/partners.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000,
        limit: 300,
      },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    TasksModule,
    FriendsModule,
    StatusModule,
    MessagesModule,
    GatewayModule,
    RoomsModule,
    AdminModule,
    PostsModule,
    LabelsModule,
    PartnersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
