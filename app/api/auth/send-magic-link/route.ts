import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";

interface Customer { id: string; email: string; name?: string; mobile?: string; birthday?: string; address?: Record<string, string>; createdAt: string; }
interface AuthToken { email: string; token: string; expiresAt: number; }

const customersPath = () => path.join(process.cwd(), "data", "customers.json");
const tokensPath = () => path.join(process.cwd(), "data", "auth-tokens.json");

function readJson<T>(p: string, fallback: T): T {
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : fallback; } catch { return fallback; }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Find or create customer
    const customers = readJson<Customer[]>(customersPath(), []);
    let customer = customers.find((c) => c.email === email);
    if (!customer) {
      customer = { id: crypto.randomUUID(), email, createdAt: new Date().toISOString() };
      customers.push(customer);
      writeFileSync(customersPath(), JSON.stringify(customers, null, 2));
    }

    // Create token (15 min expiry)
    const token = crypto.randomUUID();
    const tokens = readJson<AuthToken[]>(tokensPath(), []);
    // Remove old tokens for this email
    const filtered = tokens.filter((t) => t.email !== email);
    filtered.push({ email, token, expiresAt: Date.now() + 15 * 60 * 1000 });
    writeFileSync(tokensPath(), JSON.stringify(filtered, null, 2));

    // Send email
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://hardinorganics.com"}/account/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Hardin Organics" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your login link for Hardin Organics 🌿",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#F5F0E8;border-radius:16px">
          <h2 style="color:#1C1C1A;margin-bottom:8px">Log in to Hardin Organics</h2>
          <p style="color:#6B6B6B;line-height:1.6">Click the button below to log in. This link expires in 15 minutes.</p>
          <a href="${loginUrl}" style="display:inline-block;background:#A0522D;color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;margin-top:20px;font-size:15px">Log In →</a>
          <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, ignore this email. The link only works once.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Magic link error:", err);
    return NextResponse.json({ error: "Failed to send link" }, { status: 500 });
  }
}
