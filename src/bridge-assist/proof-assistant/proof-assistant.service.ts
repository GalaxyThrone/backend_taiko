import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { keccak256 } from 'ethereumjs-util';
import { MerkleTree } from 'merkletreejs';
import * as abi from 'ethereumjs-abi';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ProofAssistantService {
  private provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/LHtmBfCuRwAK8RqtaHNRTqFdhx4YE7B3"
  );

  private providerTaiko = new ethers.providers.JsonRpcProvider(
    "https://l2rpc.hackathon.taiko.xyz"
  );



  private privateKey: string;
  private wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.privateKey = this.configService.get<string>('PRIVATE_KEY');
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
  }


  private contractAddressSepolia = "0x11013a48Ad87a528D23CdA25D2C34D7dbDA6b46b"; // SignalService Sepolia
  private contractAddressTaiko = "0x0000777700000000000000000000000000000007"; // SignalService Taiko

  private contractAddressBridgeSepolia = "0x9bF56347Cf15e37A0b85Dc269b65D2b10399be96";
  private contractAddressBridgeTaiko = "0x148cff8FD012eefB61128d3fFa23CFA744E63163";


  private contractABI = require('./signalService.json');
  private contractNFTABI = require('./nftContract.json');

  private bridgeContractABI = require('./bridgeContract.json');



 

  private signalTwo = "0x497473206f76657220416e616b696e2c20492068617665207468652048696768";
  private bytesSignal = ethers.utils.arrayify(this.signalTwo);
  private signalToClaim = ethers.utils.hexZeroPad(this.bytesSignal, 32);
  private sepoliaChainId = 11155111; // Sepolia Id
  private taikoId = 167002; // Taiko A2







  //checks if signal was received and also returns proof.
  async claimSignal(bridgeRequest: number) {


    const contract = new ethers.Contract(
      this.contractAddressTaiko,
      this.contractABI,
      this.wallet
    );
    
    const bridgeContract = new ethers.Contract(
      this.contractAddressBridgeTaiko,
      this.bridgeContractABI,
      this.wallet
    );
  

    

    const signalSenderAddress = await bridgeContract.bridgeRequestInitiatorSender(bridgeRequest);
    const blockNumber = await bridgeContract.blockNumber(bridgeRequest);
    const signalToVerify = await bridgeContract.storageSlotsBridgeRequest(bridgeRequest); // @TODO get from contract;

    const proof = await this.provider.send("eth_getProof", [
      this.contractAddressSepolia,
      [
        ethers.utils.keccak256(
          ethers.utils.solidityPack(
            ["address", "bytes32"],
            [
              signalSenderAddress,
              ethers.utils.formatBytes32String(signalToVerify),
            ]
          )
        ),
      ],
      blockNumber,
    ]);
    const RLP = ethers.utils.RLP;
    const encodedProof = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "bytes"],
      [
        RLP.encode(proof.accountProof),
        RLP.encode(proof.storageProof[0].proof),
      ]
    );

    const block = await this.provider.send("eth_getBlockByNumber", [
      blockNumber,
      false,

    ]);

    const blockHeader = {
      parentHash: block.parentHash,
      ommersHash: block.sha3Uncles,
      beneficiary: block.miner,
      stateRoot: block.stateRoot,
      transactionsRoot: block.transactionsRoot,
      receiptsRoot: block.receiptsRoot,
      logsBloom: block.logsBloom
        .toString()
        .substring(2)
        .match(/.{1,64}/g)
        .map((s) => "0x" + s),
      difficulty: block.difficulty,
      height: block.number,
      gasLimit: block.gasLimit,
      gasUsed: block.gasUsed,
      timestamp: block.timestamp,
      extraData: block.extraData,
      mixHash: block.mixHash,
      nonce: block.nonce,
      baseFeePerGas: block.baseFeePerGas
        ? parseInt(block.baseFeePerGas)
        : 0,
      withdrawalsRoot: block.withdrawalsRoot,
    };

    console.log(this.wallet);
    console.log("---------------encoded account & storage proof---------------");
    console.log(encodedProof);

    let signalProof = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(tuple(bytes32 parentHash, bytes32 ommersHash, address beneficiary, bytes32 stateRoot, bytes32 transactionsRoot, bytes32 receiptsRoot, bytes32[8] logsBloom, uint256 difficulty, uint128 height, uint64 gasLimit, uint64 gasUsed, uint64 timestamp, bytes extraData, bytes32 mixHash, uint64 nonce, uint256 baseFeePerGas, bytes32 withdrawalsRoot) header, bytes proof)",
      ],
      [{ header: blockHeader, proof: encodedProof }]
    );

    const tx = await contract
      .connect(this.providerTaiko)
      .isSignalReceived(this.sepoliaChainId, signalSenderAddress, ethers.utils.formatBytes32String(signalToVerify), signalProof);

    console.log(`Signal sent status: ${tx}`);

    return signalProof;
  }



  async returnSignalSentBridgeRequest(bridgeRequest: number) {


    const contract = new ethers.Contract(
      this.contractAddressTaiko,
      this.contractABI,
      this.wallet
    );
    
    const bridgeContract = new ethers.Contract(
      this.contractAddressBridgeTaiko,
      this.bridgeContractABI,
      this.wallet
    );
  

    
    const signalToVerify = await bridgeContract.storageSlotsBridgeRequest(bridgeRequest); // @TODO get from contract;

    return signalToVerify;
  }


  async executeClaimSignal() {
    await this.claimSignal(0);
  }
}

