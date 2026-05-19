import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createDelhiveryShipment, buildDelhiveryPayload } from "@/lib/delhivery";

// NOTE: Orders are saved to a local JSON file for development / MVP purposes.
// On Vercel, /tmp is used but is ephemeral and resets on each deployment.
// For production, replace this with Supabase, MongoDB, or a similar persistent database.

function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = Math.floor(1000 + Math.random() * 9000);         // 4 random digits
  return `HO-${date}-${random}`;
}

function getOrdersFilePath(): string {
  if (process.env.NODE_ENV === "production") {
    // /tmp is writable on Vercel but ephemeral — data resets on redeployment
    return "/tmp/orders.json";
  }
  return path.join(process.cwd(), "data", "orders.json");
}

function readOrders(): unknown[] {
  const filePath = getOrdersFilePath();
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeOrders(orders: unknown[]): void {
  const filePath = getOrdersFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = generateOrderId();

    const order = {
      orderId,
      customerName: body.customerName,
      mobile: body.mobile,
      email: body.email || null,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2 || null,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      items: body.items,
      subtotal: body.subtotal,
      discount: body.discount,
      shipping: body.shipping,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod,
      razorpayOrderId: body.razorpayOrderId || null,
      razorpayPaymentId: body.razorpayPaymentId || null,
      status: body.status || "pending",
      createdAt: new Date().toISOString(),
    };

    // Save to file
    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);

    // Create Delhivery shipment (fire-and-forget — don't block the response)
    if (process.env.DELHIVERY_API_TOKEN) {
      const payload = buildDelhiveryPayload({
        orderId,
        customerName: body.customerName,
        mobile: body.mobile,
        email: body.email || null,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        items: body.items,
        totalAmount: body.totalAmount,
        paymentMethod: body.paymentMethod,
      });
      createDelhiveryShipment(payload).then((dl) => {
        if (dl?.packages?.length) {
          const waybill = dl.packages[0].waybill;
          if (waybill) {
            const updatedOrders = readOrders() as Array<Record<string, unknown>>;
            const idx = updatedOrders.findIndex((o) => o.orderId === orderId);
            if (idx !== -1) {
              updatedOrders[idx].waybill = waybill;
              writeOrders(updatedOrders);
            }
            console.log(`[Delhivery] Shipment created: waybill=${waybill}`);
          }
        }
      }).catch((e) => console.error("[Delhivery] background error:", e));
    }

    // Log WhatsApp notification (replace with WhatsApp Business API for production)
    const itemSummary = (body.items as Array<{ name: string; quantity: number }>)
      .map((i) => `${i.name} ×${i.quantity}`)
      .join(", ");

    const waText = encodeURIComponent(
      `🛍️ New Order: ${orderId}\n` +
      `👤 ${body.customerName} | 📱 ${body.mobile}\n` +
      `📦 ${itemSummary}\n` +
      `💰 ₹${body.totalAmount} (${body.paymentMethod})\n` +
      `📍 ${body.addressLine1}, ${body.city}, ${body.state} - ${body.pincode}`
    );
    console.log(`\n📲 New Order Alert! ${orderId}`);
    console.log(`   WhatsApp: https://wa.me/919871900959?text=${waText}\n`);

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Order save error:", err);
    return NextResponse.json({ success: false, error: "Failed to save order" }, { status: 500 });
  }
}
