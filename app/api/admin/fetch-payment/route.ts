import { NextRequest, NextResponse } from "next/server";

// Fetches full payment + order details directly from Razorpay API
// Usage: /api/admin/fetch-payment?paymentId=pay_xxx
export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("paymentId")?.trim();
  if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

  const keyId     = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  const auth      = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const headers   = { Authorization: `Basic ${auth}`, "Content-Type": "application/json" };

  try {
    // 1. Fetch payment
    const payRes  = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers });
    if (!payRes.ok) return NextResponse.json({ error: `Razorpay: ${payRes.status}` }, { status: payRes.status });
    const payment = await payRes.json();

    // 2. Fetch associated Razorpay order (has customer notes / address)
    let order = null;
    if (payment.order_id) {
      const ordRes = await fetch(`https://api.razorpay.com/v1/orders/${payment.order_id}`, { headers });
      if (ordRes.ok) order = await ordRes.json();
    }

    return NextResponse.json({
      payment: {
        id:          payment.id,
        amount:      payment.amount / 100,  // paise → ₹
        currency:    payment.currency,
        status:      payment.status,
        method:      payment.method,
        email:       payment.email,
        contact:     payment.contact,
        description: payment.description,
        createdAt:   new Date(payment.created_at * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        notes:       payment.notes,
      },
      order: order ? {
        id:     order.id,
        amount: order.amount / 100,
        status: order.status,
        notes:  order.notes,        // ← customer name, address, items are usually here
      } : null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
