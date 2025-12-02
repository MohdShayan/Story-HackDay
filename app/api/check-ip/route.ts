import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Convert decimal IP ID → 20-byte hex padded (Story format)
function decimalToPaddedIpId(value: string | bigint): `0x${string}` {
  try {
    const n = typeof value === "bigint" ? value : BigInt(value);
    const hex = n.toString(16).padStart(40, "0");
    return `0x${hex}` as `0x${string}`;
  } catch {
    throw new Error("invalid ipId");
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  // HARDCODED test IP ID (decimal from RemixHub)
  const rawDecimal = "171789582852593520143128479090471009913603876960";

  let ipIdHex: `0x${string}`;
  try {
    ipIdHex = decimalToPaddedIpId(rawDecimal);
  } catch {
    return NextResponse.json(
      { exists: false, error: "invalid ipId" },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    // Hit Story REST API (staging endpoint)
    const res = await fetch("https://staging-api.storyprotocol.net/api/v4/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "KOTbaGUSWQ6cUJWhiJYiOjPgB0kTRu1eCFFvQL0IWls", // your key
      },
      body: JSON.stringify({
        where: { ipIds: [ipIdHex] },
      }),
    });

    const json = await res.json();

    // If API returns something inside `data`
    if (json.data && json.data.length > 0) {
      return NextResponse.json(
        { exists: true, ipId: ipIdHex, data: json.data[0] },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // Not found
    return NextResponse.json(
      { exists: false, ipId: ipIdHex, error: "not found" },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { exists: false, ipId: ipIdHex, error: e.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
