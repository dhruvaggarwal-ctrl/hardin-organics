import { NextRequest, NextResponse } from "next/server";
import { trackByWaybill } from "@/lib/delhivery";

/**
 * Delhivery Status Sync — runs every minute via Vercel Cron
 *
 * Fetches live status for all active orders that have a waybill and
 * are not yet delivered or cancelled. Updates Firestore so the
 * dashboard status badges stay current.
 *
 * Protected by CRON_SECRET — Vercel automatically sends this header.
 */

function mapDelhiveryStatus(dlStatus: string): string | null {
  const s = (dlStatus ?? "").toLowerCase();
  if (s.includes("delivered") && !s.includes("attempted")) return "delivered";
  if (s.includes("cancel") || s.includes("rto") || s.includes("return")) return "cancelled";
  if (s.includes("transit") || s.includes("dispatch") || s.includes("pickup") || s.includes("booked")) return "shipped";
  return null;
}

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron (or our own secret for manual runs)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/firebase/admin");

    // Fetch all orders and filter in JS — avoids any Firestore index requirements
    const snap = await db.collection("orders").get();

    const active = snap.docs.filter((doc) => {
      const data = doc.data();
      const status = data.status as string;
      return (
        data.waybill &&
        status !== "delivered" &&
        status !== "cancelled" &&
        status !== "refunded"
      );
    });

    if (active.length === 0) {
      return NextResponse.json({ synced: 0, message: "No active shipments to sync" });
    }

    console.log(`[cron/sync-delhivery] Syncing ${active.length} active shipments`);

    let synced = 0;
    let failed = 0;

    // Process in batches to avoid overwhelming Delhivery API
    for (const doc of active) {
      const order = doc.data();
      const waybill = order.waybill as string;

      try {
        const trackData = await trackByWaybill(waybill);
        const shipment = trackData?.ShipmentData?.[0]?.Shipment;

        if (!shipment) {
          console.warn(`[cron] No shipment data for waybill ${waybill}`);
          continue;
        }

        const dlStatus = shipment.Status ?? "";
        const mappedStatus = mapDelhiveryStatus(dlStatus);

        // Build latest activity summary
        const latestScan = shipment.Scans?.[0]?.ScanDetail;
        const updateData: Record<string, unknown> = {
          delhiveryStatus: dlStatus,
          delhiveryLocation: latestScan?.CityLocation ?? latestScan?.ScannedLocation ?? null,
          lastTrackingUpdate: new Date().toISOString(),
        };

        if (mappedStatus && mappedStatus !== order.status) {
          updateData.status = mappedStatus;
          if (mappedStatus === "delivered") updateData.deliveredAt = shipment.DeliveryDate ?? new Date().toISOString();
          if (mappedStatus === "cancelled")  updateData.cancelledAt  = new Date().toISOString();
          console.log(`[cron] ${doc.id}: ${order.status} → ${mappedStatus}`);
        }

        await doc.ref.update(updateData);
        synced++;

        // Small delay between requests to be kind to Delhivery API
        await new Promise((r) => setTimeout(r, 200));

      } catch (err) {
        console.error(`[cron] Failed to sync ${waybill}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      synced,
      failed,
      total: active.length,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("[cron/sync-delhivery] Fatal error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
