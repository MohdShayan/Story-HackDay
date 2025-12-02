import { NextResponse } from "next/server";
import { getIpIdFromCid } from "@/lib/story";
import { ethers } from "ethers";
import { remixHubAbi } from "@/lib/remixHubAbi";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get("cid");
        if (!cid) {
            return NextResponse.json({ error: "cid is required" }, { status: 400 });
        }
        let ipId = await getIpIdFromCid(cid);
        if (!ipId) {
            // Fallback to RemixHub OriginalRegistered logs by matching cidHash
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
                const targetHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
                for (const l of logs) {
                    const pl = iface.parseLog({ topics: l.topics, data: l.data } as any);
                    const cidHash: string | undefined = pl?.args?.cidHash;
                    if (cidHash && cidHash.toLowerCase() === targetHash.toLowerCase()) {
                        const ipIdVal = pl?.args?.ipId as bigint | undefined;
                        if (ipIdVal !== undefined) {
                            ipId = ethers.toBeHex(ipIdVal);
                            break;
                        }
                    }
                }
            } catch (e) {
                console.warn("lookup fallback via RemixHub failed", e);
            }
        }
        return NextResponse.json({ ipId }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "lookup failed" }, { status: 500 });
    }
}
