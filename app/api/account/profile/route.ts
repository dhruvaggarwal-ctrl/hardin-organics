import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { name?: string; mobile?: string; birthday?: string };

  try {
    const { db } = await import("@/lib/firebase/admin");
    await db.collection("customers").doc(session.customerId).set(
      {
        name: body.name ?? null,
        mobile: body.mobile ?? session.mobile ?? null,
        birthday: body.birthday ?? null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[profile PUT]", e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await import("@/lib/firebase/admin");
    const snap = await db.collection("customers").doc(session.customerId).get();
    if (!snap.exists) return NextResponse.json({ id: session.customerId, mobile: session.mobile ?? null });
    const data = snap.data()!;
    return NextResponse.json({
      id: session.customerId,
      name: data.name ?? null,
      mobile: data.mobile ?? session.mobile ?? null,
      email: data.email ?? session.email ?? null,
      birthday: data.birthday ?? null,
      address: data.address ?? null,
    });
  } catch (e) {
    console.error("[profile GET]", e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
