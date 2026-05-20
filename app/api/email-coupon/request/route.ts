import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendOtpEmail(email: string, otp: string) {
  if (!process.env.SMTP_HOST) {
    console.log(`[email-coupon DEV] OTP for ${email}: ${otp}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Hardin Organics" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "676373 is your Hardin Organics verification code".replace("676373", otp),
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d0">
        <!-- Header -->
        <div style="background:#2D5016;padding:32px 24px;text-align:center">
          <p style="color:#fff;font-size:22px;font-weight:700;margin:0;letter-spacing:-0.3px">हर्दिन Organics</p>
          <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase">Handcrafted Organic Soaps</p>
        </div>
        <!-- Body -->
        <div style="padding:36px 32px;background:#FDFAF6">
          <h1 style="color:#1C1C1C;font-size:24px;font-weight:700;margin:0 0 12px;line-height:1.3">
            Your exclusive 10% off is one step away 🌿
          </h1>
          <p style="color:#6B6B6B;font-size:15px;line-height:1.7;margin:0 0 28px">
            Enter this code to verify your email and unlock your discount on handcrafted organic soaps — no parabens, no SLS, just pure ingredients.
          </p>
          <!-- OTP Box -->
          <div style="background:#2D5016;border-radius:14px;padding:24px;text-align:center;margin-bottom:28px">
            <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 10px;letter-spacing:2px;text-transform:uppercase">Verification Code</p>
            <p style="color:#ffffff;font-size:42px;font-weight:800;letter-spacing:14px;margin:0;font-variant-numeric:tabular-nums">${otp}</p>
          </div>
          <!-- Coupon preview -->
          <div style="background:#F5F0E8;border:2px dashed #C4622D;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px">
            <p style="color:#6B6B6B;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Your coupon code (after verification)</p>
            <p style="color:#C4622D;font-size:22px;font-weight:800;letter-spacing:4px;margin:0">WELCOME10</p>
          </div>
          <p style="color:#999;font-size:13px;line-height:1.6;margin:0">
            ⏱ This code expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <!-- Footer -->
        <div style="padding:20px 32px;background:#f0ebe0;border-top:1px solid #e8e0d0;text-align:center">
          <p style="color:#999;font-size:12px;margin:0">© Hardin Organics · Made in India · No Parabens · No SLS</p>
        </div>
      </div>
    `,
  });
}

async function checkEmailClaimed(email: string): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(
      `${url}?type=check-email&email=${encodeURIComponent(email)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return data.claimed === true;
  } catch (e) {
    console.warn("[email-coupon] Sheet check failed, allowing request:", e);
    return false; // fail open — don't block user if sheet is down
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json() as { email: string; source?: string };

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const emailKey = email.toLowerCase().trim();

    // Check Google Sheet if this email already claimed
    const alreadyClaimed = await checkEmailClaimed(emailKey);
    if (alreadyClaimed) {
      return NextResponse.json({
        error: "This email has already claimed a discount code.",
        alreadyClaimed: true,
      }, { status: 409 });
    }

    // OTP stored in Firestore (fast, time-sensitive)
    const { db } = await import("@/lib/firebase/admin");
    const otpRef = db.collection("email_otps").doc(emailKey);
    const otpDoc = await otpRef.get();

    // Rate limit: max 3 OTP sends per window
    if (otpDoc.exists) {
      const data = otpDoc.data()!;
      const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);
      if (expiresAt > new Date() && (data.sentCount ?? 0) >= 3) {
        return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
      }
    }

    const otp = String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
    await otpRef.set({
      otp,
      email: emailKey,
      source: source || "popup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      sentCount: (otpDoc.data()?.sentCount ?? 0) + 1,
      createdAt: new Date(),
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[email-coupon/request]", err);
    return NextResponse.json({ error: "Failed to send code. Please try again." }, { status: 500 });
  }
}
