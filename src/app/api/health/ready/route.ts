import { NextResponse } from "next/server";
import { db } from "@/core/db/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Readiness: verifies database connectivity. Short cache reduces stampedes from aggressive LB polling. */
export async function GET() {
  try {
    await db.query.order.findFirst({ columns: { id: true } });
    return NextResponse.json(
      { ok: true, ready: true },
      {
        status: 200,
        headers: { "Cache-Control": "private, max-age=5" },
      },
    );
  } catch {
    return NextResponse.json({ ok: false, ready: false }, { status: 503 });
  }
}
