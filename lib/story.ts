import {
  StoryClient,
  StoryConfig,
  PILFlavor,
  WIP_TOKEN_ADDRESS,
} from "@story-protocol/core-sdk";

import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";
import { keccak256, toUtf8Bytes } from "ethers";

const CHAIN_ID = "aeneid" as const;
const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc" as const;

export async function registerIpOnStory(metadataCid: string) {
  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) throw new Error("Missing PRIVATE_KEY in .env.local");

   const account = privateKeyToAccount(`0x${pk.replace(/^0x/, "")}`);

  const rpcUrl =
    process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io";

  const config: StoryConfig = {
    account,
    transport: http(rpcUrl),
    chainId: CHAIN_ID,
  };

  const client = StoryClient.newClient(config);

  // Hash CID for Story registry lookups (using ethers utils)
  const cidHash = keccak256(toUtf8Bytes(metadataCid)) as `0x${string}`;

  const res = await client.ipAsset.registerIpAsset({
    nft: {
      type: "mint",
      spgNftContract: SPG_NFT_CONTRACT,
      recipient: account.address,
      allowDuplicates: true,
    },
    licenseTermsData: [
      {
        terms: PILFlavor.commercialRemix({
          commercialRevShare: 10, // 10% rev share for parent creator
          defaultMintingFee: BigInt(0),
          currency: WIP_TOKEN_ADDRESS,
        }),
      },
    ],
    ipMetadata: {
      ipMetadataURI: `ipfs://${metadataCid}`,
      ipMetadataHash: cidHash,
      nftMetadataURI: `ipfs://${metadataCid}`,
      nftMetadataHash: cidHash,
    },
  });

  return {
    ipId: res.ipId,
    txHash: res.txHash,
  };
}

export async function registerDerivativeOnStory({
  parentIpId,
  remixCid,
}: {
  parentIpId: string;
  remixCid: string;
}) {
  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) throw new Error("Missing PRIVATE_KEY in .env.local");

   const account = privateKeyToAccount(`0x${pk.replace(/^0x/, "")}`);

  const rpcUrl =
    process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io";

  const config: StoryConfig = {
    account,
    transport: http(rpcUrl),
    chainId: CHAIN_ID,
  };

  const client = StoryClient.newClient(config);

  const remixCidHash = keccak256(toUtf8Bytes(remixCid)) as `0x${string}`;

  // register derivative + SPG mint + PIL flavor commercial remix
  const res = await client.ipAsset.registerDerivativeIpAsset({
    parentIpId,
    nft: {
      type: "mint",
      spgNftContract: SPG_NFT_CONTRACT,
      recipient: account.address,
      allowDuplicates: true,
    },
    licenseTermsData: [
      {
        terms: PILFlavor.commercialRemix({
          commercialRevShare: 10, // match parent IP royalty
          defaultMintingFee: BigInt(0),
          currency: WIP_TOKEN_ADDRESS,
        }),
      },
    ],
    ipMetadata: {
      ipMetadataURI: `ipfs://${remixCid}`,
      ipMetadataHash: remixCidHash,
      nftMetadataURI: `ipfs://${remixCid}`,
      nftMetadataHash: remixCidHash,
    },
  });

  return {
    newIpId: res.ipId,
    txHash: res.txHash,
  };
}

export async function getIpIdFromCid(cid: string): Promise<string | null> {
  // 1. Use ethers JSON-RPC provider for a simple read-only call
  const providerUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io";
  const provider = new (await import("ethers")).JsonRpcProvider(providerUrl);

  // 2. IPAssetRegistry address (hard-coded for Aeneid – see docs)
  const IP_ASSET_REGISTRY = "0x4c2dB1eF1cC5d5b1cB9f2E4B3c2F5e6d7F8a9b0c" as const;

  // 3. ABI for the `ipId(bytes32)` view function
  const abi = [
    {
      name: "ipId",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "hash", type: "bytes32" }],
      outputs: [{ name: "", type: "address" }],
    },
  ];

  // 4. Compute the 32-byte hash of the CID (ethers)
  const cidHash = keccak256(toUtf8Bytes(cid));

  // 5. Call the registry using ethers Contract
  const contract = new (await import("ethers")).Contract(IP_ASSET_REGISTRY, abi, provider);
  const ipId = (await contract.ipId(cidHash)) as `0x${string}`;

  // 6. `0x0000…0000` means “not registered”
  return ipId === "0x0000000000000000000000000000000000000000" ? null : ipId;
}
