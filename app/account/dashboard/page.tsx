import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { DashboardClient } from "./DashboardClient";

interface Order {
  orderId: string;
  email: string | null;
  mobile: string | null;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  waybill?: string;
}
interface Customer {
  id: string; mobile?: string; email?: string; name?: string; birthday?: string;
  address?: { addressLine1?: string; addressLine2?: string; city?: string; state?: string; pincode?: string };
}

function readJson<T>(p: string, fallback: T): T {
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : fallback; } catch { return fallback; }
}

function getOrdersPath() {
  return process.env.NODE_ENV === "production" ? "/tmp/orders.json" : path.join(process.cwd(), "data", "orders.json");
}

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect("/account/login");

  const customers = readJson<Customer[]>(path.join(process.cwd(), "data", "customers.json"), []);

  // Find by mobile first (new auth), then fall back to email (old auth)
  const customer: Customer = customers.find((c) =>
    (session.mobile && c.mobile === session.mobile) ||
    (session.email && c.email === session.email)
  ) || {
    id: session.customerId,
    mobile: session.mobile,
    email: session.email,
  };

  const orders = readJson<Order[]>(getOrdersPath(), []);
  const myOrders = orders.filter((o) =>
    (session.mobile && o.mobile === session.mobile) ||
    (session.email && o.email === session.email) ||
    (customer.mobile && o.mobile === customer.mobile)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return <DashboardClient customer={customer} orders={myOrders} />;
}
