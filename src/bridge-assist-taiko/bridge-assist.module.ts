import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProofAssistantService } from './proof-assistant-taiko/proof-assistant.service';

@Module({
  imports: [ConfigModule, ConfigModule.forRoot()],
  providers: [ProofAssistantService],
})
export class BridgeAssistTaikoModule {}
