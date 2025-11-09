export const remixHubAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_platform",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_story",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AlreadyExists",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BadAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BadPreset",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotPlatform",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnknownDerivative",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnknownOriginal",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongValue",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "priceWei",
          "type": "uint256"
        }
      ],
      "name": "CommercialLicenseSold",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "parentIpId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "splitter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint96",
          "name": "originalBps",
          "type": "uint96"
        },
        {
          "indexed": false,
          "internalType": "uint96",
          "name": "platformBps",
          "type": "uint96"
        }
      ],
      "name": "DerivativeLinked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "ipId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "presetId",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "cidHash",
          "type": "bytes32"
        }
      ],
      "name": "OriginalRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "parentIpId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "feeWei",
          "type": "uint256"
        }
      ],
      "name": "RemixLicenseSold",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        }
      ],
      "name": "buyCommercialLicense",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "parentIpId",
          "type": "uint256"
        }
      ],
      "name": "buyRemixLicense",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "commercialLicensed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
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
      "name": "derivatives",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "parentIpId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "remixer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "splitter",
          "type": "address"
        },
        {
          "internalType": "uint96",
          "name": "originalBps",
          "type": "uint96"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        }
      ],
      "name": "getDerivative",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "parentIpId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "childIpId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "remixer",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "splitter",
              "type": "address"
            },
            {
              "internalType": "uint96",
              "name": "originalBps",
              "type": "uint96"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            }
          ],
          "internalType": "struct RemixHub.Derivative",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ipId",
          "type": "uint256"
        }
      ],
      "name": "getOriginal",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "ipId",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "cidHash",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "presetId",
              "type": "uint16"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            }
          ],
          "internalType": "struct RemixHub.Original",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "id",
          "type": "uint16"
        }
      ],
      "name": "getPreset",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint96",
              "name": "remixFeeWei",
              "type": "uint96"
            },
            {
              "internalType": "uint96",
              "name": "commercialPriceWei",
              "type": "uint96"
            },
            {
              "internalType": "uint96",
              "name": "originalBps",
              "type": "uint96"
            },
            {
              "internalType": "uint96",
              "name": "platformBps",
              "type": "uint96"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct RemixHub.Preset",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        }
      ],
      "name": "getSplitter",
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
          "name": "childIpId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasCommercialLicense",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "parentIpId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasRemixLicense",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
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
      "name": "originals",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "ipId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "cidHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "presetId",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platform",
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
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "name": "presets",
      "outputs": [
        {
          "internalType": "uint96",
          "name": "remixFeeWei",
          "type": "uint96"
        },
        {
          "internalType": "uint96",
          "name": "commercialPriceWei",
          "type": "uint96"
        },
        {
          "internalType": "uint96",
          "name": "originalBps",
          "type": "uint96"
        },
        {
          "internalType": "uint96",
          "name": "platformBps",
          "type": "uint96"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "parentIpId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "childIpId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "remixer",
          "type": "address"
        }
      ],
      "name": "registerDerivative",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ipId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "cidHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "presetId",
          "type": "uint16"
        }
      ],
      "name": "registerOriginal",
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
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "remixLicensed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "id",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint96",
              "name": "remixFeeWei",
              "type": "uint96"
            },
            {
              "internalType": "uint96",
              "name": "commercialPriceWei",
              "type": "uint96"
            },
            {
              "internalType": "uint96",
              "name": "originalBps",
              "type": "uint96"
            },
            {
              "internalType": "uint96",
              "name": "platformBps",
              "type": "uint96"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct RemixHub.Preset",
          "name": "p",
          "type": "tuple"
        }
      ],
      "name": "setPreset",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_story",
          "type": "address"
        }
      ],
      "name": "setStory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "story",
      "outputs": [
        {
          "internalType": "contract IStoryLike",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
