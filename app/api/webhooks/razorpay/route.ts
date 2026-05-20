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
      const paymentEntity = payload.payment?.entity ?? {};
      const razorpayOrderId = paymentEntity.order_id as string;
      const paymentId       = paymentEntity.id as string;

      if (razorpayOrderId) {
        const snap = await db.collection("orders")
          .where("razorpayOrderId", "==", razorpayOrderId)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({ status: "paid", razorpayPaymentId: paymentId });
          console.log("[razorpay-webhook] Confirmed paid:", snap.docs[0].id);
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
