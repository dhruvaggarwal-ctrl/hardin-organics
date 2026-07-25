import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ error: "GOOGLE_SHEET_WEBHOOK_URL not set" }, { status: 500 });
  }

  // Exact same payload structure as app/api/orders/save/route.ts
  const sheetPayload = {
    orderId: `TEST-${Date.now()}`,
    createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    customerName: "Test User",
    mobile: "9999999999",
    email: "test@example.com",
    items: "Charcoal Soap ×1, Haldi & Chandan Soap ×2 (100g)",
    subtotal: 1197,
    shipping: 0,
    couponDiscount: 120,
    total: 1077,
    paymentMethod: "razorpay",
    paymentId: `pay_TEST${Date.now()}`,
    status: "confirmed",
    addressLine1: "123 Test Street, Sector 15",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(sheetPayload),
      signal: AbortSignal.timeout(10000),
    });

    const text = await res.text();
    return NextResponse.json({
      success: res.ok,
      sheetStatus: res.status,
      sheetResponse: text,
      sentPayload: sheetPayload,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
