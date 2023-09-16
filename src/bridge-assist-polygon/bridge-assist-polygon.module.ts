import { Module } from '@nestjs/common';
import { ProofAssistantController } from './proof-assistant-polygon/bridge-assist-polygon.controller';
import { ProofAssistantService } from './proof-assistant-polygon/bridge-assist-polygon.service';
import { ConfigModule } from '@nestjs/config';
import { EventListenerController } from './proof-assistant-polygon/eventController.ts';
import { EventListenerService } from './proof-assistant-polygon/eventListenerService';

@Module({
  imports: [ConfigModule, ConfigModule.forRoot()],
  controllers: [ProofAssistantController, EventListenerController],
  providers: [ProofAssistantService, EventListenerService],
})
export class BridgeAssistPolygonModule {}
