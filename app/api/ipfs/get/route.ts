import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cid = searchParams.get("cid");

    if (!cid) {
      return NextResponse.json({ error: "CID required" }, { status: 400 });
    }

    const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud/ipfs/";
    const res = await fetch(`${gateway}${cid}`);

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    console.error("❌ IPFS fetch:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
