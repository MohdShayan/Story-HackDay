"use client";

import { useEffect, useState } from "react";
import DesignCard from "@/components/DesignCard";

interface Design {
    cid: string;
    title: string;
    preview: string | null;
    owner: string;
}

export default function ExplorePage() {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchDesigns() {
        try {
            const res = await fetch("/api/designs/list");
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`API error ${res.status}: ${txt}`);
            }

            // viem returns an array of log objects – safe parse
            const logs: any[] = await res.json();

            const items: Design[] = [];

            for (const log of logs) {
                const cidHash = log.args.cidHash as `0x${string}`;
                const owner = log.args.owner as string;

                // ---- Retrieve CID that was stored in localStorage during upload ----
                const cid = localStorage.getItem(cidHash);
                if (!cid) continue; // no local mapping → skip

                // ---- Pull the JSON metadata from Pinata (or any IPFS gateway) ----
                const metaRes = await fetch(`/api/ipfs/get?cid=${cid}`);
                if (!metaRes.ok) continue;
                const meta = await metaRes.json();

                items.push({
                    cid,
                    title: meta?.title ?? "Untitled",
                    preview: meta?.preview ?? null,
                    owner,
                });
            }

            setDesigns(items);
        } catch (err: any) {
            console.error("[Explore] fetch error:", err);
            setError(err.message ?? "Failed to load designs");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDesigns();
    }, []);

    return (
        <main className="gradient-bg min-h-screen flex items-center justify-center py-12 px-6 pt-20">
            <div className="w-full max-w-6xl">
            <div className="mb-10 flex flex-col items-center gap-6">
                <div className="text-center">
                <h1 className="text-4xl font-sans font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">Explore Designs</h1>
                <p className="mt-3 text-sm text-gray-700 max-w-lg mx-auto">Browse registered Figma design IP assets. Listings appear after successful Story Protocol registration and on-chain anchoring.</p>
                </div>
            </div>

            {loading && (
                <div className="text-sm text-gray-600 text-center">Loading designs…</div>
            )}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">Error: {error}</div>
            )}
            {!loading && !error && designs.length === 0 && (
                <div className="rounded-md border border-gray-200 bg-white/70 backdrop-blur p-6 text-center text-sm text-gray-600">No designs yet. Be the first to publish.</div>
            )}

            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center">
                {designs.map((d) => (
                <DesignCard key={d.cid} {...d} />
                ))}
            </div>
            </div>
        </main>
    );
}