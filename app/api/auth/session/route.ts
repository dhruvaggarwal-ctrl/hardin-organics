import { NextRequest, NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebase/admin";
import { signSession, setSessionCookie } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json() as { idToken: string };
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const mobile = decoded.phone_number ? decoded.phone_number.replace("+91", "") : null;
    const email = decoded.email || null;

    // Upsert customer in Firestore
    const customerRef = db.collection("customers").doc(uid);
    const snap = await customerRef.get();
    if (!snap.exists) {
      await customerRef.set({
        id: uid,
        mobile: mobile || null,
        email: email || null,
        createdAt: FieldValue.serverTimestamp(),
      });
    } else if (mobile && !snap.data()?.mobile) {
      await customerRef.update({ mobile });
    } else if (email && !snap.data()?.email) {
      await customerRef.update({ email });
    }

    const freshSnap = await customerRef.get();
    const customer = freshSnap.data();

    const jwt = await signSession({
      customerId: uid,
      ...(mobile ? { mobile } : {}),
      ...(email ? { email } : {}),
    });
    await setSessionCookie(jwt);

    return NextResponse.json({ success: true, hasName: !!(customer?.name) });
  } catch (err) {
    console.error("[firebase-session]", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
