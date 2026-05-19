import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { verifySession } from "@/lib/auth";

interface Customer { id: string; email: string; name?: string; mobile?: string; birthday?: string; }

const customersPath = () => path.join(process.cwd(), "data", "customers.json");
function readCustomers(): Customer[] {
  const p = customersPath();
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : []; } catch { return []; }
}

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Partial<Customer>;
  const customers = readCustomers();
  const idx = customers.findIndex((c) => c.email === session.email);
  if (idx === -1) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  customers[idx] = {
    ...customers[idx],
    name: body.name ?? customers[idx].name,
    mobile: body.mobile ?? customers[idx].mobile,
    birthday: body.birthday ?? customers[idx].birthday,
  };
  writeFileSync(customersPath(), JSON.stringify(customers, null, 2));

  // After JSON write, update Firestore
  try {
    if (session?.customerId) {
      const { db } = await import("@/lib/firebase/admin");
      await db.collection("customers").doc(session.customerId).update({
        name: body.name,
        mobile: body.mobile,
        birthday: body.birthday || null,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error("[profile] Firestore update failed (non-fatal):", e);
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = readCustomers();
  const customer = customers.find((c) => c.email === session.email);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}
