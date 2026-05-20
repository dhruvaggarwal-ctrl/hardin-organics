import { NextRequest, NextResponse } from "next/server";

/**
 * Delhivery Webhook Handler
 *
 * Setup in Delhivery Panel → Settings → Webhooks:
 *   URL: https://hardinorganics.com/api/webhooks/delhivery
 *   (Delhivery sends a POST with JSON body on each status change)
 *
 * Status mapping:
 *   Delhivery "Delivered"             → our "delivered"
 *   Delhivery "Cancelled" / "RTO"     → our "cancelled"
 *   Delhivery "In Transit" / "Booked" → our "shipped"
 */

function mapDelhiveryStatus(dlStatus: string): string | null {
  const s = (dlStatus ?? "").toLowerCase();
  if (s.includes("delivered") && !s.includes("attempted")) return "delivered";
  if (s.includes("cancel") || s.includes("rto") || s.includes("return")) return "cancelled";
  if (s.includes("transit") || s.includes("dispatch") || s.includes("pickup") || s.includes("booked")) return "shipped";
  return null; // don't overwrite status for unknown events
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Delhivery sends either { waybill, status, ... } or { AWBNo, Status, ... }
  const waybill = (body.waybill ?? body.AWBNo ?? body.awb) as string | undefined;
  const dlStatus = (body.status ?? body.Status ?? body.current_status) as string | undefined;
  const location = (body.location ?? body.Location ?? body.city) as string | undefined;

  console.log("[delhivery-webhook] Received:", { waybill, dlStatus, location });

  if (!waybill) {
    console.warn("[delhivery-webhook] No waybill in payload — ignoring");
    return NextResponse.json({ received: true });
  }

  try {
    const { db } = await import("@/lib/firebase/admin");

    const snap = await db.collection("orders")
      .where("waybill", "==", waybill)
      .limit(1)
      .get();

    if (snap.empty) {
      console.warn("[delhivery-webhook] No order found for waybill:", waybill);
      return NextResponse.json({ received: true });
    }

    const updateData: Record<string, unknown> = {
      delhiveryStatus: dlStatus ?? null,
      delhiveryLocation: location ?? null,
      lastTrackingUpdate: new Date().toISOString(),
    };

    // Map to our canonical status if the event is meaningful
    const mappedStatus = dlStatus ? mapDelhiveryStatus(dlStatus) : null;
    if (mappedStatus) {
      updateData.status = mappedStatus;
      if (mappedStatus === "delivered") updateData.deliveredAt = new Date().toISOString();
      if (mappedStatus === "cancelled")  updateData.cancelledAt  = new Date().toISOString();
    }

    await snap.docs[0].ref.update(updateData);
    console.log("[delhivery-webhook] Updated order:", snap.docs[0].id, "→", mappedStatus ?? "tracking only");

  } catch (err) {
    console.error("[delhivery-webhook] Firestore error:", err);
  }

  return NextResponse.json({ received: true });
}
