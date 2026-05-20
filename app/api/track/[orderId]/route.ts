import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { trackByWaybill } from "@/lib/delhivery";

interface Order {
  orderId: string;
  customerName: string;
  mobile: string;
  email: string | null;
  city: string;
  status: string;
  createdAt: string;
  waybill?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

function getOrdersPath() {
  return process.env.NODE_ENV === "production"
    ? "/tmp/orders.json"
    : path.join(process.cwd(), "data", "orders.json");
}

function readOrders(): Order[] {
  const p = getOrdersPath();
  try {
    if (!existsSync(p)) return [];
    return JSON.parse(readFileSync(p, "utf-8"));
  } catch {
    return [];
  }
}

const TERMINAL_STATUSES = ["cancelled", "refunded", "payment_failed"];

async function buildTrackingResponse(order: Order) {
  const base = {
    orderId: order.orderId,
    customerName: order.customerName,
    status: order.status,
    createdAt: order.createdAt,
    city: order.city,
    items: order.items,
    totalAmount: order.totalAmount,
    waybill: order.waybill || null,
    tracking: null as null | object,
  };

  // Skip live Delhivery lookup for terminal statuses — the shipment is
  // already cancelled/closed on their end and the API may return errors.
  const isTerminal = TERMINAL_STATUSES.includes((order.status || "").toLowerCase());

  if (order.waybill && !isTerminal) {
    try {
      const data = await trackByWaybill(order.waybill);
      const shipment = data?.ShipmentData?.[0]?.Shipment;
      if (shipment) {
        const activities = (shipment.Scans || []).map((s) => ({
          date: s.ScanDetail.StatusDateTime || s.ScanDetail.ScanDateTime,
          status: s.ScanDetail.ScanType,
          activity: s.ScanDetail.Instructions || s.ScanDetail.Scan,
          location: s.ScanDetail.CityLocation || s.ScanDetail.ScannedLocation,
        }));

        base.tracking = {
          currentStatus: shipment.Status,
          statusType: shipment.StatusType,
          origin: shipment.Origin,
          destination: shipment.Destination,
          pickupDate: shipment.PickUpDate,
          deliveredDate: shipment.DeliveryDate,
          scheduledDeliveryDate: shipment.ScheduledDeliveryDate,
          activities,
        };
      }
    } catch (err) {
      // Delhivery API errors (e.g. cancelled waybill) should not crash the page
      console.warn("[track] Delhivery API error for waybill", order.waybill, err);
    }
  }

  return NextResponse.json(base);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  // Try Firestore — search by orderId first, then by waybill (AWB number)
  try {
    const { db } = await import("@/lib/firebase/admin");

    function normalizeOrder(raw: Record<string, unknown>): Order {
      return {
        ...raw,
        createdAt:
          raw.createdAt && typeof (raw.createdAt as { toDate?: () => Date }).toDate === "function"
            ? (raw.createdAt as { toDate: () => Date }).toDate().toISOString()
            : (raw.createdAt as string) ?? new Date().toISOString(),
      } as Order;
    }

    // 1. Try direct lookup by HO order ID
    const docSnap = await db.collection("orders").doc(orderId).get();
    if (docSnap.exists) {
      return buildTrackingResponse(normalizeOrder(docSnap.data()!));
    }

    // 2. Try lookup by Delhivery AWB / waybill number
    const waybillSnap = await db.collection("orders")
      .where("waybill", "==", orderId)
      .limit(1)
      .get();
    if (!waybillSnap.empty) {
      return buildTrackingResponse(normalizeOrder(waybillSnap.docs[0].data()!));
    }

  } catch (firestoreErr) {
    console.error("[track] Firestore read failed, falling back to JSON:", firestoreErr);
  }

  // Fall back to local JSON (dev / ephemeral fallback)
  const orders = readOrders();
  const order = orders.find((o) => o.orderId === orderId || o.waybill === orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return buildTrackingResponse(order);
}
