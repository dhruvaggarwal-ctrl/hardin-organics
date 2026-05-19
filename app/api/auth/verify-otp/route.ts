import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import crypto from "crypto";
import { signSession, setSessionCookie } from "@/lib/auth";

interface OtpRecord { mobile: string; otp: string; expiresAt: number; attempts: number; }
interface Customer { id: string; mobile: string; email?: string; name?: string; birthday?: string; address?: Record<string, string>; createdAt: string; }

function getDataDir() {
  const dir = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function readJson<T>(filename: string, fallback: T): T {
  const p = path.join(getDataDir(), filename);
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : fallback; } catch { return fallback; }
}

function writeJson(filename: string, data: unknown) {
  writeFileSync(path.join(getDataDir(), filename), JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json() as { mobile: string; otp: string };
    if (!mobile || !otp) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const otps = readJson<OtpRecord[]>("auth-otps.json", []);
    const record = otps.find((r) => r.mobile === mobile && r.expiresAt > Date.now());

    if (!record) return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });

    // Increment attempts
    record.attempts += 1;
    if (record.attempts > 5) return NextResponse.json({ error: "Too many attempts. Request a new OTP." }, { status: 429 });

    if (record.otp !== otp) {
      writeJson("auth-otps.json", otps);
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // OTP verified — remove it
    writeJson("auth-otps.json", otps.filter((r) => r.mobile !== mobile));

    // Find or create customer
    const customers = readJson<Customer[]>("customers.json", []);
    let customer = customers.find((c) => c.mobile === mobile);
    if (!customer) {
      customer = { id: crypto.randomUUID(), mobile, createdAt: new Date().toISOString() };
      customers.push(customer);
      writeJson("customers.json", customers);
    }

    const jwt = await signSession({ customerId: customer.id, mobile });
    await setSessionCookie(jwt);

    return NextResponse.json({ success: true, hasName: !!customer.name });
  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
