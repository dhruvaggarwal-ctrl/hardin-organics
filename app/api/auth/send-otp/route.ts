import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

async function sendSms(mobile: string, otp: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log(`[OTP DEV] Mobile: ${mobile} — OTP: ${otp}`);
    return;
  }
  const message = `${otp} is your OTP for Hardin Organics. Valid for 10 minutes. Do not share this with anyone.`;
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${mobile}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("SMS send failed");
}

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json() as { mobile: string };
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
    }

    const { db } = await import("@/lib/firebase/admin");
    const otpRef = db.collection("otps").doc(mobile);

    // Rate limit: max 5 sends per 10-minute window
    const existing = await otpRef.get();
    if (existing.exists) {
      const data = existing.data()!;
      const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);
      if (expiresAt > new Date() && (data.sentCount ?? 0) >= 5) {
        return NextResponse.json({ error: "Too many OTP requests. Please wait a few minutes." }, { status: 429 });
      }
    }

    const otp = String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpRef.set({
      otp,
      expiresAt,
      attempts: 0,
      sentCount: (existing.data()?.sentCount ?? 0) + 1,
      createdAt: new Date(),
    });

    await sendSms(mobile, otp);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-otp] error:", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
