import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Razorpay Webhook Handler
 *
 * Setup in Razorpay Dashboard → Settings → Webhooks:
 *   URL: https://hardinorganics.com/api/webhooks/razorpay
 *   Secret: set RAZORPAY_WEBHOOK_SECRET in Vercel env vars
 *   Events: payment.captured, payment.failed, refund.created, refund.processed
 */

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // Verify the webhook came from Razorpay
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const expectedSig = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (signature !== expectedSig) {
    console.warn("[razorpay-webhook] Invalid signature — ignoring");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; payload: Record<string, { entity: Record<string, unknown> }> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event: eventType, payload } = event;
  console.log("[razorpay-webhook] Event:", eventType);

  try {
    const { db } = await import("@/lib/firebase/admin");

    // ── Refund created / processed ────────────────────────────────────────────
    if (eventType === "refund.created" || eventType === "refund.processed") {
      const refundEntity = payload.refund?.entity ?? {};
      const paymentId = refundEntity.payment_id as string;
      const refundId  = refundEntity.id as string;
      const amountPaise = refundEntity.amount as number;   // Razorpay amounts are in paise

      if (paymentId) {
        const snap = await db.collection("orders")
          .where("razorpayPaymentId", "==", paymentId)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({
            status: "refunded",
            refundId,
            refundAmount: amountPaise ? amountPaise / 100 : null,
            refundedAt: new Date().toISOString(),
          });
          console.log("[razorpay-webhook] Marked refunded:", snap.docs[0].id, "refund:", refundId);
        } else {
          console.warn("[razorpay-webhook] No order found for paymentId:", paymentId);
        }
      }
    }

    // ── Payment captured ─────────────────────────────────────────────────────
    if (eventType === "payment.captured") {
      const paymentEntity   = payload.payment?.entity ?? {};
      const razorpayOrderId = paymentEntity.order_id as string;
      const paymentId       = paymentEntity.id as string;
      const amountPaise     = paymentEntity.amount as number;
      const contact         = paymentEntity.contact as string;
      const email           = paymentEntity.email as string | null;

      // Idempotency: skip if already saved
      const dupCheck = await db.collection("orders")
        .where("razorpayPaymentId", "==", paymentId)
        .limit(1).get();
      if (!dupCheck.empty) {
        console.log("[razorpay-webhook] Already saved, skipping:", paymentId);
        return NextResponse.json({ received: true });
      }

      if (razorpayOrderId) {
        const snap = await db.collection("orders")
          .where("razorpayOrderId", "==", razorpayOrderId)
          .limit(1)
          .get();

        if (!snap.empty) {
          // Order exists — just mark it paid
          await snap.docs[0].ref.update({ status: "confirmed", razorpayPaymentId: paymentId });
          console.log("[razorpay-webhook] Confirmed paid:", snap.docs[0].id);
        } else {
          // ── ORPHAN RECOVERY: order was never saved (customer closed tab) ──
          console.warn("[razorpay-webhook] Orphan payment — fetching from Razorpay:", paymentId);

          try {
            const keyId     = process.env.RAZORPAY_KEY_ID!;
            const keySecret = process.env.RAZORPAY_KEY_SECRET!;
            const auth      = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
            const rzpHeaders = { Authorization: `Basic ${auth}` };

            // Fetch the Razorpay order to get customer notes
            const rzpOrderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}`, { headers: rzpHeaders });
            const rzpOrder    = rzpOrderRes.ok ? await rzpOrderRes.json() : null;
            const notes       = rzpOrder?.notes ?? {};

            // Generate order ID
            const now    = new Date();
            const date   = now.toISOString().slice(0, 10).replace(/-/g, "");
            const random = Math.floor(1000 + Math.random() * 9000);
            const orderId = `HO-${date}-${random}`;

            const recoveredOrder = {
              orderId,
              customerName:     notes.customerName   ?? "Unknown",
              mobile:           notes.mobile         ?? contact?.replace("+91", "") ?? "",
              email:            notes.email          ?? email ?? null,
              addressLine1:     notes.addressLine1   ?? "",
              addressLine2:     notes.addressLine2   ?? null,
              city:             notes.city           ?? "",
              state:            notes.state          ?? "",
              pincode:          notes.pincode        ?? "",
              items:            notes.items          ? JSON.parse(notes.items) : [],
              subtotal:         notes.subtotal       ? Number(notes.subtotal)  : amountPaise / 100,
              discount:         notes.discount       ? Number(notes.discount)  : 0,
              couponCode:       notes.couponCode     ?? null,
              couponDiscount:   notes.couponDiscount ? Number(notes.couponDiscount) : 0,
              shipping:         notes.shipping       ? Number(notes.shipping)  : 0,
              totalAmount:      amountPaise / 100,
              orderType:        notes.orderType      ?? "regular",
              paymentMethod:    "razorpay",
              razorpayOrderId,
              razorpayPaymentId: paymentId,
              status:           "confirmed",
              recoveredViaWebhook: true,
              createdAt:        now.toISOString(),
            };

            const { FieldValue } = await import("firebase-admin/firestore");
            await db.collection("orders").doc(orderId).set({
              ...recoveredOrder,
              createdAt: FieldValue.serverTimestamp(),
            });
            console.log("[razorpay-webhook] Orphan order recovered:", orderId);

            // Log to Google Sheet
            if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
              const itemSummary = Array.isArray(recoveredOrder.items)
                ? recoveredOrder.items.map((i: { name: string; quantity: number; size?: string }) =>
                    `${i.name} ×${i.quantity}${i.size ? ` (${i.size})` : ""}`).join(", ")
                : String(recoveredOrder.items);

              await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({
                  orderId,
                  createdAt: now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                  customerName: recoveredOrder.customerName,
                  mobile: recoveredOrder.mobile,
                  email: recoveredOrder.email ?? "",
                  items: itemSummary,
                  subtotal: recoveredOrder.subtotal,
                  shipping: recoveredOrder.shipping,
                  couponDiscount: recoveredOrder.couponDiscount,
                  total: recoveredOrder.totalAmount,
                  paymentMethod: "razorpay",
                  paymentId,
                  status: "confirmed (webhook recovered)",
                  addressLine1: recoveredOrder.addressLine1,
                  city: recoveredOrder.city,
                  state: recoveredOrder.state,
                  pincode: recoveredOrder.pincode,
                }),
                signal: AbortSignal.timeout(10000),
              }).catch((e) => console.warn("[razorpay-webhook] Sheet log failed:", e));
            }

            // Create Delhivery shipment if address is available
            if (recoveredOrder.addressLine1 && recoveredOrder.pincode && process.env.DELHIVERY_API_TOKEN) {
              const { createDelhiveryShipment, buildDelhiveryPayload } = await import("@/lib/delhivery");
              const dlPayload = buildDelhiveryPayload({
                orderId,
                customerName: recoveredOrder.customerName,
                mobile: recoveredOrder.mobile,
                email: recoveredOrder.email ?? null,
                addressLine1: recoveredOrder.addressLine1,
                addressLine2: recoveredOrder.addressLine2 ?? "",
                city: recoveredOrder.city,
                state: recoveredOrder.state,
                pincode: recoveredOrder.pincode,
                items: recoveredOrder.items,
                totalAmount: recoveredOrder.totalAmount,
                paymentMethod: "razorpay",
              });
              createDelhiveryShipment(dlPayload)
                .then(async (dl) => {
                  const waybill = dl?.packages?.[0]?.waybill ?? null;
                  if (waybill) {
                    await db.collection("orders").doc(orderId).update({ waybill, delhiveryCreatedAt: new Date().toISOString() });
                    console.log("[razorpay-webhook] Delhivery shipment created:", waybill);
                  } else {
                    await db.collection("orders").doc(orderId).update({ delhiveryError: dl?.rmk ?? "No waybill" });
                  }
                })
                .catch((e) => console.error("[razorpay-webhook] Delhivery error:", e));
            }
          } catch (recoveryErr) {
            console.error("[razorpay-webhook] Orphan recovery failed:", recoveryErr);
          }
        }
      }
    }

    // ── Payment failed ───────────────────────────────────────────────────────
    if (eventType === "payment.failed") {
      const paymentEntity = payload.payment?.entity ?? {};
      const razorpayOrderId = paymentEntity.order_id as string;
      const errorDesc       = paymentEntity.error_description as string;
      const errorCode       = paymentEntity.error_code as string;

      if (razorpayOrderId) {
        const snap = await db.collection("orders")
          .where("razorpayOrderId", "==", razorpayOrderId)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({
            status: "payment_failed",
            paymentError: errorDesc ?? errorCode ?? "Unknown error",
          });
          console.log("[razorpay-webhook] Marked payment_failed:", snap.docs[0].id);
        }
      }
    }

  } catch (err) {
    console.error("[razorpay-webhook] Firestore error:", err);
    // Still return 200 so Razorpay doesn't keep retrying for transient DB errors
  }

  return NextResponse.json({ received: true });
}
