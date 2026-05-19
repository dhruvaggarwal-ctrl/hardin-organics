import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createDelhiveryShipment, buildDelhiveryPayload } from "@/lib/delhivery";
import { verifySession } from "@/lib/auth";

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

    // Attach customerId from session if the user is logged in (optional — guest checkouts are fine)
    let customerId: string | null = null;
    try {
      const session = await verifySession();
      if (session?.customerId) customerId = session.customerId;
    } catch { /* not logged in — ignore */ }

    const order = {
      orderId,
      customerId,                                      // FIX: link order to logged-in user
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
      couponCode: body.couponCode || null,             // FIX: save coupon info
      couponDiscount: body.couponDiscount || 0,        // FIX: save coupon discount
      shipping: body.shipping,
      totalAmount: body.totalAmount,
      orderType: body.orderType || "regular",
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

    // Save order to Firestore + auto-upsert customer profile
    try {
      const { db } = await import("@/lib/firebase/admin");
      const { FieldValue } = await import("firebase-admin/firestore");

      // 1. Save the order document
      await db.collection("orders").doc(order.orderId).set({
        ...order,
        createdAt: FieldValue.serverTimestamp(),
      });

      // 2. Build the profile payload from the order's shipping details
      const profileFromOrder = {
        name: order.customerName,
        mobile: order.mobile,
        ...(order.email ? { email: order.email } : {}),
        address: {
          addressLine1: order.addressLine1,
          ...(order.addressLine2 ? { addressLine2: order.addressLine2 } : {}),
          city: order.city,
          state: order.state,
          pincode: order.pincode,
        },
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (customerId) {
        // Logged-in user: fetch existing profile and only fill in empty fields
        const customerRef = db.collection("customers").doc(customerId);
        const snap = await customerRef.get();
        const existing = snap.exists ? snap.data()! : {};

        const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
        if (!existing.name)   patch.name   = profileFromOrder.name;
        if (!existing.mobile) patch.mobile = profileFromOrder.mobile;
        if (!existing.email && profileFromOrder.email) patch.email = profileFromOrder.email;
        if (!existing.address) patch.address = profileFromOrder.address;

        await customerRef.set(patch, { merge: true });
      } else {
        // Not logged in — create a real customer profile in the customers collection
        // keyed by mobile (prefixed so it's easy to find on login).
        // When they log in via OTP this doc is merged into customers/{uid} and deleted.
        const tempId = `mob_${order.mobile}`;
        await db.collection("customers").doc(tempId).set({
          ...profileFromOrder,
          tempMobileKey: order.mobile,   // flag so we can locate it on login
          createdAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (firestoreErr) {
      console.error("[orders/save] Firestore write failed (non-fatal):", firestoreErr);
    }

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
      createDelhiveryShipment(payload).then(async (dl) => {
        if (dl?.packages?.length) {
          const waybill = dl.packages[0].waybill;
          if (waybill) {
            // Write waybill back to JSON file
            const updatedOrders = readOrders() as Array<Record<string, unknown>>;
            const idx = updatedOrders.findIndex((o) => o.orderId === orderId);
            if (idx !== -1) {
              updatedOrders[idx].waybill = waybill;
              writeOrders(updatedOrders);
            }
            // FIX: Also write waybill back to Firestore so tracking works in production
            try {
              const { db } = await import("@/lib/firebase/admin");
              await db.collection("orders").doc(orderId).update({ waybill });
            } catch (e) {
              console.error("[Delhivery] Firestore waybill update failed:", e);
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
    console.log(`   WhatsApp: https://wa.me/919650595027?text=${waText}\n`);

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Order save error:", err);
    return NextResponse.json({ success: false, error: "Failed to save order" }, { status: 500 });
  }
}
