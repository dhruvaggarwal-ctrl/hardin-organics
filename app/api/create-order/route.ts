import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyAndPriceOrder, OrderItemInput } from "@/lib/pricing";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { items, couponCode, orderType, currency = "INR", receipt, notes } = await req.json() as {
      items: OrderItemInput[];
      couponCode?: string | null;
      orderType?: string;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
    };

    // Recompute the amount from catalog prices — never trust a client-supplied total.
    const pricing = verifyAndPriceOrder(items, couponCode, orderType);
    if (!pricing.valid || pricing.total < 1) {
      return NextResponse.json({ error: pricing.error || "Invalid order" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(pricing.total * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      // Store customer + address details so webhook can recover if browser dies
      notes: notes ?? {},
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
