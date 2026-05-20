import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json() as { mobile: string; otp: string };
    if (!mobile || !otp) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { db } = await import("@/lib/firebase/admin");
    const { FieldValue } = await import("firebase-admin/firestore");

    const otpRef = db.collection("otps").doc(mobile);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    const data = otpDoc.data()!;
    const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);

    if (expiresAt < new Date()) {
      await otpRef.delete();
      return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    const attempts = data.attempts ?? 0;
    if (attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts. Request a new OTP." }, { status: 429 });
    }

    if (data.otp !== otp) {
      await otpRef.update({ attempts: FieldValue.increment(1) });
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // OTP verified — delete it immediately (one-time use)
    await otpRef.delete();

    // Find or create customer in Firestore
    let customerId: string;
    let hasName = false;

    // 1. Check if there's a temp profile from a guest order (mob_{mobile})
    const tempKey = `mob_${mobile}`;
    const tempDoc = await db.collection("customers").doc(tempKey).get();

    if (tempDoc.exists) {
      const cData = tempDoc.data()!;
      // Promote temp profile to a real customer doc
      customerId = crypto.randomUUID();
      await db.collection("customers").doc(customerId).set({
        ...cData,
        id: customerId,
        mobile,
        tempMobileKey: FieldValue.delete(),
        updatedAt: new Date(),
      });
      await db.collection("customers").doc(tempKey).delete();
      hasName = !!cData.name;
    } else {
      // 2. Check if customer already exists by mobile field
      const existingSnap = await db.collection("customers")
        .where("mobile", "==", mobile)
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        customerId = existingSnap.docs[0].id;
        hasName = !!existingSnap.docs[0].data().name;
      } else {
        // 3. Brand new customer
        customerId = crypto.randomUUID();
        await db.collection("customers").doc(customerId).set({
          id: customerId,
          mobile,
          createdAt: new Date(),
        });
        hasName = false;
      }
    }

    const jwt = await signSession({ customerId, mobile });
    await setSessionCookie(jwt);

    return NextResponse.json({ success: true, hasName });
  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
