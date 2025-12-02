import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { remixHubAbi } from "@/lib/remixHubAbi";
import { getIpIdFromCid } from "@/lib/story";

function toTopicHex32(id: string) {
    try {
        // Accept decimal or 0x-hex; normalize to BigInt then 32-byte hex
        const bi = id.startsWith("0x") ? BigInt(id) : BigInt(id);
        return ethers.toBeHex(bi, 32);
    } catch {
        // If it's an address-like hex (0x...), still try BigInt
        const bi = BigInt(id as any);
        return ethers.toBeHex(bi, 32);
    }
}

export async function GET(req: Request) {
    try {
        const contract = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS;
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
        if (!contract || !rpcUrl) {
            return NextResponse.json(
                { error: "RemixHub address or RPC URL not configured" },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(req.url);
        let parentIpId = searchParams.get("parentIpId");
        const parentCid = searchParams.get("parentCid");
        if (!parentIpId && !parentCid) {
            return NextResponse.json(
                { error: "Provide parentIpId or parentCid as query param" },
                { status: 400 }
            );
        }

        if (!parentIpId && parentCid) {
            let resolved = await getIpIdFromCid(parentCid);
            if (!resolved) {
                // Fallback via RemixHub OriginalRegistered logs
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
                    const targetHash = ethers.keccak256(ethers.toUtf8Bytes(parentCid));
                    for (const l of logs) {
                        const pl = iface.parseLog({ topics: l.topics, data: l.data } as any);
                        const cidHash: string | undefined = pl?.args?.cidHash;
                        if (cidHash && cidHash.toLowerCase() === targetHash.toLowerCase()) {
                            const ipIdVal = pl?.args?.ipId as bigint | undefined;
                            if (ipIdVal !== undefined) {
                                resolved = ethers.toBeHex(ipIdVal);
                                break;
                            }
                        }
                    }
                } catch (e) {
                    console.warn("derivatives fallback via RemixHub failed", e);
                }
            }
            if (!resolved) {
                return NextResponse.json(
                    { error: "Unable to resolve parent ipId from cid" },
                    { status: 404 }
                );
            }
            parentIpId = resolved;
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const iface = new ethers.Interface(remixHubAbi as any);

        const eventTopic = typeof (iface as any).getEventTopic === "function"
            ? (iface as any).getEventTopic("DerivativeLinked")
            : ethers.id("DerivativeLinked(uint256,uint256,address,uint96,uint96)");

        const parentTopicValue = toTopicHex32(parentIpId!);

        const rawLogs = await provider.getLogs({
            address: contract as `0x${string}`,
            fromBlock: 0,
            topics: [eventTopic, parentTopicValue],
        });

        const parsed = await Promise.all(
            rawLogs.map(async (l) => {
                const parsedLog = iface.parseLog({ topics: l.topics, data: l.data } as any);
                const childIpIdBig = parsedLog?.args?.childIpId as bigint;
                let childCidHash: string | null = null;
                try {
                    // Try to read original mapping; may be empty for derivatives
                    const contractInst = new ethers.Contract(
                        contract as `0x${string}`,
                        remixHubAbi as any,
                        provider
                    );
                    const rec = await contractInst.getOriginal(childIpIdBig);
                    if (rec && rec.exists) {
                        childCidHash = rec.cidHash as string;
                    }
                } catch {
                    // ignore lookup failures
                }
                return {
                    blockNumber: String(l.blockNumber),
                    transactionHash: l.transactionHash,
                    args: {
                        parentIpId: parsedLog?.args?.parentIpId !== undefined && parsedLog?.args?.parentIpId !== null ? String(parsedLog?.args?.parentIpId) : null,
                        childIpId: childIpIdBig !== undefined && childIpIdBig !== null ? String(childIpIdBig) : null,
                        splitter: parsedLog?.args?.splitter ?? null,
                        originalBps: parsedLog?.args?.originalBps !== undefined && parsedLog?.args?.originalBps !== null ? Number(parsedLog?.args?.originalBps) : null,
                        platformBps: parsedLog?.args?.platformBps !== undefined && parsedLog?.args?.platformBps !== null ? Number(parsedLog?.args?.platformBps) : null,
                        childCidHash,
                    },
                };
            })
        );

        return NextResponse.json(parsed, { status: 200 });
    } catch (err: any) {
        console.error("[/api/story/derivatives] error:", err);
        return NextResponse.json(
            { error: err?.message || "Failed to fetch derivatives" },
            { status: 500 }
        );
    }
}
