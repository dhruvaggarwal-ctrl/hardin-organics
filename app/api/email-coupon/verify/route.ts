import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

const COUPON_CODE = "WELCOME10";

async function logEmailLeadToSheet(email: string, source: string) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        type: "email-lead",
        email,
        source,
        couponCode: COUPON_CODE,
        claimedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.warn("[email-coupon] Sheet log failed (non-fatal):", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json() as { email: string; otp: string };

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const { db } = await import("@/lib/firebase/admin");
    const emailKey = email.toLowerCase().trim();

    // Verify OTP from Firestore
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

    // ✅ Verified — delete OTP and log to Google Sheet
    await otpRef.delete();
    await logEmailLeadToSheet(emailKey, data.source || "popup");

    return NextResponse.json({ success: true, couponCode: COUPON_CODE });
  } catch (err) {
    console.error("[email-coupon/verify]", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
