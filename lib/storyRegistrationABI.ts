export const storyRegistrationABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "contentHash", "type": "bytes32" },
      { "internalType": "string", "name": "metadataCid", "type": "string" },
      { "internalType": "bytes", "name": "licenseData", "type": "bytes" }
    ],
    "name": "registerIpAndAttachPILicense",
    "outputs": [
      { "internalType": "uint256", "name": "ipId", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
