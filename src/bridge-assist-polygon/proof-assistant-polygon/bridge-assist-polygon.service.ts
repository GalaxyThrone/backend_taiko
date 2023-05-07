import { Injectable } from '@nestjs/common';
import fetch from 'isomorphic-fetch';
import { ethers } from 'ethers';
import { Contract } from 'ethers';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProofAssistantService {
  private provider = new ethers.providers.JsonRpcProvider(
    'https://eth-goerli.g.alchemy.com/v2/0v2an0i1XBRghmfhfcTb_O3PgJr4NLvS',
  );

  private privateKey: string;
  private wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.privateKey = this.configService.get<string>('PRIVATE_KEY');
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
  }

  async getProof(l1TxHash: string): Promise<void> {
    const l1Contract = process.env.L1_CONTRACT;
    const l2Contract = process.env.L2_CONTRACT;
    const l2BridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';
    const polygonZkEvmBridgeAbi = require('./PolygonZkEvmBridge.json');

    const polygonZkEvmBridge = new Contract(
      l2BridgeAddress,
      polygonZkEvmBridgeAbi,
      this.wallet,
    ).connect(this.provider);

    const leafType = 1;
    const originNetwork = 0;
    const originAddress = l1Contract;
    const amount = ethers.utils.parseEther('0');
    const destinationNetwork = 1;
    const destinationAddress = l2Contract;
    let metadata = '0x';
    let index = 0;

    const url = `https://bridge-api.public.zkevm-test.net/bridges/${l2Contract}?limit=25&offset=0`;
    const res = await fetch(url);
    const json = await res.json();
    for (const item of json.deposits) {
      if (item.tx_hash === l1TxHash) {
        if (item.ready_for_claim) {
          index = item.deposit_cnt;
          metadata = item.metadata;
          break;
        }
      }
    }

    if (!index) {
      throw new Error('expected deposit count index');
    }

    const metadataHash = ethers.utils.solidityKeccak256(['bytes'], [metadata]);
    const leafValue = await polygonZkEvmBridge.getLeafValue(
      leafType,
      originNetwork,
      originAddress,
      destinationNetwork,
      destinationAddress,
      amount,
      metadataHash,
    );

    const proofUrl = `https://bridge-api.public.zkevm-test.net/merkle-proof?net_id=0&deposit_cnt=${index}`;
    const proofRes = await fetch(proofUrl);
    const proofJson = await proofRes.json();
    const {
      merkle_proof: merkleProof,
      main_exit_root: mainExitRoot,
      rollup_exit_root: rollupExitRoot,
    } = proofJson.proof;
    const verified = await polygonZkEvmBridge.verifyMerkleProof(
      leafValue,
      merkleProof,
      index,
      mainExitRoot,
    );

    console.log('verified:', verified);

    if (!verified) {
      throw new Error('expected proof to be verified');
    }

    return proofJson.proof;
  }

  async returnSignalSentBridgeRequest(bridgeRequest: number): Promise<any> {
    // implementation code here
  }

  async executeClaimSignal(): Promise<any> {
    // implementation code here
  }
}
