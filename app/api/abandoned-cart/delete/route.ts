import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cartId } = await req.json();
    if (!cartId) return NextResponse.json({ ok: false });

    const { db } = await import("@/lib/firebase/admin");
    await db.collection("abandoned_carts").doc(cartId).delete();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[abandoned-cart/delete]", err);
    return NextResponse.json({ ok: false });
  }
}
