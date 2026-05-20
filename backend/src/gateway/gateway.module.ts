import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    MessagesModule,
    JwtModule.register({}),
  ],
  providers: [AppGateway],
})
export class GatewayModule {}
