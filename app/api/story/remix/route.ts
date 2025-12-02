import { NextResponse } from "next/server";
import { registerDerivativeOnStory, getIpIdFromCid } from "@/lib/story";
import { ethers } from "ethers";
import { remixHubAbi } from "@/lib/remixHubAbi";

export async function POST(req: Request) {
  try {
    const { originalCid, remixCid } = await req.json();

    if (!originalCid?.trim() || !remixCid?.trim()) {
      throw new Error("originalCid and remixCid are required");
    }

    const cleanOriginalCid = originalCid.trim();
    const cleanRemixCid = remixCid.trim();

    console.log("🔍 Resolving original IP:", cleanOriginalCid);

    // ✅ 1) Resolve parent IPId from original CID
    let parentIpId = await getIpIdFromCid(cleanOriginalCid);
    if (!parentIpId) {
      // Fallback: resolve via RemixHub OriginalRegistered logs by matching cidHash
      try {
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
        const hub = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS as `0x${string}` | undefined;
        if (!rpcUrl || !hub) throw new Error("Missing RPC or RemixHub address");

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const iface = new ethers.Interface(remixHubAbi as any);
        const topic = typeof (iface as any).getEventTopic === "function"
          ? (iface as any).getEventTopic("OriginalRegistered")
          : ethers.id("OriginalRegistered(uint256,address,uint16,bytes32)");
        const logs = await provider.getLogs({ address: hub, fromBlock: 0, topics: [topic] });
        const targetHash = ethers.keccak256(ethers.toUtf8Bytes(cleanOriginalCid));
        for (const l of logs) {
          const pl = iface.parseLog({ topics: l.topics, data: l.data } as any);
          const cidHash: string | undefined = pl?.args?.cidHash;
          if (cidHash && cidHash.toLowerCase() === targetHash.toLowerCase()) {
            const ipIdVal = pl?.args?.ipId as bigint | undefined;
            if (ipIdVal !== undefined) {
              parentIpId = ethers.toBeHex(ipIdVal);
              break;
            }
          }
        }
      } catch (e) {
        console.warn("RemixHub fallback resolution failed", e);
      }
    }
    if (!parentIpId) {
      console.error("❌ Original IP not registered on chain (Story + RemixHub fallback)");
      throw new Error("Original IP not found on Story protocol chain");
    }

    console.log("🧬 Parent IP ID:", parentIpId);
    console.log("🎨 Minting remix asset for CID:", cleanRemixCid);

    // ✅ 2) Register derivative IP
    const { newIpId, txHash } = await registerDerivativeOnStory({
      parentIpId,
      remixCid: cleanRemixCid,
    });

    console.log("✅ Remix registered on chain:");
    console.log("   • Parent:", parentIpId);
    console.log("   • New Remix:", newIpId);
    console.log("   • Tx:", txHash);

    return NextResponse.json({
      success: true,
      parentIpId,
      newIpId,
      txHash,
    });

  } catch (err: any) {
    console.error("❌ Remix API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message ?? "Unknown remix error",
      },
      { status: 500 }
    );
  }
}
