import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProofServiceModule } from './proof-service/proof-service.module';
import { GenerateProofsService } from './generate-proofs/generate-proofs.service';
import { BridgeAssistModule } from './bridge-assist/bridge-assist.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProofServiceModule, BridgeAssistModule,ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, GenerateProofsService],
})
export class AppModule {}
