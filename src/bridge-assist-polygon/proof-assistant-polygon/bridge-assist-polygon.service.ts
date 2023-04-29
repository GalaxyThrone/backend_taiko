import { Injectable } from '@nestjs/common';

@Injectable()
export class ProofAssistantService {
  async claimSignal(bridgeRequest: number): Promise<any> {
    // implementation code here
  }

  async returnSignalSentBridgeRequest(bridgeRequest: number): Promise<any> {
    // implementation code here
  }

  async executeClaimSignal(): Promise<any> {
    // implementation code here
  }
}
