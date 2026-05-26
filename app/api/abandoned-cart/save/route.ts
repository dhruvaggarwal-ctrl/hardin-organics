import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId, mobile } = body;
    if (!cartId || !mobile) return NextResponse.json({ ok: false });

    const { db } = await import("@/lib/firebase/admin");
    const { FieldValue } = await import("firebase-admin/firestore");

    await db.collection("abandoned_carts").doc(cartId).set({
      ...body,
      savedAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[abandoned-cart/save]", err);
    return NextResponse.json({ ok: false });
  }
}
