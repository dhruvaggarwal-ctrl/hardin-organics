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
    from: `"Hardin Organics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `${otp} — your Hardin Organics discount code 🌿`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#F2EDE4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EDE4;padding:32px 16px">
          <tr><td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

              <!-- Header -->
              <tr>
                <td style="background:#1E3A0F;padding:36px 32px;text-align:center">
                  <p style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px">Hardin Organics</p>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font-size:11px;letter-spacing:3px;text-transform:uppercase">Handcrafted · Organic · Pure</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 36px 32px;background:#ffffff">
                  <p style="margin:0 0 8px;color:#1C1C1C;font-size:22px;font-weight:700;line-height:1.3">Here's your verification code 👇</p>
                  <p style="margin:0 0 32px;color:#6B6B6B;font-size:15px;line-height:1.6">
                    Enter this code on the website to verify your email and unlock <strong style="color:#1C1C1C">10% off</strong> your first order of handcrafted organic soaps.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:#F5F0E8;border:1.5px solid #D4B896;border-radius:16px;padding:28px 24px;text-align:center;margin-bottom:28px">
                    <p style="margin:0 0 12px;color:#8B7355;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase">One-Time Code</p>
                    <p style="margin:0;color:#1E3A0F;font-size:48px;font-weight:800;letter-spacing:16px;font-variant-numeric:tabular-nums;line-height:1">${otp}</p>
                    <p style="margin:16px 0 0;color:#999;font-size:12px">Expires in 10 minutes</p>
                  </div>

                  <!-- Coupon teaser -->
                  <div style="background:#1E3A0F;border-radius:14px;padding:20px 24px;text-align:center;margin-bottom:28px">
                    <p style="margin:0 0 6px;color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:2px;text-transform:uppercase">Your discount code (unlocks after verification)</p>
                    <p style="margin:0;color:#F5C842;font-size:26px;font-weight:800;letter-spacing:6px">WELCOME10</p>
                  </div>

                  <p style="margin:0;color:#BBBBBB;font-size:12px;line-height:1.7;text-align:center">
                    Didn't request this? You can safely ignore this email.<br>This code is only valid once and cannot be reused.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#F7F3EE;border-top:1px solid #EAE3D8;padding:20px 32px;text-align:center">
                  <p style="margin:0;color:#AAAAAA;font-size:11px;line-height:1.8">
                    © Hardin Organics · Made in India<br>
                    No Parabens · No SLS · No Compromise
                  </p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
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
