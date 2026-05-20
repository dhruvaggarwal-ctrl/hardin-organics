import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

const COUPON_CODE = "WELCOME10";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json() as { email: string; otp: string };

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const { db } = await import("@/lib/firebase/admin");
    const emailKey = email.toLowerCase();

    // Double-check not already claimed
    const leadRef = db.collection("email_leads").doc(emailKey);
    const leadDoc = await leadRef.get();
    if (leadDoc.exists && leadDoc.data()?.couponClaimed) {
      return NextResponse.json({ error: "This email has already claimed a discount code.", alreadyClaimed: true }, { status: 409 });
    }

    // Verify OTP
    const otpRef = db.collection("email_otps").doc(emailKey);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
    }

    const data = otpDoc.data()!;
    const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);

    if (expiresAt < new Date()) {
      await otpRef.delete();
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
    }

    const attempts = data.attempts ?? 0;
    if (attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    if (data.otp !== otp) {
      await otpRef.update({ attempts: FieldValue.increment(1) });
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
    }

    // ✅ OTP verified — mark email as claimed and store for retargeting
    await otpRef.delete();

    await leadRef.set({
      email: emailKey,
      couponClaimed: true,
      couponCode: COUPON_CODE,
      source: data.source || "popup",
      claimedAt: FieldValue.serverTimestamp(),
      // retargeting fields
      subscribed: true,
      tags: ["discount_claimed", data.source || "popup"],
    }, { merge: true });

    return NextResponse.json({ success: true, couponCode: COUPON_CODE });
  } catch (err) {
    console.error("[email-coupon/verify]", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
