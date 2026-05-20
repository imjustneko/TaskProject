import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [MessagesModule],
  providers: [AppGateway],
})
export class GatewayModule {}
