import { Module } from '@nestjs/common';
import { ProofAssistantController } from './proof-assistant-polygon/bridge-assist-polygon.controller';
import { ProofAssistantService } from './proof-assistant-polygon/bridge-assist-polygon.service';

@Module({
  controllers: [ProofAssistantController],
  providers: [ProofAssistantService],
})
export class BridgeAssistPolygonModule {}
