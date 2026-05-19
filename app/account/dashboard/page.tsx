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

async function fetchFromFirestore(session: { customerId: string; mobile?: string; email?: string }) {
  try {
    const { db } = await import("@/lib/firebase/admin");

    // Fetch customer
    const customerSnap = await db.collection("customers").doc(session.customerId).get();
    const customer: Customer = customerSnap.exists
      ? (customerSnap.data() as Customer)
      : { id: session.customerId, mobile: session.mobile, email: session.email };

    // Fetch orders by UID
    const orderMap = new Map<string, Order>();
    try {
      const snapByUid = await db.collection("orders")
        .where("customerId", "==", session.customerId)
        .orderBy("createdAt", "desc")
        .get();
      snapByUid.docs.forEach((d) => orderMap.set(d.id, d.data() as Order));
    } catch {
      // Index may not exist yet — skip silently
    }

    // Also match by mobile
    if (session.mobile) {
      try {
        const snapByMobile = await db.collection("orders")
          .where("mobile", "==", session.mobile)
          .orderBy("createdAt", "desc")
          .get();
        snapByMobile.docs.forEach((d) => orderMap.set(d.id, d.data() as Order));
      } catch {
        // Index may not exist yet — skip silently
      }
    }

    const orders = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { customer, orders };
  } catch (err) {
    console.error("[dashboard] Firestore error:", err);
    // Return empty state so page still loads
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
