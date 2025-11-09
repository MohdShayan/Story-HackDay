import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { storyAeneid } from "@/lib/storychain";
import { remixHubAbi } from "@/lib/remixHubAbi";

export async function GET() {
  const contract = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS!;

  const client = createPublicClient({
    chain: storyAeneid,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
  });

  // You didn't build a getter list in contract, so MVP = events scanning
  const logs = await client.getLogs({
    address: contract as `0x${string}`,
    event: {
      type: "event",
      name: "OriginalRegistered",
      inputs: [
        { type: "uint256", name: "ipId", indexed: true },
        { type: "address", name: "owner", indexed: true },
        { type: "uint16", name: "presetId", indexed: false },
        { type: "bytes32", name: "cidHash", indexed: false }
      ]
    },
    fromBlock: "earliest"
  });

  return NextResponse.json(logs);
}
