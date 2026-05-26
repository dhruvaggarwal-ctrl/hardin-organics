import { NextResponse } from "next/server";
import { buildDelhiveryPayload, createDelhiveryShipment } from "@/lib/delhivery";

export async function GET() {
  const { db } = await import("@/lib/firebase/admin");
  const { FieldValue } = await import("firebase-admin/firestore");

  // Idempotency — don't create twice
  const dup = await db.collection("orders")
    .where("razorpayPaymentId", "==", "pay_Stxs9EwGtQhocR")
    .limit(1).get();

  let orderId: string;

  if (!dup.empty) {
    orderId = dup.docs[0].id;
  } else {
    const now  = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, "");
    orderId    = `HO-${date}-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.collection("orders").doc(orderId).set({
      orderId,
      customerName:      "Sathya",
      mobile:            "9945102111",
      email:             "sathyahll@gmail.com",
      addressLine1:      "#823, Chethana, 1st Floor, 4th Main, 26th Cross, Vidyaranyapuram",
      addressLine2:      "",
      city:              "Mysuru",
      state:             "Karnataka",
      pincode:           "570008",
      items: [
        { id: "charcoal", name: "Activated Charcoal Soap",      quantity: 1, price: 149 },
        { id: "haldi",    name: "Saffron Haldi Chandan Soap",   quantity: 1, price: 0   },
      ],
      subtotal:          149,
      discount:          0,
      shipping:          0,
      totalAmount:       149,
      orderType:         "BOGO",
      paymentMethod:     "razorpay",
      razorpayPaymentId: "pay_Stxs9EwGtQhocR",
      razorpayOrderId:   "order_StxrumIVWobGxq",
      status:            "confirmed",
      recoveredManually: true,
      createdAt:         FieldValue.serverTimestamp(),
    });

    // Log to Google Sheet
    if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          orderId,
          createdAt:     new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          customerName:  "Sathya",
          mobile:        "9945102111",
          email:         "sathyahll@gmail.com",
          items:         "Activated Charcoal Soap ×1, Saffron Haldi Chandan Soap ×1",
          subtotal:      149,
          shipping:      0,
          couponDiscount: 0,
          total:         149,
          paymentMethod: "razorpay",
          paymentId:     "pay_Stxs9EwGtQhocR",
          status:        "confirmed (manually recovered)",
          addressLine1:  "#823, Chethana, 1st Floor, 4th Main, 26th Cross, Vidyaranyapuram",
          city:          "Mysuru",
          state:         "Karnataka",
          pincode:       "570008",
        }),
        signal: AbortSignal.timeout(10000),
      }).catch((e) => console.warn("[push-sathya] Sheet log failed:", e));
    }
  }

  // Push to Delhivery
  const dlPayload = buildDelhiveryPayload({
    orderId,
    customerName:  "Sathya",
    mobile:        "9945102111",
    email:         "sathyahll@gmail.com",
    addressLine1:  "#823, Chethana, 1st Floor, 4th Main, 26th Cross, Vidyaranyapuram",
    addressLine2:  "",
    city:          "Mysuru",
    state:         "Karnataka",
    pincode:       "570008",
    items: [
      { name: "Activated Charcoal Soap",    quantity: 1, price: 149 },
      { name: "Saffron Haldi Chandan Soap", quantity: 1, price: 0   },
    ],
    totalAmount:   149,
    paymentMethod: "razorpay",
  });

  const dl      = await createDelhiveryShipment(dlPayload);
  const waybill = dl?.packages?.[0]?.waybill ?? null;
  const remarks = dl?.packages?.[0]?.remarks ?? [];

  if (waybill) {
    await db.collection("orders").doc(orderId).update({
      waybill,
      delhiveryCreatedAt: new Date().toISOString(),
    });
  } else {
    await db.collection("orders").doc(orderId).update({
      delhiveryError: remarks.join(", ") || dl?.rmk || "No waybill returned",
    });
  }

  return NextResponse.json({
    success:  !!waybill,
    orderId,
    waybill:  waybill ?? null,
    remarks,
    dlResponse: dl,
  });
}
