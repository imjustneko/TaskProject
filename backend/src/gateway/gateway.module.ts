import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { MessagesModule } from '../messages/messages.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    MessagesModule,
    PrismaModule,
    JwtModule.register({}),
  ],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class GatewayModule {}
