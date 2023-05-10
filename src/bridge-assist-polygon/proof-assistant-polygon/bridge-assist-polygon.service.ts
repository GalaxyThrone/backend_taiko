import { Injectable } from '@nestjs/common';
import fetch from 'isomorphic-fetch';
import { ethers } from 'ethers';
import { Contract } from 'ethers';

import { ConfigService } from '@nestjs/config';
const fetch = require('isomorphic-fetch');

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

  async getProof(l1TxHash: string): Promise<any> {
    const l1Contract = '0x7d323451Ba923575D65A486A3451D246540D7658'; //process.env.L1_CONTRACT;
    const l2Contract = '0x0000000000000000000000000000000000000000'; //process.env.L2_CONTRACT;
    const l2BridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';
    const polygonZkEvmBridgeAbi = [
      {
        inputs: [],
        name: 'AlreadyClaimed',
        type: 'error',
      },
      {
        inputs: [],
        name: 'AmountDoesNotMatchMsgValue',
        type: 'error',
      },
      {
        inputs: [],
        name: 'DestinationNetworkInvalid',
        type: 'error',
      },
      {
        inputs: [],
        name: 'EtherTransferFailed',
        type: 'error',
      },
      {
        inputs: [],
        name: 'GlobalExitRootInvalid',
        type: 'error',
      },
      {
        inputs: [],
        name: 'InvalidSmtProof',
        type: 'error',
      },
      {
        inputs: [],
        name: 'MerkleTreeFull',
        type: 'error',
      },
      {
        inputs: [],
        name: 'MessageFailed',
        type: 'error',
      },
      {
        inputs: [],
        name: 'MsgValueNotZero',
        type: 'error',
      },
      {
        inputs: [],
        name: 'NotValidAmount',
        type: 'error',
      },
      {
        inputs: [],
        name: 'NotValidOwner',
        type: 'error',
      },
      {
        inputs: [],
        name: 'NotValidSignature',
        type: 'error',
      },
      {
        inputs: [],
        name: 'NotValidSpender',
        type: 'error',
      },
      {
        inputs: [],
        name: 'OnlyEmergencyState',
        type: 'error',
      },
      {
        inputs: [],
        name: 'OnlyNotEmergencyState',
        type: 'error',
      },
      {
        inputs: [],
        name: 'OnlyPolygonZkEVM',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint8',
            name: 'leafType',
            type: 'uint8',
          },
          {
            indexed: false,
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'originAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint32',
            name: 'destinationNetwork',
            type: 'uint32',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'bytes',
            name: 'metadata',
            type: 'bytes',
          },
          {
            indexed: false,
            internalType: 'uint32',
            name: 'depositCount',
            type: 'uint32',
          },
        ],
        name: 'BridgeEvent',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint32',
            name: 'index',
            type: 'uint32',
          },
          {
            indexed: false,
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'originAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'ClaimEvent',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [],
        name: 'EmergencyStateActivated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [],
        name: 'EmergencyStateDeactivated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint8',
            name: 'version',
            type: 'uint8',
          },
        ],
        name: 'Initialized',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'originTokenAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'wrappedTokenAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bytes',
            name: 'metadata',
            type: 'bytes',
          },
        ],
        name: 'NewWrappedToken',
        type: 'event',
      },
      {
        inputs: [],
        name: 'activateEmergencyState',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint32',
            name: 'destinationNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'forceUpdateGlobalExitRoot',
            type: 'bool',
          },
          {
            internalType: 'bytes',
            name: 'permitData',
            type: 'bytes',
          },
        ],
        name: 'bridgeAsset',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint32',
            name: 'destinationNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'forceUpdateGlobalExitRoot',
            type: 'bool',
          },
          {
            internalType: 'bytes',
            name: 'metadata',
            type: 'bytes',
          },
        ],
        name: 'bridgeMessage',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32[32]',
            name: 'smtProof',
            type: 'bytes32[32]',
          },
          {
            internalType: 'uint32',
            name: 'index',
            type: 'uint32',
          },
          {
            internalType: 'bytes32',
            name: 'mainnetExitRoot',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'rollupExitRoot',
            type: 'bytes32',
          },
          {
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'originTokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'destinationNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'metadata',
            type: 'bytes',
          },
        ],
        name: 'claimAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32[32]',
            name: 'smtProof',
            type: 'bytes32[32]',
          },
          {
            internalType: 'uint32',
            name: 'index',
            type: 'uint32',
          },
          {
            internalType: 'bytes32',
            name: 'mainnetExitRoot',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'rollupExitRoot',
            type: 'bytes32',
          },
          {
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'originAddress',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'destinationNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'metadata',
            type: 'bytes',
          },
        ],
        name: 'claimMessage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'claimedBitMap',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'deactivateEmergencyState',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'depositCount',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getDepositRoot',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint8',
            name: 'leafType',
            type: 'uint8',
          },
          {
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'originAddress',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'destinationNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'metadataHash',
            type: 'bytes32',
          },
        ],
        name: 'getLeafValue',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'originTokenAddress',
            type: 'address',
          },
        ],
        name: 'getTokenWrappedAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'globalExitRootManager',
        outputs: [
          {
            internalType: 'contract IBasePolygonZkEVMGlobalExitRoot',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint32',
            name: '_networkID',
            type: 'uint32',
          },
          {
            internalType: 'contract IBasePolygonZkEVMGlobalExitRoot',
            name: '_globalExitRootManager',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_polygonZkEVMaddress',
            type: 'address',
          },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256',
          },
        ],
        name: 'isClaimed',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'isEmergencyState',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'lastUpdatedDepositCount',
        outputs: [
          {
            internalType: 'uint32',
            name: '',
            type: 'uint32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'networkID',
        outputs: [
          {
            internalType: 'uint32',
            name: '',
            type: 'uint32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'polygonZkEVMaddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'originTokenAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        name: 'precalculatedWrapperAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        name: 'tokenInfoToWrappedToken',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'updateGlobalExitRoot',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'leafHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32[32]',
            name: 'smtProof',
            type: 'bytes32[32]',
          },
          {
            internalType: 'uint32',
            name: 'index',
            type: 'uint32',
          },
          {
            internalType: 'bytes32',
            name: 'root',
            type: 'bytes32',
          },
        ],
        name: 'verifyMerkleProof',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'wrappedTokenToTokenInfo',
        outputs: [
          {
            internalType: 'uint32',
            name: 'originNetwork',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'originTokenAddress',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];

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

    console.log(index);
    console.log(leafValue);
    console.log(proofJson.proof);

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

    return proofJson.proof, index;
  }

  async returnSignalSentBridgeRequest(bridgeRequest: number): Promise<any> {
    // implementation code here
  }

  async executeClaimSignal(): Promise<any> {
    // implementation code here
  }
}
