"use client";

import { useEffect, useState } from "react";
import DesignCard from "@/components/DesignCard";

export default function ExplorePage() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDesigns() {
    try {
      const logs = await fetch("/api/designs/list").then(r => r.json());

      // Extract CID hash → but we don't have CID stored on-chain
      // We stored CID in upload flow → we'll fetch metadata from Pinata JSON store later
      const items: any[] = [];

      for (const log of logs) {
        const cidHash = log.args.cidHash;
        const owner = log.args.owner;

        // For demo: we temporarily store metadata under localStorage per upload.
        // Real index = DB or Story indexer
        const cid = localStorage.getItem(cidHash);

        if (!cid) continue;

        const meta = await fetch(`/api/ipfs/get?cid=${cid}`).then(r => r.json());

        items.push({
          cid,
          title: meta?.title || "Untitled",
          preview: meta?.preview || null,
          owner
        });
      }

      setDesigns(items);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => { fetchDesigns(); }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-6">Explore Designs</h1>

      {loading && <p>Loading...</p>}

      {!loading && designs.length === 0 && (
        <p className="text-gray-500">No designs yet. Be the first!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {designs.map((d, i) => (
          <DesignCard key={i} {...d} />
        ))}
      </div>
    </div>
  );
}
