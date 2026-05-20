import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!url) {
    return NextResponse.json({
      success: false,
      error: "GOOGLE_SHEET_WEBHOOK_URL env var is not set",
    }, { status: 500 });
  }

  const testPayload = {
    orderId: "HO-TEST-0000",
    createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    customerName: "Test Customer",
    mobile: "9999999999",
    email: "test@hardinorganics.com",
    items: "Saffron Haldi Chandan ×1 (Pack of 1)",
    subtotal: 149,
    shipping: 0,
    couponDiscount: 0,
    total: 149,
    paymentMethod: "UPI",
    paymentId: "pay_TEST123456",
    status: "confirmed",
    addressLine1: "123 Test Street",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
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
      success: true,
      sheetStatus: res.status,
      sheetResponse: text,
      message: "✅ Test row sent! Check your Google Sheet.",
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: String(e),
      message: "❌ Failed to reach Google Sheet. Check the URL in Vercel env vars.",
    }, { status: 500 });
  }
}
