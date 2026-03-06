import { NextResponse } from "next/server";

/**
 * Legacy route. Payment and order creation are handled via tRPC:
 * - Order creation: order.create (from cart + address)
 * - Razorpay order: payment.createIntent then payment.confirm
 * Use POST /api/v1 with tRPC procedures instead.
 */
export async function GET() {
  return NextResponse.json({ error: "Use tRPC order and payment procedures" }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: "Use tRPC order and payment procedures" }, { status: 410 });
}
