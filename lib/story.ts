import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { storyRegistrationABI } from "./storyRegistrationABI";
import { storyAeneid } from "./storychain";
import { keccak256, toUtf8Bytes } from "ethers";

const storyContract = "0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424";

export async function registerIpOnStory(metadataCid: string) {
  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY!.replace(/^0x/, "")}`);

  const client = createWalletClient({
    account,
    chain: storyAeneid,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
  });

  const contentHash = keccak256(toUtf8Bytes(metadataCid));
  const licenseData = "0x"; // blank license config (MVP)

  console.log("📡 Registering IP on Story...");
  console.log("CID:", metadataCid);
  console.log("CID Hash:", contentHash);

  const tx = await client.writeContract({
    address: storyContract,
    abi: storyRegistrationABI,
    functionName: "registerIpAndAttachPILicense",
    args: [contentHash, metadataCid, licenseData],
  });

  console.log("✅ Transaction sent:", tx);
  
  return { tx, contentHash };
}
