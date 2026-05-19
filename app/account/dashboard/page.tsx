import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

interface Customer {
  id: string; mobile?: string; email?: string; name?: string; birthday?: string;
  address?: { addressLine1?: string; addressLine2?: string; city?: string; state?: string; pincode?: string };
}

interface Order {
  orderId: string; customerName: string; mobile?: string; email?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number; status: string; createdAt: string; waybill?: string;
}

/**
 * Converts Firestore Timestamps and any non-serializable values to plain JS.
 * Next.js Server → Client Component boundary requires fully serializable props.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize<T>(obj: any): T {
  if (obj === null || obj === undefined) return obj as T;
  if (typeof obj !== "object") return obj as T;
  // Firestore Timestamp has toDate()
  if (typeof obj.toDate === "function") return obj.toDate().toISOString() as T;
  if (Array.isArray(obj)) return obj.map(serialize) as T;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[k] = serialize(v);
  }
  return result as T;
}

async function fetchFromFirestore(session: { customerId: string; mobile?: string; email?: string }) {
  try {
    const { db } = await import("@/lib/firebase/admin");

    // Fetch customer — serialize to strip Timestamps
    const customerSnap = await db.collection("customers").doc(session.customerId).get();
    const rawCustomer = customerSnap.exists ? customerSnap.data() : null;

    const customer: Customer = rawCustomer
      ? {
          id: (rawCustomer.id as string) || session.customerId,
          mobile: (rawCustomer.mobile as string) || session.mobile,
          email: (rawCustomer.email as string) || session.email,
          name: rawCustomer.name as string | undefined,
          birthday: rawCustomer.birthday as string | undefined,
          address: rawCustomer.address as Customer["address"] | undefined,
        }
      : { id: session.customerId, mobile: session.mobile, email: session.email };

    // Fetch orders — wrapped individually so one failure doesn't kill the page
    const orderMap = new Map<string, Order>();

    try {
      const snapByUid = await db.collection("orders")
        .where("customerId", "==", session.customerId)
        .orderBy("createdAt", "desc")
        .get();
      snapByUid.docs.forEach((d) => {
        const raw = d.data();
        orderMap.set(d.id, serialize<Order>({ ...raw, orderId: raw.orderId || d.id }));
      });
    } catch (e) {
      console.warn("[dashboard] orders by UID query failed (index may be missing):", e);
    }

    if (session.mobile) {
      try {
        const snapByMobile = await db.collection("orders")
          .where("mobile", "==", session.mobile)
          .orderBy("createdAt", "desc")
          .get();
        snapByMobile.docs.forEach((d) => {
          const raw = d.data();
          orderMap.set(d.id, serialize<Order>({ ...raw, orderId: raw.orderId || d.id }));
        });
      } catch (e) {
        console.warn("[dashboard] orders by mobile query failed (index may be missing):", e);
      }
    }

    const orders = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { customer, orders };
  } catch (err) {
    console.error("[dashboard] Firestore error:", err);
    return {
      customer: { id: session.customerId, mobile: session.mobile, email: session.email } as Customer,
      orders: [] as Order[],
    };
  }
}

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect("/account/login");

  const { customer, orders } = await fetchFromFirestore(session);

  return <DashboardClient customer={customer} orders={orders} />;
}
