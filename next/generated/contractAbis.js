// ==== GENERATED CONTRACT ABIS START ====
export const contractAbis = {
  "VTRU": [
    {
      "type": "event",
      "anonymous": false,
      "name": "AdminChanged",
      "inputs": [
        {
          "type": "address",
          "name": "previousAdmin",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newAdmin",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "spender",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "type": "address",
          "name": "beacon",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BridgeMessage",
      "inputs": [
        {
          "type": "uint256",
          "name": "sourceChainId",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "taskId",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "MessageOwnershipTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousOwner",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newOwner",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Paused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RecoverToken",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": false
        },
        {
          "type": "address",
          "name": "token",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "SendMessageWithFeature",
      "inputs": [
        {
          "type": "uint256",
          "name": "txId",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "destinationChainId",
          "indexed": false
        },
        {
          "type": "uint32",
          "name": "featureId",
          "indexed": false
        },
        {
          "type": "bytes",
          "name": "featureData",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "SetExsig",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": false
        },
        {
          "type": "address",
          "name": "exsig",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "SetMaxfee",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "maxfee",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "SetMaxgas",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "maxGas",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unpaused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Upgraded",
      "inputs": [
        {
          "type": "address",
          "name": "implementation",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VTRUCoinLocked",
      "inputs": [
        {
          "type": "uint256",
          "name": "toChainId",
          "indexed": false
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VTRUCoinUnlocked",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VTRUTokenBurned",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VTRUTokenMinted",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": true
        }
      ]
    },
    {
      "type": "fallback",
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "CHAINS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": "endpoint"
        },
        {
          "type": "bytes",
          "name": "endpointExtended"
        },
        {
          "type": "uint16",
          "name": "confirmations"
        },
        {
          "type": "bool",
          "name": "extended"
        }
      ]
    },
    {
      "type": "function",
      "name": "DECIMALS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "FEATURES",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint32",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": "endpoint"
        },
        {
          "type": "bytes",
          "name": "endpointExtended"
        },
        {
          "type": "uint16",
          "name": "confirmations"
        },
        {
          "type": "bool",
          "name": "extended"
        }
      ]
    },
    {
      "type": "function",
      "name": "FEATURE_GATEWAY",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "FEE_TOKEN",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MESSAGE_OWNER",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MESSAGEv3",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "TASK_MINT_TOKEN",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "TASK_UNLOCK_COIN",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "UPGRADER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "addItem",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "item"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "allowance",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "spender"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "burnVTRUToken",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "destChainId"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "configureClient",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_messageV3"
        },
        {
          "type": "uint256[]",
          "name": "_chains"
        },
        {
          "type": "address[]",
          "name": "_endpoints"
        },
        {
          "type": "uint16[]",
          "name": "_confirmations"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "configureClientExtended",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_messageV3"
        },
        {
          "type": "uint256[]",
          "name": "_chains"
        },
        {
          "type": "bytes[]",
          "name": "_endpoints"
        },
        {
          "type": "uint16[]",
          "name": "_confirmations"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "configureFeatureGateway",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_featureGateway"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "decimals",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint8",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "decreaseAllowance",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "subtractedValue"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "increaseAllowance",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "addedValue"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "isAuthorized",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_sender"
        },
        {
          "type": "uint256",
          "name": "_sourceChainId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "isSelf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_sender"
        },
        {
          "type": "uint256",
          "name": "_sourceChainId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "lockVTRUCoin",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "uint256",
          "name": "destChainId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "messageProcess",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": "sourceChainId"
        },
        {
          "type": "address",
          "name": "sender"
        },
        {
          "type": "address",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "paused",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "recoverToken",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_token"
        },
        {
          "type": "uint256",
          "name": "_amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "removeItem",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "item"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "sendToVIBE",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setExsig",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_signer"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setMaxfee",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "_maxFee"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setMaxgas",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "_maxGas"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transfer",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferMessageOwnership",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_newMessageOwner"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unpause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "VTRU_ETH": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "type": "function",
      "stateMutability": "view"
    }
  ],
  "VTRU_BSC": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "type": "function",
      "stateMutability": "view"
    }
  ],
  "USDC_VTRU": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDC_ETH": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDC_BSC": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDC_POL": [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "remaining",
          "type": "uint256"
        }
      ],
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    }
  ],
  "USDC_SOL": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "type": "function"
    }
  ],
  "USDC_ARB": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDC_OPT": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDC_BASE": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDC_AVAX": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDT_ETH": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDT_POL": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDT_ARB": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDT_OPT": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "USDT_AVAX": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "VTRU_STAKED": [
    {
      "type": "event",
      "anonymous": false,
      "name": "AdminChanged",
      "inputs": [
        {
          "type": "address",
          "name": "previousAdmin",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newAdmin",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "type": "address",
          "name": "beacon",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Paused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Staked",
      "inputs": [
        {
          "type": "address",
          "name": "user",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "stakeTermID",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "startBlock",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unpaused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unstaked",
      "inputs": [
        {
          "type": "address",
          "name": "user",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "reward",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Upgraded",
      "inputs": [
        {
          "type": "address",
          "name": "implementation",
          "indexed": true
        }
      ]
    },
    {
      "type": "function",
      "name": "DAYS_IN_YEAR",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_BONUS_MULTIPLIER",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "ONE_EPOCH",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "UPGRADER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "activeStakeTerms",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "activeStakes",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "addStakeTerm",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "epochs"
        },
        {
          "type": "uint256",
          "name": "aprBasisPoints"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "adminChangeStakeTerm",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "userStakeIndex"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "calculateBonus",
      "constant": true,
      "stateMutability": "pure",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        },
        {
          "type": "uint256",
          "name": "bonusMultiplier"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "calculateFullReward",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        },
        {
          "type": "uint256",
          "name": "startBlock"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "calculateReward",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        },
        {
          "type": "uint256",
          "name": "startBlock"
        },
        {
          "type": "uint256",
          "name": "endBlock"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "changeStakeTerm",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "stakeTermId"
        },
        {
          "type": "uint256",
          "name": "epochs"
        },
        {
          "type": "uint256",
          "name": "aprBasisPoints"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getStakeTerms",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "id"
            },
            {
              "type": "uint256",
              "name": "epochs"
            },
            {
              "type": "uint256",
              "name": "aprBasisPoints"
            },
            {
              "type": "bool",
              "name": "active"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getUserStakesInfo",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "stakeInfos",
          "components": [
            {
              "type": "uint256",
              "name": "stakeId"
            },
            {
              "type": "uint256",
              "name": "stakeTermID"
            },
            {
              "type": "uint256",
              "name": "startBlock"
            },
            {
              "type": "uint256",
              "name": "endBlock"
            },
            {
              "type": "uint256",
              "name": "amount"
            },
            {
              "type": "uint256",
              "name": "unstakeAmount"
            },
            {
              "type": "uint256",
              "name": "reward"
            },
            {
              "type": "bool",
              "name": "eligibleToUnstake"
            }
          ]
        },
        {
          "type": "uint256",
          "name": "totalUnstakedAmount"
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "hasStakes",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "nextStakeTermId",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "paused",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setStakeTermStatus",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "stakeTermId"
        },
        {
          "type": "bool",
          "name": "isActive"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stake",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "uint256",
          "name": "stakeTermID"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stakeAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        },
        {
          "type": "uint256",
          "name": "blockNumber"
        },
        {
          "type": "uint256",
          "name": "amount"
        },
        {
          "type": "uint256",
          "name": "bonusMultiplier"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stakeAdminFunded",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        },
        {
          "type": "uint256",
          "name": "blockNumber"
        },
        {
          "type": "uint256",
          "name": "bonusMultiplier"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stakeFor",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stakeForCore",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        },
        {
          "type": "uint256",
          "name": "bonusMultiplier"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stakeTerms",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "epochs"
        },
        {
          "type": "uint256",
          "name": "aprBasisPoints"
        }
      ]
    },
    {
      "type": "function",
      "name": "stats",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "totalStakedAmount"
        },
        {
          "type": "uint256",
          "name": "totalRewardDist"
        },
        {
          "type": "uint256",
          "name": "totalStakes"
        },
        {
          "type": "uint256",
          "name": "activeStakesCount"
        },
        {
          "type": "uint256",
          "name": "totalUsersCount"
        },
        {
          "type": "uint256",
          "name": "totalStakingTerms"
        }
      ]
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalRewardDistributed",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalStaked",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalStakesCreated",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalUsers",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "unpause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unstake",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unstakeAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "address",
          "name": "payee"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "userStakes",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "amount"
        },
        {
          "type": "uint256",
          "name": "startBlock"
        },
        {
          "type": "uint256",
          "name": "stakeTermID"
        }
      ]
    },
    {
      "type": "function",
      "name": "withdrawVtru",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "SEVOX_STAKED": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "walletAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedAmount",
          "type": "uint256"
        }
      ],
      "name": "AirdropClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "walletAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedAmount",
          "type": "uint256"
        }
      ],
      "name": "TokensGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "walletAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedAmount",
          "type": "uint256"
        }
      ],
      "name": "TokensPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "INITIAL_WALLET_PERCENT",
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
      "name": "PRICE_FEED_ADDRESS",
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
      "name": "PRICE_IN_CENTS",
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
          "internalType": "address[]",
          "name": "users",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "tokens",
          "type": "uint256[]"
        }
      ],
      "name": "addAirdropUsers",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "airdropUsers",
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
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "calculatePurchaseTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "walletTokens",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lockedTokens",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimAirdrop",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "creator",
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
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBNBPrice",
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
      "name": "getLockedClaimUserCount",
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
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getLockedClaims",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "blockNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct SEVOX.LockedClaim[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "start",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "getLockedClaimsBatch",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "blockNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct SEVOX.LockedClaim[][]",
          "name": "",
          "type": "tuple[][]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "grantTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
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
      "name": "lockedClaimUsers",
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
      "name": "lockedClaims",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "blockNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "purchaseTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
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
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "VERSE": [
    {
      "type": "event",
      "anonymous": false,
      "name": "AdminChanged",
      "inputs": [
        {
          "type": "address",
          "name": "previousAdmin",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newAdmin",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "approved",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "operator",
          "indexed": true
        },
        {
          "type": "bool",
          "name": "approved",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "type": "address",
          "name": "beacon",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Paused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unpaused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Upgraded",
      "inputs": [
        {
          "type": "address",
          "name": "implementation",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VerseMinted",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "uint8",
          "name": "mode",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "units",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VerseUnitsAdded",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "uint8",
          "name": "mode",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "units",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VerseUnitsTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "sourceTokenId",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "targetTokenId",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "units",
          "indexed": false
        }
      ]
    },
    {
      "type": "function",
      "name": "BLOCK_LIST_CONTRACT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "CORE_STAKE_CONTRACT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "GRANTER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MANAGER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "UPGRADER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "VTRO_TOKEN_CONTRACT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getApproved",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getVerseNFT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        },
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "uint8",
              "name": "mode"
            },
            {
              "type": "uint256",
              "name": "units"
            },
            {
              "type": "uint256",
              "name": "claimed"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getVerseNFTByOwner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "uint8",
              "name": "mode"
            },
            {
              "type": "uint256",
              "name": "units"
            },
            {
              "type": "uint256",
              "name": "claimed"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "global",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "nextTokenId"
        },
        {
          "type": "uint256",
          "name": "totalRevenueShare"
        },
        {
          "type": "uint256",
          "name": "claimedRevenueShare"
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "isApprovedForAll",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "operator"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "mintAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint8",
          "name": "mode"
        },
        {
          "type": "uint256",
          "name": "units"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintStake",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintSwap",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "uint256",
          "name": "units"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "ownerOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "paused",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revoke",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "roundAmount",
      "constant": true,
      "stateMutability": "pure",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setApprovalForAll",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "bool",
          "name": "approved"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stats",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenByIndex",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "index"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenOfOwnerByIndex",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "uint256",
          "name": "index"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenURI",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "transferUnits",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "sourceTokenId"
        },
        {
          "type": "uint256",
          "name": "targetTokenId"
        },
        {
          "type": "uint256",
          "name": "units"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unpause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "version",
      "constant": true,
      "stateMutability": "pure",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "withdrawVTRO",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "withdrawVTRU",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "VIBE": [
    {
      "type": "event",
      "anonymous": false,
      "name": "AdminChanged",
      "inputs": [
        {
          "type": "address",
          "name": "previousAdmin",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newAdmin",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "approved",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "operator",
          "indexed": true
        },
        {
          "type": "bool",
          "name": "approved",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "type": "address",
          "name": "beacon",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Paused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unpaused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Upgraded",
      "inputs": [
        {
          "type": "address",
          "name": "implementation",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VibeNFTFundsClaimed",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "claimed",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VibeNFTGranted",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "denomination",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        }
      ]
    },
    {
      "type": "function",
      "name": "BLOCK_LIST_CONTRACT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DENOMINATIONS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "GRANTER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MAX_TOTAL_SHARES",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MOD_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "UPGRADER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "VALIDATOR_TOTAL_SHARES",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "addTokensToOwnersBatch",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address[]",
          "name": "owners"
        },
        {
          "type": "uint256[]",
          "name": "tokenIds"
        },
        {
          "type": "uint256[]",
          "name": "tokenIndexes"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "calcDenominations",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "uint256[]",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "calcUnclaimedRevenueShare",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "claimRevenueShareByOwner",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "claimRevenueShareByToken",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "getApproved",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRevenueShareByOwner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRevenueShareByOwner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getVibeNFT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        },
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "uint256",
              "name": "denomination"
            },
            {
              "type": "uint256",
              "name": "claimed"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getVibeNFTBatch",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "startTokenId"
        },
        {
          "type": "uint256",
          "name": "endTokenId"
        }
      ],
      "outputs": [
        {
          "type": "address[]",
          "name": ""
        },
        {
          "type": "tuple[]",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "uint256",
              "name": "denomination"
            },
            {
              "type": "uint256",
              "name": "claimed"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getVibeNFTSharesByOwner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "shares"
        }
      ]
    },
    {
      "type": "function",
      "name": "getVibeNFTsByOwner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "uint256",
              "name": "denomination"
            },
            {
              "type": "uint256",
              "name": "claimed"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "global",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "nextTokenId"
        },
        {
          "type": "uint256",
          "name": "issuedShares"
        },
        {
          "type": "uint256",
          "name": "totalRevenueShare"
        },
        {
          "type": "uint256",
          "name": "claimedRevenueShare"
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "isApprovedForAll",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "operator"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "issueVibeNFT",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "issueVibeNFTBatch",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts"
        },
        {
          "type": "uint256[]",
          "name": "amounts"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "issueVibeNFTDenoms",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256[]",
          "name": "denomCounts"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "modTransferAllVibeNFT",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "blockedOwner"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "modTransferVibeNFT",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "ownerOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "paused",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "poolContract",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "recoverVTRU",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeVibeNFT",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setApprovalForAll",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "bool",
          "name": "approved"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "stakeQuota",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "stats",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256[]",
          "name": ""
        },
        {
          "type": "uint256[]",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenByIndex",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "index"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenOfOwnerByIndex",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "uint256",
          "name": "index"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenURI",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalPoolRevenue",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unpause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "veoSharesBalance",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "version",
      "constant": true,
      "stateMutability": "pure",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "VORTEX": [
    {
      "type": "constructor",
      "stateMutability": "undefined",
      "payable": false,
      "inputs": []
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "AdminChanged",
      "inputs": [
        {
          "type": "address",
          "name": "previousAdmin",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newAdmin",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "approved",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "operator",
          "indexed": true
        },
        {
          "type": "bool",
          "name": "approved",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "type": "address",
          "name": "beacon",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "TokenSwapped",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "uint256[]",
          "name": "burnedTokenIds"
        },
        {
          "type": "uint256",
          "name": "newTokenId",
          "indexed": false
        },
        {
          "type": "uint8",
          "name": "newRarity",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Upgraded",
      "inputs": [
        {
          "type": "address",
          "name": "implementation",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VortexMinted",
      "inputs": [
        {
          "type": "address",
          "name": "buyer",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "VortexOwed",
      "inputs": [
        {
          "type": "address",
          "name": "buyer",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokens",
          "indexed": false
        }
      ]
    },
    {
      "type": "function",
      "name": "ADJUST_INTERVAL",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "FINAL_PRICE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "INITIAL_PRICE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "INTERVAL_START",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MAX_AIRDROP_WINS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MAX_TOKENS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MINT_LIMIT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "UPGRADER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "USDC_DECIMALS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "_airdropResults",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint8",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "drawing"
        },
        {
          "type": "uint8",
          "name": "rarity"
        },
        {
          "type": "address",
          "name": "winner"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ]
    },
    {
      "type": "function",
      "name": "airdropResults",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint8",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "drawing"
        },
        {
          "type": "uint8",
          "name": "rarity"
        },
        {
          "type": "address",
          "name": "winner"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ]
    },
    {
      "type": "function",
      "name": "airdropWinners",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "airdrops",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint8",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "currentVibesInInterval",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getApproved",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getGlyph",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "code"
        }
      ],
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "string",
              "name": "name"
            },
            {
              "type": "string",
              "name": "description"
            },
            {
              "type": "string",
              "name": "glyph"
            },
            {
              "type": "uint256",
              "name": "code"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getPrice",
      "constant": true,
      "stateMutability": "pure",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRarityStatistics",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint8",
          "name": "rarity"
        }
      ],
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "purchased"
            },
            {
              "type": "uint256",
              "name": "remaining"
            },
            {
              "type": "uint256",
              "name": "revenuePercentage"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getToken",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "string",
              "name": "rarity"
            },
            {
              "type": "string",
              "name": "glyphName"
            },
            {
              "type": "uint256",
              "name": "glyphCode"
            },
            {
              "type": "bool",
              "name": "vibe"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokenIdsByRarity",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint8",
          "name": "rarity"
        }
      ],
      "outputs": [
        {
          "type": "uint256[]",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokenOwnersByRarity",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint8",
          "name": "rarity"
        }
      ],
      "outputs": [
        {
          "type": "address[]",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokenStatistics",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokens",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "string",
              "name": "rarity"
            },
            {
              "type": "string",
              "name": "glyphName"
            },
            {
              "type": "uint256",
              "name": "glyphCode"
            },
            {
              "type": "bool",
              "name": "vibe"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokens",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "startId"
        },
        {
          "type": "uint256",
          "name": "endId"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "string",
              "name": "rarity"
            },
            {
              "type": "string",
              "name": "glyphName"
            },
            {
              "type": "uint256",
              "name": "glyphCode"
            },
            {
              "type": "bool",
              "name": "vibe"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokensOwed",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "glyphCodes",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "glyphInfo",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "string",
          "name": "name"
        },
        {
          "type": "string",
          "name": "description"
        },
        {
          "type": "string",
          "name": "glyph"
        },
        {
          "type": "uint256",
          "name": "code"
        }
      ]
    },
    {
      "type": "function",
      "name": "glyphToTokenIds",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "intervalStartMint",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "isApprovedForAll",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "operator"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "lastClaimed",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "mintAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokens"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintAdminOwed",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokens"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintOwed",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokens"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintPartner",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokens"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintPublic",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokens"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "ownerOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "rarities",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "rarityToTokenIds",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint8",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setApprovalForAll",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "bool",
          "name": "approved"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setGlyphInfo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "string[]",
          "name": "names"
        },
        {
          "type": "string[]",
          "name": "descriptions"
        },
        {
          "type": "string[]",
          "name": "glyphs"
        },
        {
          "type": "uint256[]",
          "name": "glyphUnicodes"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setUSDC",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "_usdc"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "threshold",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenByIndex",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "index"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenGlyph",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenIndexInGlyph",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenIndexInRarity",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenOfOwnerByIndex",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "uint256",
          "name": "index"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenRarity",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint8",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenURI",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokensOwed",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "tokensOwedAddresses",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "total",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "sales"
        },
        {
          "type": "uint256",
          "name": "tokensSold"
        },
        {
          "type": "uint256",
          "name": "revenue"
        }
      ]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalVibes",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "usdc",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "vibeTokens",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "withdrawAllUSDC",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "withdrawUSDC",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "withdrawVTRU",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "VTRO": [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    }
  ],
  "VUSD": [
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "spender",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Granted",
      "inputs": [
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "vusdAmount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
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
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Paused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Redeemed",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "licenseInstanceId",
          "indexed": true
        },
        {
          "type": "address[5]",
          "name": "payees"
        },
        {
          "type": "uint256[5]",
          "name": "cents"
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Revoked",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unpaused",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": false
        }
      ]
    },
    {
      "type": "function",
      "name": "BLOCKER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "BLOCKS_PER_EPOCH",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "GRANTER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "REDEEMER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "USDC_ADDRESS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "VTRU_DECIMALS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "VUSD_DECIMALS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "WVTRU_ADDRESS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "addBlock",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "allowance",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "spender"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "calculateRedemptionAmounts",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "address[5]",
          "name": "payees"
        },
        {
          "type": "uint256[5]",
          "name": "cents"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "totalVusd"
        },
        {
          "type": "uint256",
          "name": "grantVusd"
        },
        {
          "type": "uint256",
          "name": "nonGrantVusd"
        },
        {
          "type": "uint256",
          "name": "balanceVusd"
        }
      ]
    },
    {
      "type": "function",
      "name": "collateralRatio",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "ratio"
        }
      ]
    },
    {
      "type": "function",
      "name": "decimals",
      "constant": true,
      "stateMutability": "pure",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint8",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "decreaseAllowance",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "subtractedValue"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "deleteAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "vusd"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "depositAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "vusd"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "depositCollateral",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "fallbackVtruPrice",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getAccountVaultInfo",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "address",
          "name": "vault"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "limitCents"
        },
        {
          "type": "uint256",
          "name": "redeemedCents"
        },
        {
          "type": "uint256",
          "name": "limitCount"
        },
        {
          "type": "uint256",
          "name": "redeemedCount"
        }
      ]
    },
    {
      "type": "function",
      "name": "getBalancesInCents",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getCurrentVtruPrice",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getGrant",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "grantee"
        }
      ],
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "amount"
            },
            {
              "type": "uint256",
              "name": "balance"
            },
            {
              "type": "uint256",
              "name": "endEpoch"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getMaxVaultRedemptionLimitInCents",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "vault"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getVtruConversion",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "vusdAmount"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getVusdConversion",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "vtruAmount"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "grant",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "cents"
        },
        {
          "type": "uint256",
          "name": "epochs"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "grantBalanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "increaseAllowance",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "addedValue"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "maxRedemptionAmountPerVault",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "maxRedemptionsPerVault",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "mintWithUsdc",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "vusdAmount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintWithVtru",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "vusdAmount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "nonGrantBalanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "owner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "paused",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "redeem",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "licenseInstanceId"
        },
        {
          "type": "address[5]",
          "name": "payees"
        },
        {
          "type": "uint256[5]",
          "name": "cents"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "redeemAdmin",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "vusd"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "removeBlock",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revoke",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setDefaultVaultMaxRedemptionAmount",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "vusdAmount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setDefaultVaultMaxRedemptionCount",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "count"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setFallbackVtruPrice",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "cents"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setMaxRedemptionAmountByVault",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "dollars"
        },
        {
          "type": "address",
          "name": "vault"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transfer",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newOwner"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unpause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "withdrawUsdc",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "withdrawVtru",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "WVTRU": [
    {
      "type": "event",
      "anonymous": false,
      "name": "AdminChanged",
      "inputs": [
        {
          "type": "address",
          "name": "previousAdmin",
          "indexed": false
        },
        {
          "type": "address",
          "name": "newAdmin",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "spender",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "type": "address",
          "name": "beacon",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Initialized",
      "inputs": [
        {
          "type": "uint8",
          "name": "version",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "previousAdminRole",
          "indexed": true
        },
        {
          "type": "bytes32",
          "name": "newAdminRole",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleGranted",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "RoleRevoked",
      "inputs": [
        {
          "type": "bytes32",
          "name": "role",
          "indexed": true
        },
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "address",
          "name": "sender",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Unwrap",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Upgraded",
      "inputs": [
        {
          "type": "address",
          "name": "implementation",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Wrap",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "function",
      "name": "BASE_EPOCH_PERIOD",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "BLOCK_LIST_CONTRACT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DECIMALS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "EPOCH_BLOCKS",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "MINIMUM_WRAP_VTRU",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "SERVICE_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "UPGRADER_ROLE",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "VIBE_CONTRACT",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "allowance",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "spender"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "burn",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "burnFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "circuitBreakerInfo",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "decimals",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint8",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "decreaseAllowance",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "subtractedValue"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "epochCurrent",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "epochCurrentBlock",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "epochNext",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "epochNextBlock",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "grantRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "hasRole",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "increaseAllowance",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "spender"
        },
        {
          "type": "uint256",
          "name": "addedValue"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "initialize",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pairAddress",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "pause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "priceByEpoch",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "priceCurrent",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "priceRange",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "startEpoch"
        },
        {
          "type": "uint256",
          "name": "endEpoch"
        }
      ],
      "outputs": [
        {
          "type": "uint256[]",
          "name": "blockNumbers"
        },
        {
          "type": "uint256[]",
          "name": "prices"
        }
      ]
    },
    {
      "type": "function",
      "name": "priceTrailing",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "recoverVTRU",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "recoverVTRU",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "renounceRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "resetUserPeriod",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "revokeRole",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "bytes32",
          "name": "role"
        },
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setPairAddress",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newPairAddress"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalEpochResetBlock",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalEpochWrapped",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totalWrapped",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "totals",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transfer",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "unpause",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unwrap",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "amount"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "unwrapAll",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "address",
          "name": "newImplementation"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "userInfo",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        },
        {
          "type": "uint256",
          "name": ""
        }
      ]
    },
    {
      "type": "function",
      "name": "wrap",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ],
  "SEVO": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "claimInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "withBtc",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "withoutBtc",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "gain",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "priorClaimed",
              "type": "uint256"
            }
          ],
          "internalType": "struct ClaimInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "SEVOX": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "walletAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedAmount",
          "type": "uint256"
        }
      ],
      "name": "AirdropClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "walletAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedAmount",
          "type": "uint256"
        }
      ],
      "name": "TokensGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "walletAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedAmount",
          "type": "uint256"
        }
      ],
      "name": "TokensPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "INITIAL_WALLET_PERCENT",
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
      "name": "PRICE_FEED_ADDRESS",
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
      "name": "PRICE_IN_CENTS",
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
          "internalType": "address[]",
          "name": "users",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "tokens",
          "type": "uint256[]"
        }
      ],
      "name": "addAirdropUsers",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "airdropUsers",
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
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "calculatePurchaseTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "walletTokens",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lockedTokens",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimAirdrop",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "creator",
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
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBNBPrice",
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
      "name": "getLockedClaimUserCount",
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
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getLockedClaims",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "blockNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct SEVOX.LockedClaim[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "start",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "getLockedClaimsBatch",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "blockNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct SEVOX.LockedClaim[][]",
          "name": "",
          "type": "tuple[][]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "grantTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
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
      "name": "lockedClaimUsers",
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
      "name": "lockedClaims",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "blockNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "purchaseTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
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
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "V3DEX": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "VITDEX": [
    {
      "type": "function",
      "name": "getVitdexNFTByOwner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "uint256",
              "name": "units"
            },
            {
              "type": "uint256",
              "name": "claimed"
            }
          ]
        }
      ]
    }
  ]
};
// ==== GENERATED CONTRACT ABIS END ====
