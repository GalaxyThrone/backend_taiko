import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { diamondL1ABI } from './diamondABI';
import { ProofAssistantService } from './bridge-assist-polygon.service';

// Import and configure dotenv
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EventListenerService {
  private readonly logger = new Logger(EventListenerService.name);
  private provider = new ethers.providers.JsonRpcProvider(
    'https://eth-goerli.g.alchemy.com/v2/0v2an0i1XBRghmfhfcTb_O3PgJr4NLvS',
  );

  private CONTRACT_ADDRESS_L1 = process.env.DIAMOND_CONTRACT_ADDRESS_L1 || '';
  private CONTRACT_ADDRESS_L2 = process.env.DIAMOND_CONTRACT_ADDRESS_L2 || '';
  private CLAIM_PRIVATE_KEY = process.env.CLAIM_MESSAGE_PRIVATE_KEY || '';
  private zkEVMProvider = new ethers.providers.JsonRpcProvider(
    'https://rpc.public.zkevm-test.net',
  );

  private contract = new ethers.Contract(
    this.CONTRACT_ADDRESS_L1,
    diamondL1ABI,
    this.provider,
  );

  private polygonContract = new ethers.Contract(
    this.CONTRACT_ADDRESS_L2,
    diamondL1ABI,
    this.zkEVMProvider,
  );

  constructor(private readonly proofAssistantService: ProofAssistantService) {
    this.listenToEvents();
  }

  private listenToEvents() {
    this.contract.on(
      'bridgeRequestSent',
      (owner: string, nftPayload: string, event: ethers.Event) => {
        // Log the data
        this.logger.log(`Owner: ${owner}, Payload: ${nftPayload}`);

        // Create an object to be saved
        const eventData = {
          transactionHash: event.transactionHash,
          owner: owner,
        };

        // Check if the file exists
        if (existsSync('events.json')) {
          // Read the existing data
          const existingData = JSON.parse(readFileSync('events.json', 'utf-8'));

          // Add the new event
          existingData.push(eventData);

          // Write the updated event data back
          writeFileSync('events.json', JSON.stringify(existingData, null, 2));
        } else {
          // Write the first event as an array
          writeFileSync('events.json', JSON.stringify([eventData], null, 2));
        }

        // Do more things, e.g., call other services or methods
      },
    );
  }

  getTransactionsByAddress(address: string): any {
    if (existsSync('events.json')) {
      const existingData = JSON.parse(readFileSync('events.json', 'utf-8'));
      return existingData[address] || null;
    } else {
      return null;
    }
  }

  // Periodic check to ensure we are connected to the contract and the Ethereum network
  @Cron(CronExpression.EVERY_MINUTE)
  async validateConnection() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      this.logger.log(`Connected. Latest block number is ${blockNumber}.`);
    } catch (error) {
      this.logger.error('Could not connect to Ethereum provider.');
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async claimMessagesOnL1() {
    this.logger.log('hello there');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndFetchProof() {
    try {
      // Check if events.json exists and has data
      if (existsSync('events.json')) {
        const existingData = JSON.parse(readFileSync('events.json', 'utf-8'));

        // Iterate through each event to get proof
        for (const [address, eventData] of Object.entries(existingData)) {
          const l1TxHash = (eventData as any).transactionHash;

          const l1Contract = this.CONTRACT_ADDRESS_L1; // Assume this is your L1 Contract address
          const l2Contract = this.CONTRACT_ADDRESS_L2; // Your L2 Contract address

          try {
            const { proof, dataPayload, index } =
              await this.proofAssistantService.getProof(
                l1TxHash,
                l1Contract,
                l2Contract,
              );

            // If proof is fetched successfully, do your placeholder function
            this.placeholderFunction(l1TxHash, proof, dataPayload, index);

            const toBeDeletedIndex = existingData.findIndex(
              (item) => item.owner === address,
            );
            if (toBeDeletedIndex !== -1) {
              existingData.splice(index, 1);
            }

            // Update events.json
            writeFileSync('events.json', JSON.stringify(existingData, null, 2));
          } catch (error) {
            if (error.message.includes('Status code: 404')) {
              this.logger.warn(
                'Zkproof has not been generated yet:',
                error.message,
              );
            } else {
              this.logger.error('An error occurred:', error);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('An error occurred:', error);
    }
  }

  placeholderFunction(l1txHash, proof, dataPayload, index) {
    console.log('Placeholder function executed with proof:', proof);
    console.log('l1Hash:', l1txHash);

    //addr: 0x131208C003a643D453bf639d0BAfA214827FE96e
    const wallet = new ethers.Wallet(
      this.CLAIM_PRIVATE_KEY,
      this.zkEVMProvider,
    );

    const contractWithSigner = this.polygonContract.connect(wallet);

    const smtProof = proof.merkle_proof;
    const mainnetExitRoot = proof.main_exit_root;
    const rollupExitRoot = proof.rollup_exit_root;

    contractWithSigner
      .claimBridged(
        dataPayload,
        smtProof,
        index,
        mainnetExitRoot,
        rollupExitRoot,
      )
      .then((response) => {
        console.log('Transaction response:', response);
        return response.wait(); // Wait for transaction to be mined
      })
      .then((receipt) => {
        console.log('Transaction was mined in block:', receipt.blockNumber);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
