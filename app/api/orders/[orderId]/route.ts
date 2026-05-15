import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getOrdersFilePath(): string {
  if (process.env.NODE_ENV === "production") return "/tmp/orders.json";
  return path.join(process.cwd(), "data", "orders.json");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const filePath = getOrdersFilePath();

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const orders = JSON.parse(raw) as Array<{ orderId: string }>;
    const order = orders.find((o) => o.orderId === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
