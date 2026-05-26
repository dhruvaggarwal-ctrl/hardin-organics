import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId, mobile } = body;
    if (!cartId || !mobile) return NextResponse.json({ ok: false });

    const { db } = await import("@/lib/firebase/admin");
    const { FieldValue } = await import("firebase-admin/firestore");

    const savedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    await db.collection("abandoned_carts").doc(cartId).set({
      ...body,
      savedAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Log to Google Sheet — Abandoned Carts tab
    if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      const itemSummary = Array.isArray(body.items)
        ? body.items.map((i: { name: string; quantity: number }) => `${i.name} ×${i.quantity}`).join(", ")
        : String(body.items);

      fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          type: "abandoned-cart",
          cartId,
          customerName: body.customerName,
          mobile: body.mobile,
          email: body.email || "",
          items: itemSummary,
          totalAmount: body.totalAmount,
          city: body.city || "",
          pincode: body.pincode || "",
          orderType: body.orderType || "regular",
          savedAt,
        }),
        signal: AbortSignal.timeout(10000),
      }).catch((e) => console.warn("[abandoned-cart] Sheet log failed:", e));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[abandoned-cart/save]", err);
    return NextResponse.json({ ok: false });
  }
}
