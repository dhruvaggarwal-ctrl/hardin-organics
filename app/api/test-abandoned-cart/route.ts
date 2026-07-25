import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const cartId = `test_${Date.now()}`;

    const testCart = {
      cartId,
      customerName: "Test User",
      mobile: "9999999999",
      email: "test@example.com",
      addressLine1: "123 Test Street, Sector 15",
      addressLine2: "Near Test Landmark",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      items: [
        { id: "charcoal", name: "Activated Charcoal Soap", quantity: 1, price: 299 },
      ],
      totalAmount: 299,
      orderType: "regular",
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://hardinorganics.com"}/api/abandoned-cart/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCart),
    });

    const data = await res.json();

    return NextResponse.json({
      success: data.ok,
      cartId,
      message: data.ok
        ? "Abandoned cart saved! Check Firestore → abandoned_carts collection."
        : "Failed to save abandoned cart.",
      savedData: testCart,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
