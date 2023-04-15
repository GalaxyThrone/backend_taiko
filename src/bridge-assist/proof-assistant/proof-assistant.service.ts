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

  private contractAddressBridgeSepolia = "0x6190267B10F21a45514C6e92D7F1d92DB761c081";
  private contractAddressBridgeTaiko = "0x056D55aF3eA69898cbA5000A3085d730eCfC0AaB";


  private contractABI = [
    {
    "type": "function",
    "stateMutability": "view",
    "outputs": [
    {
    "type": "address",
    "name": "",
    "internalType": "address"
    }
    ],
    "name": "addressManager",
    "inputs": []
    },
    {
    "type": "function",
    "stateMutability": "pure",
    "outputs": [
    {
    "type": "bytes32",
    "name": "signalSlot",
    "internalType": "bytes32"
    }
    ],
    "name": "getSignalSlot",
    "inputs": [
    {
    "type": "address",
    "name": "app",
    "internalType": "address"
    },
    {
    "type": "bytes32",
    "name": "signal",
    "internalType": "bytes32"
    }
    ]
    },
    {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "init",
    "inputs": [
    {
    "type": "address",
    "name": "_addressManager",
    "internalType": "address"
    }
    ]
    },
    {
    "type": "function",
    "stateMutability": "view",
    "outputs": [
    {
    "type": "bool",
    "name": "",
    "internalType": "bool"
    }
    ],
    "name": "isSignalReceived",
    "inputs": [
    {
    "type": "uint256",
    "name": "srcChainId",
    "internalType": "uint256"
    },
    {
    "type": "address",
    "name": "app",
    "internalType": "address"
    },
    {
    "type": "bytes32",
    "name": "signal",
    "internalType": "bytes32"
    },
    {
    "type": "bytes",
    "name": "proof",
    "internalType": "bytes"
    }
    ]
    },
    {
    "type": "function",
    "stateMutability": "view",
    "outputs": [
    {
    "type": "bool",
    "name": "",
    "internalType": "bool"
    }
    ],
    "name": "isSignalSent",
    "inputs": [
    {
    "type": "address",
    "name": "app",
    "internalType": "address"
    },
    {
    "type": "bytes32",
    "name": "signal",
    "internalType": "bytes32"
    }
    ]
    },
    {
    "type": "function",
    "stateMutability": "view",
    "outputs": [
    {
    "type": "address",
    "name": "",
    "internalType": "address"
    }
    ],
    "name": "owner",
    "inputs": []
    },
    {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "renounceOwnership",
    "inputs": []
    },
    {
    "type": "function",
    "stateMutability": "view",
    "outputs": [
    {
    "type": "address",
    "name": "",
    "internalType": "address payable"
    }
    ],
    "name": "resolve",
    "inputs": [
    {
    "type": "string",
    "name": "name",
    "internalType": "string"
    },
    {
    "type": "bool",
    "name": "allowZeroAddress",

    "internalType": "bool"
}
]
},
{
"type": "function",
"stateMutability": "view",
"outputs": [
{
    "type": "address",
    "name": "",
    "internalType": "address payable"
}
],
"name": "resolve",
"inputs": [
{
    "type": "uint256",
    "name": "chainId",
    "internalType": "uint256"
},
{
    "type": "string",
    "name": "name",
    "internalType": "string"
},
{
    "type": "bool",
    "name": "allowZeroAddress",
    "internalType": "bool"
}
]
},
{
"type": "function",
"stateMutability": "nonpayable",
"outputs": [
{
    "type": "bytes32",
    "name": "storageSlot",
    "internalType": "bytes32"
}
],
"name": "sendSignal",
"inputs": [
{
    "type": "bytes32",
    "name": "signal",
    "internalType": "bytes32"
}
]
},
{
"type": "function",
"stateMutability": "nonpayable",
"outputs": [],
"name": "transferOwnership",
"inputs": [
{
    "type": "address",
    "name": "newOwner",
    "internalType": "address"
}
]
},
{
"type": "event",
"name": "Initialized",
"inputs": [
{
    "type": "uint8",
    "name": "version",
    "indexed": false
}
],
"anonymous": false
},
{
"type": "event",
"name": "OwnershipTransferred",
"inputs": [
{
    "type": "address",
    "name": "previousOwner",
    "indexed": true
},
{
    "type": "address",
    "name": "newOwner",
    "indexed": true
}
],
"anonymous": false
},
{
"type": "error",
"name": "B_NULL_APP_ADDR",
"inputs": []
},
{
"type": "error",
"name": "B_WRONG_CHAIN_ID",
"inputs": []
},
{
"type": "error",
"name": "B_ZERO_SIGNAL",
"inputs": []
},
{
"type": "error",
"name": "RESOLVER_DENIED",
"inputs": []
},
{
"type": "error",
"name": "RESOLVER_INVALID_ADDR",
"inputs": []
}
]
  

  private bridgeContractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_chainType",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexednftContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        }
      ],
      "name": "bridgeRequestSent",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_SisterContractInit",
          "type": "address"
        }
      ],
      "name": "addSisterBridgeContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newSisterContract",
          "type": "address"
        }
      ],
      "name": "addSisterContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newSisterContract",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "addSisterContractViaSignature",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "blockNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bridgeRequestInitiatorSender",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bridgeRequestInitiatorUser",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "srcChainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_origin",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_dataPayload",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "claimBridged",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentBridgeSignalContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentChainId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentChainType",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentSisterChainId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentSisterContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "encodedMessageNFTBridge",
          "type": "bytes32"
        }
      ],
      "name": "decodeMessagePayload",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addrOwner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_addrOriginNftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_nftId",
          "type": "uint256"
        }
      ],
      "name": "encodeMessagePayload",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "onERC721Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sepoliaBridgeContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sepoliaChainId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sisterContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "storageSlotsBridgeRequest",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "taikoBridgeContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "taikoChainId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalRequestsSent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]



 
  private sepoliaChainId = 11155111; // Sepolia Id
  private taikoId = 167002; // Taiko A2

  







  //checks if signal was received and also returns proof.
  async claimSignal(bridgeRequest: number) {


    const contractSignalService = new ethers.Contract(
      this.contractAddressTaiko,
      this.contractABI,
      this.wallet
    );
    
    const bridgeContract = new ethers.Contract(
      this.contractAddressBridgeSepolia,
      this.bridgeContractABI,
      this.wallet
    );
  
    const bridgeContractTaiko = new ethers.Contract(
      this.contractAddressTaiko,
      this.bridgeContractABI,
      this.wallet
    );
  

    console.log("WE STARTIN")

    console.log(bridgeRequest)
    const signalSenderAddress = await bridgeContract.bridgeRequestInitiatorSender(bridgeRequest);
    console.log(signalSenderAddress)
    console.log("So far...1")
    const blockNumber = await bridgeContract.blockNumber(bridgeRequest);

      


  
    
    console.log("So far...2")
    const signalToVerify = await bridgeContract.storageSlotsBridgeRequest(bridgeRequest); // @TODO get from contract;


    console.log("So far...3")
    //console.log(signalToVerify)

   
    console.log(blockNumber.toNumber());


    const blockNumberHexString = decToHex(blockNumber.toNumber());
    const block = await this.provider.send("eth_getBlockByNumber", [
      blockNumberHexString,
      false,
    ]);

    
    const proof = await this.provider.send("eth_getProof", [
      this.contractAddressSepolia,
      [
        ethers.utils.keccak256(
          ethers.utils.solidityPack(
            ["address", "bytes32"],
            [
              signalSenderAddress,
              signalToVerify,
            ]
          )
        ),
      ],
      block.hash,
    ]);

    console.log("So far...4")


    const RLP = ethers.utils.RLP;
    const encodedProof = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "bytes"],
      [
        RLP.encode(proof.accountProof),
        RLP.encode(proof.storageProof[0].proof),
      ]
    );

  

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


    console.log("---------------encoded account & storage proof---------------");
    //console.log(encodedProof);

    let signalProof = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(tuple(bytes32 parentHash, bytes32 ommersHash, address beneficiary, bytes32 stateRoot, bytes32 transactionsRoot, bytes32 receiptsRoot, bytes32[8] logsBloom, uint256 difficulty, uint128 height, uint64 gasLimit, uint64 gasUsed, uint64 timestamp, bytes extraData, bytes32 mixHash, uint64 nonce, uint256 baseFeePerGas, bytes32 withdrawalsRoot) header, bytes proof)",
      ],
      [{ header: blockHeader, proof: encodedProof }]
    );

    //console.log(signalProof);

    console.log("General Kenobi!")

    const tx = await contractSignalService
      .connect(this.providerTaiko)
      .isSignalReceived(this.sepoliaChainId, signalSenderAddress, signalToVerify, signalProof);

    console.log(`Signal sent status: ${tx}`);

    //return signalProof;
  }



  async returnSignalSentBridgeRequest(bridgeRequest: number) {


    const contractSignalService = new ethers.Contract(
      this.contractAddressSepolia,
      this.contractABI,
      this.wallet
    );

    const contractSignalServiceTaiko = new ethers.Contract(
      this.contractAddressTaiko,
      this.contractABI,
      this.wallet
    );
    
    const bridgeContract = new ethers.Contract(
      this.contractAddressBridgeSepolia,
      this.bridgeContractABI,
      this.wallet
    );
  

  

      
    const signalSenderAddress = await bridgeContract.bridgeRequestInitiatorSender(bridgeRequest);
  
 
    const blockNumber = await bridgeContract.blockNumber(bridgeRequest);

 
    const signalToVerify = await bridgeContract.storageSlotsBridgeRequest(bridgeRequest); // @TODO get from contract;


    
    console.log(signalToVerify)

    return signalToVerify;
  }


  async executeClaimSignal() {
    await this.claimSignal(0);
  }
}

function decToHex(decimal) {
  return "0x" + decimal.toString(16);
}

