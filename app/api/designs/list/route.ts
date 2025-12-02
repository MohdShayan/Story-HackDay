import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { remixHubAbi } from "@/lib/remixHubAbi";

export async function GET() {
  try {
    const contract = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS;
    if (!contract) {
      return NextResponse.json(
        { error: "RemixHub contract address not configured" },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const iface = new ethers.Interface(remixHubAbi as any);

    // -----------------------------------------------------------------
    // 1. Scan OriginalRegistered events via JSON-RPC logs
    // -----------------------------------------------------------------
    // Some versions of ethers.Interface expose `getEventTopic`; if not available
    // compute the topic from the event signature as a fallback.
    const topic = typeof (iface as any).getEventTopic === "function"
      ? (iface as any).getEventTopic("OriginalRegistered")
      : ethers.id("OriginalRegistered(uint256,address,uint16,bytes32)");
    const rawLogs = await provider.getLogs({
      address: contract as `0x${string}`,
      fromBlock: 0,
      topics: [topic],
    });

    // -----------------------------------------------------------------
    // 2. Serialize BigInt → string
    // -----------------------------------------------------------------
    // Parse logs with the ABI
    function toHexIpId(v: any): `0x${string}` | null {
      try {
        // Support BigInt, number, decimal string
        const b = typeof v === "bigint" ? v : BigInt(String(v));
        if (b < BigInt(0)) return null;
        const hex = b.toString(16);
        if (hex.length > 40) return null; // must fit 20 bytes
        const padded = hex.padStart(40, "0");
        const ipId = (`0x${padded}`) as `0x${string}`;
        return ipId.length === 42 ? ipId : null;
      } catch {
        return null;
      }
    }

    const parsed = rawLogs.map((l) => {
      const parsedLog = iface.parseLog({ topics: l.topics, data: l.data } as any);
      const ipIdHex = toHexIpId(parsedLog?.args.ipId);
      return {
        blockNumber: String(l.blockNumber),
        blockHash: (l as any).blockHash ? String((l as any).blockHash) : null,
        logIndex: String((l as any).logIndex ?? "0"),
        transactionIndex: String((l as any).transactionIndex ?? "0"),
        transactionHash: l.transactionHash,
        args: {
          ipId: ipIdHex,
          owner: parsedLog?.args.owner ?? null,
          presetId: parsedLog?.args.presetId !== undefined && parsedLog?.args.presetId !== null ? Number(parsedLog?.args.presetId) : null,
          cidHash: parsedLog?.args.cidHash ?? null,
        },
      };
    });

    // -----------------------------------------------------------------
    // 3. Return safe JSON
    // -----------------------------------------------------------------
    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    console.error("[/api/designs/list] error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch logs" },
      { status: 500 }
    );
  }
}