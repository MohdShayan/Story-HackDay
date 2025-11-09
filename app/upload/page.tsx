"use client";

import React, { useState } from "react";
import { useRemixHub } from "@/hooks/useRemixHub"; // we built this earlier

export default function UploadDesignPage() {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerOriginal, isPending, txReceipt } = useRemixHub();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("📦 Uploading metadata to IPFS...");

      // --- 1️⃣ Upload to IPFS ---
      const formData = new FormData();
      formData.append("title", title);
      formData.append("figmaUrl", figmaUrl);
      if (file) formData.append("file", file);
      formData.append("previewUrl", previewUrl);

      const uploadRes = await fetch("/api/ipfs/upload", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();
      const cid = uploadData.cid;

      console.log("✅ IPFS CID:", cid);

      // --- 2️⃣ Register on Story ---
      console.log("🧾 Registering with Story Protocol...");
      const storyRes = await fetch("/api/story/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cid, title }),
      });

      const storyData = await storyRes.json();
      if (!storyData.success) throw new Error("Story registration failed");

      const cidHash = storyData.cidHash as `0x${string}`;

      console.log("✅ Story registered | CID Hash:", cidHash);

      // --- 3️⃣ Call RemixHub → registerOriginal ---
      console.log("⚙️ Calling RemixHub.registerOriginal...");
      const ipId = BigInt(0);        // placeholder, SDK gives later
      const presetId = 1;            // default
      registerOriginal(ipId, cidHash, presetId);

      alert("✅ Design registered successfully on IPFS + Story + RemixHub!");
    } catch (err: any) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Figma Design</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full"
          placeholder="Design Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Public Figma File URL"
          value={figmaUrl}
          onChange={(e) => setFigmaUrl(e.target.value)}
        />

        <p className="text-center text-gray-500">or upload .fig file</p>

        <input
          type="file"
          accept=".fig"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Preview Image URL (optional)"
          value={previewUrl}
          onChange={(e) => setPreviewUrl(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          type="submit"
          disabled={loading || isPending}
        >
          {loading || isPending ? "Processing..." : "Upload & Register"}
        </button>

        {txReceipt && (
          <p className="text-green-600 text-sm mt-2">
            ✅ On-chain registered: {JSON.stringify(txReceipt.data)}
          </p>
        )}
      </form>
    </div>
  );
}
