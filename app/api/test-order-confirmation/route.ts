import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationWhatsApp } from "@/lib/notifications/whatsapp";
import { requireAdmin } from "@/lib/adminAuth";

// Local testing only — trigger the order-confirmation WhatsApp message without a real order.
// Usage: GET /api/test-order-confirmation?mobile=9999999999  (header: x-admin-token)
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const mobile = req.nextUrl.searchParams.get("mobile") || "9999999999";

  const orderId = `TEST-${Date.now()}`;

  const whatsappResult = await sendOrderConfirmationWhatsApp({
    orderId,
    customerName: "Test Customer",
    mobile,
  });

  return NextResponse.json({ orderId, sentTo: { mobile }, whatsappResult });
}
