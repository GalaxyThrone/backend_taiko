import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { BridgeAssistPolygonModule } from './bridge-assist-polygon/bridge-assist-polygon.module';
import { BridgeAssistTaikoModule } from './bridge-assist-taiko/bridge-assist.module';
import { ProofAssistantController } from './bridge-assist-taiko/proof-assistant-taiko/proof-assistant.controller';
import { ProofAssistantService } from './bridge-assist-taiko/proof-assistant-taiko/proof-assistant.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BridgeAssistTaikoModule,
    BridgeAssistPolygonModule,
  ],
  controllers: [AppController, ProofAssistantController],
  providers: [AppService, ProofAssistantService],
})
export class AppModule {}
