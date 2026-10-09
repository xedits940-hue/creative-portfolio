import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Silent ingest of telemetry events, metrics, and error traces
    if (process.env.NODE_ENV === "development") {
      // In dev mode, keep logs quiet or format cleanly
    }
    return NextResponse.json({ success: true, count: Array.isArray(body) ? body.length : 1 });
  } catch {
    // Fail silently to never disrupt client
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
