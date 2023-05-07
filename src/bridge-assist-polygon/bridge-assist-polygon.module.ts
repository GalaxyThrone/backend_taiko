import { Module } from '@nestjs/common';
import { ProofAssistantController } from './proof-assistant-polygon/bridge-assist-polygon.controller';
import { ProofAssistantService } from './proof-assistant-polygon/bridge-assist-polygon.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, ConfigModule.forRoot()],
  controllers: [ProofAssistantController],
  providers: [ProofAssistantService],
})
export class BridgeAssistPolygonModule {}
