import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ error: "GOOGLE_SHEET_WEBHOOK_URL not set" }, { status: 500 });
  }

  const testPayload = {
    type: "order",
    orderId: `TEST-${Date.now()}`,
    razorpayPaymentId: `pay_TEST${Date.now()}`,
    amount: 599,
    customerName: "Test User",
    customerPhone: "9999999999",
    customerEmail: "test@example.com",
    items: [{ name: "Charcoal Soap", quantity: 1, price: 599 }],
    address: "123 Test St, Delhi, 110001",
    createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000),
    });

    const text = await res.text();
    return NextResponse.json({
      success: res.ok,
      sheetStatus: res.status,
      sheetResponse: text,
      sentPayload: testPayload,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
