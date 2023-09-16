import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { BridgeAssistPolygonModule } from './bridge-assist-polygon/bridge-assist-polygon.module';
import { BridgeAssistTaikoModule } from './bridge-assist-taiko/bridge-assist.module';
import { ProofAssistantController } from './bridge-assist-taiko/proof-assistant-taiko/proof-assistant.controller';
import { ProofAssistantService } from './bridge-assist-taiko/proof-assistant-taiko/proof-assistant.service';
import { EventListenerService } from './bridge-assist-polygon/proof-assistant-polygon/eventListenerService';
import { ScheduleModule } from '@nestjs/schedule';
import { EventListenerController } from './bridge-assist-polygon/proof-assistant-polygon/eventController.ts';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    BridgeAssistPolygonModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
