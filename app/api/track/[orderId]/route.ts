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

  // Fetch live tracking from Delhivery if we have a waybill
  if (order.waybill) {
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
  }

  return NextResponse.json(base);
}
