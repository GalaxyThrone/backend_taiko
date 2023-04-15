import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProofServiceModule } from './proof-service/proof-service.module';
import { GenerateProofsService } from './generate-proofs/generate-proofs.service';
import { BridgeAssistModule } from './bridge-assist/bridge-assist.module';

@Module({
  imports: [ProofServiceModule, BridgeAssistModule],
  controllers: [AppController],
  providers: [AppService, GenerateProofsService],
})
export class AppModule {}
