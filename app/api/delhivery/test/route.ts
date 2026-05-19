import { NextRequest, NextResponse } from "next/server";
import { buildDelhiveryPayload, createDelhiveryShipment } from "@/lib/delhivery";

// Test endpoint — call GET /api/delhivery/test?secret=hardin2025
// to verify your Delhivery token and pickup address are correctly configured.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "hardin2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.DELHIVERY_API_TOKEN;
  const pickupName = process.env.DELHIVERY_PICKUP_NAME;
  const pickupAddress = process.env.DELHIVERY_PICKUP_ADDRESS;
  const pickupCity = process.env.DELHIVERY_PICKUP_CITY;
  const pickupState = process.env.DELHIVERY_PICKUP_STATE;
  const pickupPin = process.env.DELHIVERY_PICKUP_PINCODE;

  const envCheck = {
    DELHIVERY_API_TOKEN: token ? `set (${token.slice(0, 6)}...)` : "❌ NOT SET",
    DELHIVERY_PICKUP_NAME: pickupName || "❌ NOT SET",
    DELHIVERY_PICKUP_ADDRESS: pickupAddress || "❌ NOT SET",
    DELHIVERY_PICKUP_CITY: pickupCity || "❌ NOT SET",
    DELHIVERY_PICKUP_STATE: pickupState || "❌ NOT SET",
    DELHIVERY_PICKUP_PINCODE: pickupPin || "❌ NOT SET",
  };

  if (!token) {
    return NextResponse.json({ error: "DELHIVERY_API_TOKEN not set", envCheck });
  }

  // Build a dummy test shipment
  const payload = buildDelhiveryPayload({
    orderId: `TEST-${Date.now()}`,
    customerName: "Test Customer",
    mobile: "9999999999",
    email: "test@hardinorganics.com",
    addressLine1: "123 Test Street",
    addressLine2: "Test Area",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    items: [{ name: "Activated Charcoal Soap", quantity: 1, price: 149 }],
    totalAmount: 149,
    paymentMethod: "Prepaid",
  });

  console.log("[Delhivery TEST] Sending payload:", JSON.stringify(payload, null, 2));

  const result = await createDelhiveryShipment(payload);

  return NextResponse.json({
    envCheck,
    payloadSent: payload,
    delhiveryResponse: result,
  });
}
