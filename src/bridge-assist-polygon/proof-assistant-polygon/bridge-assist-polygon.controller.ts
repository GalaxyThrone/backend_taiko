import { Controller, Get, Param } from '@nestjs/common';
import { ProofAssistantService } from './bridge-assist-polygon.service';

@Controller('proof-assistant-polygon')
export class ProofAssistantController {
  constructor(private readonly proofAssistantService: ProofAssistantService) {}

  @Get('getProof/:l1TxHash/:l1Contract/:l2Contract')
  async getProof(
    @Param('l1TxHash') l1TxHash: string,
    @Param('l1Contract') l1Contract: string,
    @Param('l2Contract') l2Contract: string,
  ) {
    return await this.proofAssistantService.getProof(
      l1TxHash,
      l1Contract,
      l2Contract,
    );
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
