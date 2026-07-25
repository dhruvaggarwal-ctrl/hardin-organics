import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

interface RecoveryPayload {
  paymentId: string;
  razorpayOrderId?: string;
  customerName: string;
  mobile: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  subtotal: number;
  discount?: number;
  shipping?: number;
  totalAmount: number;
  orderType?: string;
  paymentMethod?: string;
}

const REQUIRED_FIELDS: Array<keyof RecoveryPayload> = [
  "paymentId", "customerName", "mobile", "addressLine1", "city", "state", "pincode",
  "items", "subtotal", "totalAmount",
];

/**
 * Manual order recovery for payments that succeeded but never got saved
 * (customer closed the tab before /api/orders/save ran).
 * Usage: POST /api/admin/recover-order  (header: x-admin-token)
 * Body: RecoveryPayload above — supply the customer/order details you
 * confirmed manually (e.g. via WhatsApp) rather than hardcoding them here.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json() as Partial<RecoveryPayload>;
  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === null || body[f] === "");
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }
  const data = body as RecoveryPayload;

  const { db } = await import("@/lib/firebase/admin");
  const { FieldValue } = await import("firebase-admin/firestore");

  // Idempotency check
  const dup = await db.collection("orders").where("razorpayPaymentId", "==", data.paymentId).limit(1).get();
  if (!dup.empty) {
    return NextResponse.json({ alreadyExists: true, orderId: dup.docs[0].id });
  }

  // Generate order ID
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  const orderId = `HO-${date}-${random}`;

  const order = {
    orderId,
    customerName: data.customerName,
    mobile: data.mobile,
    email: data.email || null,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 || "",
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    items: data.items,
    subtotal: data.subtotal,
    discount: data.discount || 0,
    shipping: data.shipping || 0,
    totalAmount: data.totalAmount,
    orderType: data.orderType || "regular",
    paymentMethod: data.paymentMethod || "razorpay",
    razorpayPaymentId: data.paymentId,
    razorpayOrderId: data.razorpayOrderId || null,
  };

  // Save to Firestore
  await db.collection("orders").doc(orderId).set({
    ...order,
    status: "confirmed",
    recoveredManually: true,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Log to Google Sheet
  if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
    const itemSummary = order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ");
    await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        orderId,
        createdAt: now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        customerName: order.customerName,
        mobile: order.mobile,
        email: order.email,
        items: itemSummary,
        subtotal: order.subtotal,
        shipping: order.shipping,
        couponDiscount: 0,
        total: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentId: data.paymentId,
        status: "confirmed (manually recovered)",
        addressLine1: order.addressLine1,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
      }),
      signal: AbortSignal.timeout(10000),
    }).catch((e) => console.warn("[recover-order] Sheet log failed:", e));
  }

  // Push to Delhivery
  let delhiveryResult = null;
  if (process.env.DELHIVERY_API_TOKEN) {
    const { createDelhiveryShipment, buildDelhiveryPayload } = await import("@/lib/delhivery");
    const dlPayload = buildDelhiveryPayload({
      orderId,
      customerName: order.customerName,
      mobile: order.mobile,
      email: order.email,
      addressLine1: order.addressLine1,
      addressLine2: order.addressLine2,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
    });

    try {
      const dl = await createDelhiveryShipment(dlPayload);
      const waybill = dl?.packages?.[0]?.waybill ?? null;
      const remarks = dl?.packages?.[0]?.remarks ?? [];

      if (waybill) {
        await db.collection("orders").doc(orderId).update({ waybill, delhiveryCreatedAt: now.toISOString() });
        delhiveryResult = { success: true, waybill };
      } else {
        const error = remarks.join(", ") || dl?.rmk || "No waybill returned";
        await db.collection("orders").doc(orderId).update({ delhiveryError: error });
        delhiveryResult = { success: false, error };
      }
    } catch (e) {
      delhiveryResult = { success: false, error: String(e) };
    }
  }

  return NextResponse.json({ success: true, orderId, delhiveryResult });
}
