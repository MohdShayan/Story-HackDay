import { NextResponse } from "next/server";
import { registerIpOnStory } from "@/lib/story";
import { ethers } from "ethers";

export async function POST(req: Request) {
  try {
    const { cid, title } = await req.json();

    if (!cid || typeof cid !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid IPFS CID required" },
        { status: 400 }
      );
    }

    const { ipId, txHash } = await registerIpOnStory(cid);

    // Wait for transaction confirmation to avoid 404 on StoryScan
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
      if (rpcUrl && txHash) {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        await provider.waitForTransaction(txHash);
      }
    } catch (e) {
      console.warn("Waiting for Story registration tx failed or timed out", e);
    }

    return NextResponse.json({
      success: true,
      ipId,
      txHash,
      explorer: `https://aeneid.storyscan.io/ip-id/${ipId}`,
    });
  } catch (err: any) {
    console.error("Story registration error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register IP" },
      { status: 500 }
    );
  }
}