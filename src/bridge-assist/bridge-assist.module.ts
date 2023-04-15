import { Module } from '@nestjs/common';
import { ProofAssistantService } from './proof-assistant/proof-assistant.service';

@Module({
  providers: [ProofAssistantService]
})
export class BridgeAssistModule {}
