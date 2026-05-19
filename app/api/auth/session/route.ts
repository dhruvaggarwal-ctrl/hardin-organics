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

      // On login, check if this mobile placed any orders before having an account.
      // If so, a temporary customer doc exists at customers/mob_{mobile} — merge it in.
      if (mobile) {
        const tempRef = db.collection("customers").doc(`mob_${mobile}`);
        const tempSnap = await tempRef.get();
        if (tempSnap.exists) {
          const tempData = tempSnap.data()!;
          const customer = snap.exists ? snap.data()! : {};

          // Only copy fields the real profile doesn't have yet
          const patch: Record<string, unknown> = {};
          if (!customer.name    && tempData.name)    { patch.name    = tempData.name;    hasName = true; }
          if (!customer.mobile  && tempData.mobile)  patch.mobile  = tempData.mobile;
          if (!customer.email   && tempData.email)   patch.email   = tempData.email;
          if (!customer.address && tempData.address) patch.address = tempData.address;

          if (Object.keys(patch).length > 0) {
            patch.updatedAt = FieldValue.serverTimestamp();
            await customerRef.set(patch, { merge: true });
          }

          // Also link any orders saved against the temp mobile key to this UID
          try {
            const ordersSnap = await db.collection("orders")
              .where("mobile", "==", mobile)
              .where("customerId", "==", null)
              .get();
            const batch = db.batch();
            ordersSnap.docs.forEach((d) => batch.update(d.ref, { customerId: uid }));
            if (!ordersSnap.empty) await batch.commit();
          } catch { /* index may not exist yet — non-fatal */ }

          // Delete the temp profile — it's been absorbed into the real account
          await tempRef.delete();
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
