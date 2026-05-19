import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { trackShipmentByAwb } from "@/lib/shiprocket";

interface Order {
  orderId: string;
  customerName: string;
  mobile: string;
  email: string | null;
  city: string;
  status: string;
  createdAt: string;
  awbCode?: string;
  shiprocketShipmentId?: string;
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const orders = readOrders();
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Base response (no live tracking)
  const base = {
    orderId: order.orderId,
    customerName: order.customerName,
    status: order.status,
    createdAt: order.createdAt,
    city: order.city,
    items: order.items,
    totalAmount: order.totalAmount,
    awbCode: order.awbCode || null,
    shiprocketShipmentId: order.shiprocketShipmentId || null,
    tracking: null as null | object,
  };

  // If we have an AWB code, fetch live tracking from Shiprocket
  if (order.awbCode) {
    const data = await trackShipmentByAwb(order.awbCode);
    if (data?.tracking_data) {
      const td = data.tracking_data;
      const activities = (td.shipment_track_activities || []).map((a) => ({
        date: a.date,
        status: a["sr-status-label"] || a.status,
        activity: a.activity,
        location: a.location,
      }));
      const latest = td.shipment_track?.[0];
      base.tracking = {
        currentStatus: latest?.current_status || order.status,
        courierName: latest?.courier_name || null,
        origin: latest?.origin || null,
        destination: latest?.destination || null,
        deliveredDate: latest?.delivered_date || null,
        trackUrl: td.track_url || null,
        activities,
      };
    }
  }

  return NextResponse.json(base);
}
