import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { signSession, setSessionCookie } from "@/lib/auth";

interface AuthToken { email: string; token: string; expiresAt: number; }
interface Customer { id: string; email: string; }

const customersPath = () => path.join(process.cwd(), "data", "customers.json");
const tokensPath = () => path.join(process.cwd(), "data", "auth-tokens.json");

function readJson<T>(p: string, fallback: T): T {
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : fallback; } catch { return fallback; }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json() as { token: string };
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const tokens = readJson<AuthToken[]>(tokensPath(), []);
    const entry = tokens.find((t) => t.token === token);

    if (!entry) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    if (entry.expiresAt < Date.now()) {
      // Clean up expired token
      writeFileSync(tokensPath(), JSON.stringify(tokens.filter((t) => t.token !== token), null, 2));
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Find customer
    const customers = readJson<Customer[]>(customersPath(), []);
    const customer = customers.find((c) => c.email === entry.email);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    // Delete used token
    writeFileSync(tokensPath(), JSON.stringify(tokens.filter((t) => t.token !== token), null, 2));

    // Create session JWT + set cookie
    const jwt = await signSession({ email: customer.email, customerId: customer.id });
    await setSessionCookie(jwt);

    return NextResponse.json({ success: true, customerId: customer.id });
  } catch (err) {
    console.error("Auth verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
