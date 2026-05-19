import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json() as { idToken: string };
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    // Verify the Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const mobile = decoded.phone_number ? decoded.phone_number.replace("+91", "") : null;
    const email = decoded.email || null;

    // Try to upsert customer in Firestore — non-fatal if Firestore not ready yet
    let hasName = false;
    try {
      const { db } = await import("@/lib/firebase/admin");
      const { FieldValue } = await import("firebase-admin/firestore");
      const customerRef = db.collection("customers").doc(uid);
      const snap = await customerRef.get();

      if (!snap.exists) {
        // Brand-new user — create their customer doc
        await customerRef.set({
          id: uid,
          mobile: mobile || null,
          email: email || null,
          createdAt: FieldValue.serverTimestamp(),
        });
      } else {
        // Existing user — fill in any missing contact fields
        if (mobile && !snap.data()?.mobile) await customerRef.update({ mobile });
        if (email && !snap.data()?.email)   await customerRef.update({ email });
        hasName = !!(snap.data()?.name);
      }

      // Merge guest profile if this mobile has placed an order without being logged in
      if (mobile) {
        const guestRef = db.collection("guest_profiles").doc(mobile);
        const guestSnap = await guestRef.get();
        if (guestSnap.exists) {
          const guest = guestSnap.data()!;
          const customer = snap.exists ? snap.data()! : {};

          // Only copy fields that aren't already set on the customer profile
          const patch: Record<string, unknown> = {};
          if (!customer.name    && guest.name)    { patch.name    = guest.name;    hasName = true; }
          if (!customer.mobile  && guest.mobile)  patch.mobile  = guest.mobile;
          if (!customer.email   && guest.email)   patch.email   = guest.email;
          if (!customer.address && guest.address) patch.address = guest.address;

          if (Object.keys(patch).length > 0) {
            patch.updatedAt = FieldValue.serverTimestamp();
            await customerRef.set(patch, { merge: true });
          }

          // Clean up — guest profile has been absorbed
          await guestRef.delete();
        }
      }
    } catch (firestoreErr) {
      console.error("[session] Firestore upsert failed (non-fatal):", firestoreErr);
    }

    // Create JWT session cookie regardless of Firestore status
    const jwt = await signSession({
      customerId: uid,
      ...(mobile ? { mobile } : {}),
      ...(email ? { email } : {}),
    });
    await setSessionCookie(jwt);

    return NextResponse.json({ success: true, hasName });
  } catch (err) {
    console.error("[firebase-session]", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
