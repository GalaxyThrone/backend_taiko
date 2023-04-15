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
  

  private bridgeContractABI = [{
    "_format": "hh-sol-artifact-1",
    "contractName": "openAccessNFTBridge",
    "sourceName": "contracts/test_openaccess_nftbridge.sol",
    "abi": [
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
    ],
    "bytecode": "0x608060405271777700000000000000000000000000000007600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507311013a48ad87a528d23cda25d2c34d7dbda6b46b600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555062aa36a760055562028c5a60065560006007556000600960146101000a81548160ff021916908315150217905550348015620000e757600080fd5b50604051620020ec380380620020ec83398181016040528101906200010d919062000347565b6200012d620001216200023b60201b60201c565b6200024360201b60201c565b806007819055506001811415620001b457600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600554600a81905550600654600b819055505b60028114156200023457600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600654600a81905550600554600b819055505b5062000379565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b6000819050919050565b62000321816200030c565b81146200032d57600080fd5b50565b600081519050620003418162000316565b92915050565b60006020828403121562000360576200035f62000307565b5b6000620003708482850162000330565b91505092915050565b611d6380620003896000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c80636cbadbfa116100de578063b2e52d4311610097578063c8f52a0411610071578063c8f52a041461047b578063cd803c6514610499578063d5ed8854146104b7578063f2fde38b146104d557610173565b8063b2e52d43146103fd578063b5e2a0151461042d578063b6ed4a191461044b57610173565b80636cbadbfa1461034b578063715018a6146103695780638da5cb5b1461037357806393cf1c7d14610391578063a5a1d0c5146103af578063abeae677146103cd57610173565b80633c784ac4116101305780633c784ac4146102755780634abf82041461029157806350306962146102af5780635826a171146102df578063598bfa38146103115780636c20c39d1461032d57610173565b80630abccc33146101785780630d88e87714610194578063150b7a02146101c457806320a265f7146101f4578063223689b614610227578063384e848114610245575b600080fd5b610192600480360381019061018d9190611367565b6104f1565b005b6101ae60048036038101906101a991906113f9565b6104f5565b6040516101bb919061143f565b60405180910390f35b6101de60048036038101906101d991906114ba565b61050d565b6040516101eb919061157d565b60405180910390f35b61020e600480360381019061020991906115c4565b610713565b60405161021e9493929190611685565b60405180910390f35b61022f610b56565b60405161023c91906116ca565b60405180910390f35b61025f600480360381019061025a91906116e5565b610b7c565b60405161026c91906116ca565b60405180910390f35b61028f600480360381019061028a91906116e5565b610baf565b005b610299610c30565b6040516102a69190611712565b60405180910390f35b6102c960048036038101906102c491906113f9565b610c36565b6040516102d69190611712565b60405180910390f35b6102f960048036038101906102f4919061172d565b610c4e565b6040516103089392919061175a565b60405180910390f35b61032b600480360381019061032691906116e5565b610ca3565b005b610335610d5a565b60405161034291906116ca565b60405180910390f35b610353610d80565b6040516103609190611712565b60405180910390f35b610371610d86565b005b61037b610d9a565b60405161038891906116ca565b60405180910390f35b610399610dc3565b6040516103a69190611712565b60405180910390f35b6103b7610dc9565b6040516103c49190611712565b60405180910390f35b6103e760048036038101906103e29190611791565b610dcf565b6040516103f4919061143f565b60405180910390f35b610417600480360381019061041291906113f9565b610e0a565b60405161042491906116ca565b60405180910390f35b610435610e3d565b60405161044291906116ca565b60405180910390f35b610465600480360381019061046091906113f9565b610e63565b60405161047291906116ca565b60405180910390f35b610483610e96565b60405161049091906116ca565b60405180910390f35b6104a1610ebc565b6040516104ae9190611712565b60405180910390f35b6104bf610ec2565b6040516104cc9190611712565b60405180910390f35b6104ef60048036038101906104ea91906116e5565b610ec8565b005b5050565b600e6020528060005260406000206000915090505481565b6000803390506000610520828888610dcf565b905061052b81610f4c565b600e60006012548152602001908152602001600020819055508660106000601254815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360116000601254815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555043600f60006012548152602001908152602001600020819055506012600081548092919061061990611813565b91905055506001600c60008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600088815260200190815260200160002060006101000a81548160ff021916908315150217905550857f9f511ff5d3ffbc7a0774e43a1c5c183519d2da873aeaea2f12cff2bdad362e5c88336040516106f692919061185c565b60405180910390a263150b7a0260e01b9250505095945050505050565b600080600080600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff161461080c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080390611908565b60405180910390fd5b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635221f6138b8b8b8b8b6040518663ffffffff1660e01b8152600401610871959493929190611966565b602060405180830381600087803b15801561088b57600080fd5b505af115801561089f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c391906119e0565b905060008060006108d38b610c4e565b925092509250600c60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000600d60008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082815260200190815260200160002060009054906101000a900460ff1615610b39576000600d60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610aac576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aa390611a59565b60405180910390fd5b60008190508073ffffffffffffffffffffffffffffffffffffffff166342842e0e8387866040518463ffffffff1660e01b8152600401610aee9392919061175a565b600060405180830381600087803b158015610b0857600080fd5b505af1158015610b1c573d6000803e3d6000fd5b505050508560008060009950995099509950505050505050610b4a565b838284839750975097509750505050505b95509550955095915050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d6020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b80600d60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60125481565b600f6020528060005260406000206000915090505481565b60008060008060008086604051602001610c689190611a9a565b604051602081830303815290604052806020019051810190610c8a9190611b08565b9250925092508282829550955095505050509193909250565b610cab611065565b600960149054906101000a900460ff1615610cfb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cf290611bcd565b60405180910390fd5b6001600960146101000a81548160ff02191690831515021790555080600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a5481565b610d8e611065565b610d9860006110e3565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600b5481565b60065481565b600080848484604051602001610de79392919061175a565b604051602081830303815290604052805190602001209050809150509392505050565b60116020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60106020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60075481565b60055481565b610ed0611065565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f40576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f3790611c5f565b60405180910390fd5b610f49816110e3565b50565b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366ca2bc0836040518263ffffffff1660e01b815260040161100c919061143f565b602060405180830381600087803b15801561102657600080fd5b505af115801561103a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061105e9190611c94565b9050919050565b61106d6111a7565b73ffffffffffffffffffffffffffffffffffffffff1661108b610d9a565b73ffffffffffffffffffffffffffffffffffffffff16146110e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110d890611d0d565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006111ee826111c3565b9050919050565b6111fe816111e3565b811461120957600080fd5b50565b60008135905061121b816111f5565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6112748261122b565b810181811067ffffffffffffffff821117156112935761129261123c565b5b80604052505050565b60006112a66111af565b90506112b2828261126b565b919050565b600067ffffffffffffffff8211156112d2576112d161123c565b5b6112db8261122b565b9050602081019050919050565b82818337600083830152505050565b600061130a611305846112b7565b61129c565b90508281526020810184848401111561132657611325611226565b5b6113318482856112e8565b509392505050565b600082601f83011261134e5761134d611221565b5b813561135e8482602086016112f7565b91505092915050565b6000806040838503121561137e5761137d6111b9565b5b600061138c8582860161120c565b925050602083013567ffffffffffffffff8111156113ad576113ac6111be565b5b6113b985828601611339565b9150509250929050565b6000819050919050565b6113d6816113c3565b81146113e157600080fd5b50565b6000813590506113f3816113cd565b92915050565b60006020828403121561140f5761140e6111b9565b5b600061141d848285016113e4565b91505092915050565b6000819050919050565b61143981611426565b82525050565b60006020820190506114546000830184611430565b92915050565b600080fd5b600080fd5b60008083601f84011261147a57611479611221565b5b8235905067ffffffffffffffff8111156114975761149661145a565b5b6020830191508360018202830111156114b3576114b261145f565b5b9250929050565b6000806000806000608086880312156114d6576114d56111b9565b5b60006114e48882890161120c565b95505060206114f58882890161120c565b9450506040611506888289016113e4565b935050606086013567ffffffffffffffff811115611527576115266111be565b5b61153388828901611464565b92509250509295509295909350565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61157781611542565b82525050565b6000602082019050611592600083018461156e565b92915050565b6115a181611426565b81146115ac57600080fd5b50565b6000813590506115be81611598565b92915050565b6000806000806000608086880312156115e0576115df6111b9565b5b60006115ee888289016113e4565b95505060206115ff8882890161120c565b9450506040611610888289016115af565b935050606086013567ffffffffffffffff811115611631576116306111be565b5b61163d88828901611464565b92509250509295509295909350565b60008115159050919050565b6116618161164c565b82525050565b611670816111e3565b82525050565b61167f816113c3565b82525050565b600060808201905061169a6000830187611658565b6116a76020830186611667565b6116b46040830185611667565b6116c16060830184611676565b95945050505050565b60006020820190506116df6000830184611667565b92915050565b6000602082840312156116fb576116fa6111b9565b5b60006117098482850161120c565b91505092915050565b60006020820190506117276000830184611676565b92915050565b600060208284031215611743576117426111b9565b5b6000611751848285016115af565b91505092915050565b600060608201905061176f6000830186611667565b61177c6020830185611667565b6117896040830184611676565b949350505050565b6000806000606084860312156117aa576117a96111b9565b5b60006117b88682870161120c565b93505060206117c98682870161120c565b92505060406117da868287016113e4565b9150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061181e826113c3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611851576118506117e4565b5b600182019050919050565b60006040820190506118716000830185611667565b61187e6020830184611667565b9392505050565b600082825260208201905092915050565b7f492068617665206e65766572207365656e2074686973204d616e2f427269646760008201527f65436f6e747261637420696e206d79206c696665210000000000000000000000602082015250565b60006118f2603583611885565b91506118fd82611896565b604082019050919050565b60006020820190508181036000830152611921816118e5565b9050919050565b600082825260208201905092915050565b60006119458385611928565b93506119528385846112e8565b61195b8361122b565b840190509392505050565b600060808201905061197b6000830188611676565b6119886020830187611667565b6119956040830186611430565b81810360608301526119a8818486611939565b90509695505050505050565b6119bd8161164c565b81146119c857600080fd5b50565b6000815190506119da816119b4565b92915050565b6000602082840312156119f6576119f56111b9565b5b6000611a04848285016119cb565b91505092915050565b7f6e6f2073697374657220636f6e74726163742073706563696669656421000000600082015250565b6000611a43601d83611885565b9150611a4e82611a0d565b602082019050919050565b60006020820190508181036000830152611a7281611a36565b9050919050565b6000819050919050565b611a94611a8f82611426565b611a79565b82525050565b6000611aa68284611a83565b60208201915081905092915050565b6000611ac0826111c3565b9050919050565b611ad081611ab5565b8114611adb57600080fd5b50565b600081519050611aed81611ac7565b92915050565b600081519050611b02816113cd565b92915050565b600080600060608486031215611b2157611b206111b9565b5b6000611b2f86828701611ade565b9350506020611b4086828701611ade565b9250506040611b5186828701611af3565b9150509250925092565b7f4120636f6e7472616374206973206120636f6e7472616374206973206120636f60008201527f6e74726163742100000000000000000000000000000000000000000000000000602082015250565b6000611bb7602783611885565b9150611bc282611b5b565b604082019050919050565b60006020820190508181036000830152611be681611baa565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611c49602683611885565b9150611c5482611bed565b604082019050919050565b60006020820190508181036000830152611c7881611c3c565b9050919050565b600081519050611c8e81611598565b92915050565b600060208284031215611caa57611ca96111b9565b5b6000611cb884828501611c7f565b91505092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611cf7602083611885565b9150611d0282611cc1565b602082019050919050565b60006020820190508181036000830152611d2681611cea565b905091905056fea2646970667358221220b025144fb743f59a8dbcb01d17754cfece63dfe270ecb9202be178d0a3be9cc264736f6c63430008090033",
    "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106101735760003560e01c80636cbadbfa116100de578063b2e52d4311610097578063c8f52a0411610071578063c8f52a041461047b578063cd803c6514610499578063d5ed8854146104b7578063f2fde38b146104d557610173565b8063b2e52d43146103fd578063b5e2a0151461042d578063b6ed4a191461044b57610173565b80636cbadbfa1461034b578063715018a6146103695780638da5cb5b1461037357806393cf1c7d14610391578063a5a1d0c5146103af578063abeae677146103cd57610173565b80633c784ac4116101305780633c784ac4146102755780634abf82041461029157806350306962146102af5780635826a171146102df578063598bfa38146103115780636c20c39d1461032d57610173565b80630abccc33146101785780630d88e87714610194578063150b7a02146101c457806320a265f7146101f4578063223689b614610227578063384e848114610245575b600080fd5b610192600480360381019061018d9190611367565b6104f1565b005b6101ae60048036038101906101a991906113f9565b6104f5565b6040516101bb919061143f565b60405180910390f35b6101de60048036038101906101d991906114ba565b61050d565b6040516101eb919061157d565b60405180910390f35b61020e600480360381019061020991906115c4565b610713565b60405161021e9493929190611685565b60405180910390f35b61022f610b56565b60405161023c91906116ca565b60405180910390f35b61025f600480360381019061025a91906116e5565b610b7c565b60405161026c91906116ca565b60405180910390f35b61028f600480360381019061028a91906116e5565b610baf565b005b610299610c30565b6040516102a69190611712565b60405180910390f35b6102c960048036038101906102c491906113f9565b610c36565b6040516102d69190611712565b60405180910390f35b6102f960048036038101906102f4919061172d565b610c4e565b6040516103089392919061175a565b60405180910390f35b61032b600480360381019061032691906116e5565b610ca3565b005b610335610d5a565b60405161034291906116ca565b60405180910390f35b610353610d80565b6040516103609190611712565b60405180910390f35b610371610d86565b005b61037b610d9a565b60405161038891906116ca565b60405180910390f35b610399610dc3565b6040516103a69190611712565b60405180910390f35b6103b7610dc9565b6040516103c49190611712565b60405180910390f35b6103e760048036038101906103e29190611791565b610dcf565b6040516103f4919061143f565b60405180910390f35b610417600480360381019061041291906113f9565b610e0a565b60405161042491906116ca565b60405180910390f35b610435610e3d565b60405161044291906116ca565b60405180910390f35b610465600480360381019061046091906113f9565b610e63565b60405161047291906116ca565b60405180910390f35b610483610e96565b60405161049091906116ca565b60405180910390f35b6104a1610ebc565b6040516104ae9190611712565b60405180910390f35b6104bf610ec2565b6040516104cc9190611712565b60405180910390f35b6104ef60048036038101906104ea91906116e5565b610ec8565b005b5050565b600e6020528060005260406000206000915090505481565b6000803390506000610520828888610dcf565b905061052b81610f4c565b600e60006012548152602001908152602001600020819055508660106000601254815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360116000601254815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555043600f60006012548152602001908152602001600020819055506012600081548092919061061990611813565b91905055506001600c60008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600088815260200190815260200160002060006101000a81548160ff021916908315150217905550857f9f511ff5d3ffbc7a0774e43a1c5c183519d2da873aeaea2f12cff2bdad362e5c88336040516106f692919061185c565b60405180910390a263150b7a0260e01b9250505095945050505050565b600080600080600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff161461080c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080390611908565b60405180910390fd5b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635221f6138b8b8b8b8b6040518663ffffffff1660e01b8152600401610871959493929190611966565b602060405180830381600087803b15801561088b57600080fd5b505af115801561089f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c391906119e0565b905060008060006108d38b610c4e565b925092509250600c60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000600d60008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082815260200190815260200160002060009054906101000a900460ff1615610b39576000600d60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610aac576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aa390611a59565b60405180910390fd5b60008190508073ffffffffffffffffffffffffffffffffffffffff166342842e0e8387866040518463ffffffff1660e01b8152600401610aee9392919061175a565b600060405180830381600087803b158015610b0857600080fd5b505af1158015610b1c573d6000803e3d6000fd5b505050508560008060009950995099509950505050505050610b4a565b838284839750975097509750505050505b95509550955095915050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d6020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b80600d60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60125481565b600f6020528060005260406000206000915090505481565b60008060008060008086604051602001610c689190611a9a565b604051602081830303815290604052806020019051810190610c8a9190611b08565b9250925092508282829550955095505050509193909250565b610cab611065565b600960149054906101000a900460ff1615610cfb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cf290611bcd565b60405180910390fd5b6001600960146101000a81548160ff02191690831515021790555080600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a5481565b610d8e611065565b610d9860006110e3565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600b5481565b60065481565b600080848484604051602001610de79392919061175a565b604051602081830303815290604052805190602001209050809150509392505050565b60116020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60106020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60075481565b60055481565b610ed0611065565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f40576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f3790611c5f565b60405180910390fd5b610f49816110e3565b50565b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366ca2bc0836040518263ffffffff1660e01b815260040161100c919061143f565b602060405180830381600087803b15801561102657600080fd5b505af115801561103a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061105e9190611c94565b9050919050565b61106d6111a7565b73ffffffffffffffffffffffffffffffffffffffff1661108b610d9a565b73ffffffffffffffffffffffffffffffffffffffff16146110e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110d890611d0d565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006111ee826111c3565b9050919050565b6111fe816111e3565b811461120957600080fd5b50565b60008135905061121b816111f5565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6112748261122b565b810181811067ffffffffffffffff821117156112935761129261123c565b5b80604052505050565b60006112a66111af565b90506112b2828261126b565b919050565b600067ffffffffffffffff8211156112d2576112d161123c565b5b6112db8261122b565b9050602081019050919050565b82818337600083830152505050565b600061130a611305846112b7565b61129c565b90508281526020810184848401111561132657611325611226565b5b6113318482856112e8565b509392505050565b600082601f83011261134e5761134d611221565b5b813561135e8482602086016112f7565b91505092915050565b6000806040838503121561137e5761137d6111b9565b5b600061138c8582860161120c565b925050602083013567ffffffffffffffff8111156113ad576113ac6111be565b5b6113b985828601611339565b9150509250929050565b6000819050919050565b6113d6816113c3565b81146113e157600080fd5b50565b6000813590506113f3816113cd565b92915050565b60006020828403121561140f5761140e6111b9565b5b600061141d848285016113e4565b91505092915050565b6000819050919050565b61143981611426565b82525050565b60006020820190506114546000830184611430565b92915050565b600080fd5b600080fd5b60008083601f84011261147a57611479611221565b5b8235905067ffffffffffffffff8111156114975761149661145a565b5b6020830191508360018202830111156114b3576114b261145f565b5b9250929050565b6000806000806000608086880312156114d6576114d56111b9565b5b60006114e48882890161120c565b95505060206114f58882890161120c565b9450506040611506888289016113e4565b935050606086013567ffffffffffffffff811115611527576115266111be565b5b61153388828901611464565b92509250509295509295909350565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61157781611542565b82525050565b6000602082019050611592600083018461156e565b92915050565b6115a181611426565b81146115ac57600080fd5b50565b6000813590506115be81611598565b92915050565b6000806000806000608086880312156115e0576115df6111b9565b5b60006115ee888289016113e4565b95505060206115ff8882890161120c565b9450506040611610888289016115af565b935050606086013567ffffffffffffffff811115611631576116306111be565b5b61163d88828901611464565b92509250509295509295909350565b60008115159050919050565b6116618161164c565b82525050565b611670816111e3565b82525050565b61167f816113c3565b82525050565b600060808201905061169a6000830187611658565b6116a76020830186611667565b6116b46040830185611667565b6116c16060830184611676565b95945050505050565b60006020820190506116df6000830184611667565b92915050565b6000602082840312156116fb576116fa6111b9565b5b60006117098482850161120c565b91505092915050565b60006020820190506117276000830184611676565b92915050565b600060208284031215611743576117426111b9565b5b6000611751848285016115af565b91505092915050565b600060608201905061176f6000830186611667565b61177c6020830185611667565b6117896040830184611676565b949350505050565b6000806000606084860312156117aa576117a96111b9565b5b60006117b88682870161120c565b93505060206117c98682870161120c565b92505060406117da868287016113e4565b9150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061181e826113c3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611851576118506117e4565b5b600182019050919050565b60006040820190506118716000830185611667565b61187e6020830184611667565b9392505050565b600082825260208201905092915050565b7f492068617665206e65766572207365656e2074686973204d616e2f427269646760008201527f65436f6e747261637420696e206d79206c696665210000000000000000000000602082015250565b60006118f2603583611885565b91506118fd82611896565b604082019050919050565b60006020820190508181036000830152611921816118e5565b9050919050565b600082825260208201905092915050565b60006119458385611928565b93506119528385846112e8565b61195b8361122b565b840190509392505050565b600060808201905061197b6000830188611676565b6119886020830187611667565b6119956040830186611430565b81810360608301526119a8818486611939565b90509695505050505050565b6119bd8161164c565b81146119c857600080fd5b50565b6000815190506119da816119b4565b92915050565b6000602082840312156119f6576119f56111b9565b5b6000611a04848285016119cb565b91505092915050565b7f6e6f2073697374657220636f6e74726163742073706563696669656421000000600082015250565b6000611a43601d83611885565b9150611a4e82611a0d565b602082019050919050565b60006020820190508181036000830152611a7281611a36565b9050919050565b6000819050919050565b611a94611a8f82611426565b611a79565b82525050565b6000611aa68284611a83565b60208201915081905092915050565b6000611ac0826111c3565b9050919050565b611ad081611ab5565b8114611adb57600080fd5b50565b600081519050611aed81611ac7565b92915050565b600081519050611b02816113cd565b92915050565b600080600060608486031215611b2157611b206111b9565b5b6000611b2f86828701611ade565b9350506020611b4086828701611ade565b9250506040611b5186828701611af3565b9150509250925092565b7f4120636f6e7472616374206973206120636f6e7472616374206973206120636f60008201527f6e74726163742100000000000000000000000000000000000000000000000000602082015250565b6000611bb7602783611885565b9150611bc282611b5b565b604082019050919050565b60006020820190508181036000830152611be681611baa565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611c49602683611885565b9150611c5482611bed565b604082019050919050565b60006020820190508181036000830152611c7881611c3c565b9050919050565b600081519050611c8e81611598565b92915050565b600060208284031215611caa57611ca96111b9565b5b6000611cb884828501611c7f565b91505092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611cf7602083611885565b9150611d0282611cc1565b602082019050919050565b60006020820190508181036000830152611d2681611cea565b905091905056fea2646970667358221220b025144fb743f59a8dbcb01d17754cfece63dfe270ecb9202be178d0a3be9cc264736f6c63430008090033",
    "linkReferences": {},
    "deployedLinkReferences": {}
  }
  ]



 

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

