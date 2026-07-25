import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const paymentId = req.nextUrl.searchParams.get("paymentId")?.trim();

  if (!paymentId) {
    return NextResponse.json({ error: "paymentId query param required" }, { status: 400 });
  }

  try {
    const { db } = await import("@/lib/firebase/admin");

    // Search by razorpayPaymentId
    const snap = await db.collection("orders")
      .where("razorpayPaymentId", "==", paymentId)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({
        found: false,
        message: "No order found in Firestore with this payment ID. The order was likely never saved — payment went through but /api/orders/save was not called or failed.",
        paymentId,
      });
    }

    const order = snap.docs[0].data();
    return NextResponse.json({
      found: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        mobile: order.mobile,
        email: order.email,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
        waybill: order.waybill || null,
        delhiveryPending: order.delhiveryPending || false,
        delhiveryError: order.delhiveryError || null,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
