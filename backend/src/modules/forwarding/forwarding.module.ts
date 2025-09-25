import { Module } from '@nestjs/common';
import { BridgeModule } from '../bridge/bridge.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { TelegramModule } from '../telegram/telegram.module';
import { MessageForwardingSaga } from './message-forwarding.saga';

@Module({
  imports: [BridgeModule, WhatsAppModule, TelegramModule],
  providers: [MessageForwardingSaga],
})
export class ForwardingModule {}


