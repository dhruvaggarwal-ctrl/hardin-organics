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
    subject: "Your 10% off code — verify your email 🌿",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F5F0E8;border-radius:16px">
        <h2 style="color:#1C1C1C;margin:0 0 8px">Almost there!</h2>
        <p style="color:#6B6B6B;line-height:1.6;margin:0 0 24px">
          Use the verification code below to unlock your <strong style="color:#C4622D">10% discount</strong> on your first Hardin Organics order.
        </p>
        <div style="background:#2D5016;color:#fff;font-size:36px;font-weight:700;letter-spacing:12px;text-align:center;padding:20px;border-radius:12px;margin-bottom:24px">
          ${otp}
        </div>
        <p style="color:#999;font-size:13px;margin:0">
          This code expires in 10 minutes. If you didn't request this, ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
        <p style="color:#999;font-size:12px;margin:0">Hardin Organics — Handcrafted organic soaps. No parabens. No SLS.</p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json() as { email: string; source?: string };

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { db } = await import("@/lib/firebase/admin");

    // Check if this email has already claimed a coupon
    const leadRef = db.collection("email_leads").doc(email.toLowerCase());
    const leadDoc = await leadRef.get();
    if (leadDoc.exists && leadDoc.data()?.couponClaimed) {
      return NextResponse.json({
        error: "This email has already claimed a discount code.",
        alreadyClaimed: true,
      }, { status: 409 });
    }

    // Rate limit: max 3 OTP requests per email
    const otpRef = db.collection("email_otps").doc(email.toLowerCase());
    const otpDoc = await otpRef.get();
    if (otpDoc.exists) {
      const data = otpDoc.data()!;
      const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);
      if (expiresAt > new Date() && (data.sentCount ?? 0) >= 3) {
        return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
      }
    }

    // Generate and store OTP
    const otp = String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
    await otpRef.set({
      otp,
      email: email.toLowerCase(),
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
