import { NextRequest, NextResponse } from "next/server";
import { createDelhiveryShipment, buildDelhiveryPayload } from "@/lib/delhivery";
import { verifySession } from "@/lib/auth";
import { sendOrderConfirmationWhatsApp } from "@/lib/notifications/whatsapp";
import { verifyAndPriceOrder } from "@/lib/pricing";

function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = Math.floor(1000 + Math.random() * 9000);         // 4 random digits
  return `HO-${date}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Idempotency: prevent duplicate orders from network retries ──────────
    if (body.razorpayPaymentId) {
      const { db: dbCheck } = await import("@/lib/firebase/admin");
      const existing = await dbCheck.collection("orders")
        .where("razorpayPaymentId", "==", body.razorpayPaymentId)
        .limit(1)
        .get();
      if (!existing.empty) {
        console.log("[orders/save] Duplicate paymentId — returning existing order:", existing.docs[0].id);
        return NextResponse.json({ success: true, orderId: existing.docs[0].id });
      }
    }

    const orderId = generateOrderId();

    // Attach customerId from session if the user is logged in (optional — guest checkouts are fine)
    let customerId: string | null = null;
    try {
      const session = await verifySession();
      if (session?.customerId) customerId = session.customerId;
    } catch { /* not logged in — ignore */ }

    // Recompute pricing from catalog data server-side — never trust the client's
    // subtotal/discount/couponDiscount/totalAmount for anything that determines
    // what gets charged, shipped, or collected as COD.
    const orderType = body.orderType || "regular";
    const pricing = verifyAndPriceOrder(body.items, body.couponCode, orderType);
    if (!pricing.valid) {
      return NextResponse.json({ success: false, error: pricing.error || "Invalid order" }, { status: 400 });
    }

    // For prepaid orders, cross-check the recomputed total against what Razorpay
    // actually captured — the ground truth for what the customer was charged.
    if (body.razorpayPaymentId) {
      try {
        const keyId = process.env.RAZORPAY_KEY_ID!;
        const keySecret = process.env.RAZORPAY_KEY_SECRET!;
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${body.razorpayPaymentId}`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (paymentRes.ok) {
          const payment = await paymentRes.json();
          const paidAmount = Number(payment.amount) / 100;
          if (Math.abs(paidAmount - pricing.total) > 1) {
            console.error(
              `[orders/save] Amount mismatch — computed ₹${pricing.total}, Razorpay charged ₹${paidAmount} (payment ${body.razorpayPaymentId})`
            );
            return NextResponse.json({ success: false, error: "Payment amount mismatch — contact support." }, { status: 400 });
          }
        }
      } catch (e) {
        console.error("[orders/save] Could not verify Razorpay payment amount:", e);
      }
    }

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
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      couponCode: pricing.couponCode,
      couponDiscount: pricing.couponDiscount,
      shipping: pricing.shipping,
      totalAmount: pricing.total,                      // server-computed — ignores client-sent value
      orderType,
      paymentMethod: body.paymentMethod,
      razorpayOrderId: body.razorpayOrderId || null,
      razorpayPaymentId: body.razorpayPaymentId || null,
      status: body.status || "pending",
      createdAt: new Date().toISOString(),
    };

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
        totalAmount: order.totalAmount,
        paymentMethod: body.paymentMethod,
      });

      // Mark shipment as pending so we can detect failures
      try {
        const { db: db2 } = await import("@/lib/firebase/admin");
        await db2.collection("orders").doc(orderId).update({ delhiveryPending: true });
      } catch { /* non-fatal */ }

      createDelhiveryShipment(payload).then(async (dl) => {
        const waybill = dl?.packages?.[0]?.waybill ?? null;
        const remarks = dl?.packages?.[0]?.remarks ?? [];

        try {
          const { db } = await import("@/lib/firebase/admin");

          if (waybill) {
            // Success — save waybill and clear pending flag
            await db.collection("orders").doc(orderId).update({
              waybill,
              delhiveryPending: false,
              delhiveryCreatedAt: new Date().toISOString(),
            });
            console.log(`[Delhivery] ✅ Shipment created: waybill=${waybill}`);
          } else {
            // Failure — store error so it's visible in Firestore
            const errorMsg = remarks.join(", ") || dl?.rmk || "No waybill returned";
            await db.collection("orders").doc(orderId).update({
              delhiveryPending: false,
              delhiveryError: errorMsg,
              delhiveryFailedAt: new Date().toISOString(),
            });
            console.error(`[Delhivery] ❌ Shipment creation failed for ${orderId}:`, errorMsg);
          }
        } catch (e) {
          console.error("[Delhivery] Firestore update failed:", e);
        }
      }).catch(async (e) => {
        console.error("[Delhivery] createShipment exception:", e);
        try {
          const { db } = await import("@/lib/firebase/admin");
          await db.collection("orders").doc(orderId).update({
            delhiveryPending: false,
            delhiveryError: String(e),
            delhiveryFailedAt: new Date().toISOString(),
          });
        } catch { /* non-fatal */ }
      });
    }

    // ── Google Sheets backup log (fire-and-forget) ──────────────────────────
    const itemSummary = (body.items as Array<{ name: string; quantity: number; size?: string }>)
      .map((i) => `${i.name} ×${i.quantity}${i.size ? ` (${i.size})` : ""}`)
      .join(", ");

    if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      const sheetPayload = {
        orderId,
        createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        customerName: order.customerName,
        mobile: order.mobile,
        email: order.email || "",
        items: itemSummary,
        subtotal: order.subtotal,
        shipping: order.shipping,
        couponDiscount: order.couponDiscount || 0,
        total: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentId: order.razorpayPaymentId || "COD",
        status: order.status,
        addressLine1: order.addressLine1,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
      };

      // Must be awaited — Vercel kills fire-and-forget fetches when the function returns
      try {
        const sheetRes = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" }, // Apps Script reads e.postData.contents regardless
          body: JSON.stringify(sheetPayload),
          signal: AbortSignal.timeout(10000),
        });
        console.log("[Google Sheets] Log status:", sheetRes.status);
      } catch (e) {
        console.warn("[Google Sheets] Log failed (non-fatal):", e);
      }
    }

    // ── Customer-facing order confirmation (WhatsApp) ───────────────────────
    // Must be awaited — Vercel kills fire-and-forget work when the function returns.
    // Internally no-ops (log + skip) if WhatsApp env vars aren't configured.
    const whatsappResult = await sendOrderConfirmationWhatsApp({
      orderId,
      customerName: order.customerName,
      mobile: order.mobile,
    });
    console.log(`[order-confirmation] whatsapp=${whatsappResult.sent}${whatsappResult.error ? ` (${whatsappResult.error})` : ""}`);

    // Log WhatsApp notification
    const waText = encodeURIComponent(
      `🛍️ New Order: ${orderId}\n` +
      `👤 ${body.customerName} | 📱 ${body.mobile}\n` +
      `📦 ${itemSummary}\n` +
      `💰 ₹${order.totalAmount} (${body.paymentMethod})\n` +
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
