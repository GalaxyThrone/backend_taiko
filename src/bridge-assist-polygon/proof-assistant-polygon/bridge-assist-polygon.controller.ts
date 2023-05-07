import { Controller, Get, Param } from '@nestjs/common';
import { ProofAssistantService } from './bridge-assist-polygon.service';

@Controller('proof-assistant-polygon')
export class ProofAssistantController {
  constructor(private readonly proofAssistantService: ProofAssistantService) {}

  @Get('getProof/:bridgeRequest')
  async getProof(@Param('bridgeRequest') bridgeRequest: string) {
    return await this.proofAssistantService.getProof(bridgeRequest);
  }

  @Get('return-signal-sent-bridge-request/:bridgeRequest')
  async returnSignalSentBridgeRequest(
    @Param('bridgeRequest') bridgeRequest: number,
  ) {
    return await this.proofAssistantService.returnSignalSentBridgeRequest(
      bridgeRequest,
    );
  }

  @Get('execute-claim-signal')
  async executeClaimSignal() {
    return await this.proofAssistantService.executeClaimSignal();
  }
}
