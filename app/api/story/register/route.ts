import { NextResponse } from "next/server";
import { registerIpOnStory } from "@/lib/story";

export async function POST(req: Request) {
  try {
    const { cid } = await req.json();
    if (!cid) throw new Error("CID required");

    const { tx, contentHash } = await registerIpOnStory(cid);

    return NextResponse.json({
      success: true,
      tx,
      cidHash: contentHash
    });
  } catch (err: any) {
    console.error("Story error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
