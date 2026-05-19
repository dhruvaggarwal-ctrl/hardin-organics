import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import crypto from "crypto";

interface OtpRecord { mobile: string; otp: string; expiresAt: number; attempts: number; }

function getDataDir() {
  const dir = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function readOtps(): OtpRecord[] {
  const p = path.join(getDataDir(), "auth-otps.json");
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : []; } catch { return []; }
}

function writeOtps(records: OtpRecord[]) {
  writeFileSync(path.join(getDataDir(), "auth-otps.json"), JSON.stringify(records, null, 2));
}

async function sendSms(mobile: string, otp: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    // Dev mode: log OTP to console
    console.log(`[OTP DEV] Mobile: ${mobile} — OTP: ${otp}`);
    return;
  }
  const message = `${otp} is your OTP for Hardin Organics. Valid for 10 minutes. Do not share this with anyone.`;
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${mobile}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("SMS send failed");
}

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json() as { mobile: string };
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000));

    // Store OTP (remove old ones for this mobile)
    const otps = readOtps().filter((r) => r.mobile !== mobile && r.expiresAt > Date.now());
    otps.push({ mobile, otp, expiresAt: Date.now() + 10 * 60 * 1000, attempts: 0 });
    writeOtps(otps);

    await sendSms(mobile, otp);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-otp] error:", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
