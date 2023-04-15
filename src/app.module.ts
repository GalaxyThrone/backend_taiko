import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BridgeAssistModule } from './bridge-assist/bridge-assist.module';
import { ConfigModule } from '@nestjs/config';
import { ProofAssistantService } from './bridge-assist/proof-assistant/proof-assistant.service';

@Module({
  imports: [BridgeAssistModule,ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ProofAssistantService],
})
export class AppModule {}
