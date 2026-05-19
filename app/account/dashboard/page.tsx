import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";
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

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect("/account/login");

  // Fetch customer from Firestore
  const customerSnap = await db.collection("customers").doc(session.customerId).get();
  const customer: Customer = customerSnap.exists
    ? (customerSnap.data() as Customer)
    : { id: session.customerId, mobile: session.mobile, email: session.email };

  // Fetch orders from Firestore — query by customerId OR mobile
  const snapByUid = await db.collection("orders")
    .where("customerId", "==", session.customerId)
    .orderBy("createdAt", "desc")
    .get();

  const orderMap = new Map<string, Order>();
  snapByUid.docs.forEach((d) => orderMap.set(d.id, d.data() as Order));

  // Also match by mobile (orders placed before account existed)
  if (session.mobile) {
    const snapByMobile = await db.collection("orders")
      .where("mobile", "==", session.mobile)
      .orderBy("createdAt", "desc")
      .get();
    snapByMobile.docs.forEach((d) => orderMap.set(d.id, d.data() as Order));
  }

  const orders = Array.from(orderMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <DashboardClient customer={customer} orders={orders} />;
}
