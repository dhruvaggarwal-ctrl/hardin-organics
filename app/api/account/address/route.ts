import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Record<string, string>;

  try {
    const { db } = await import("@/lib/firebase/admin");
    await db.collection("customers").doc(session.customerId).set(
      { address: body, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[address PUT]", e);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
