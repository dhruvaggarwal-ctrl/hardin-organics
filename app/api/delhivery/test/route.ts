import { NextRequest, NextResponse } from "next/server";
import { buildDelhiveryPayload, createDelhiveryShipment } from "@/lib/delhivery";
import { requireAdmin } from "@/lib/adminAuth";

// Test endpoint — verifies your Delhivery token and pickup address are
// correctly configured. Usage: GET /api/delhivery/test (header: x-admin-token)
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const token = process.env.DELHIVERY_API_TOKEN;
  const pickupName = process.env.DELHIVERY_PICKUP_NAME;
  const pickupAddress = process.env.DELHIVERY_PICKUP_ADDRESS;
  const pickupCity = process.env.DELHIVERY_PICKUP_CITY;
  const pickupState = process.env.DELHIVERY_PICKUP_STATE;
  const pickupPin = process.env.DELHIVERY_PICKUP_PINCODE;

  const pickupLocationName = process.env.DELHIVERY_PICKUP_LOCATION_NAME;
  const envCheck = {
    DELHIVERY_API_TOKEN: token ? `set (${token.slice(0, 6)}...)` : "❌ NOT SET",
    DELHIVERY_PICKUP_LOCATION_NAME: pickupLocationName || "❌ NOT SET — this must match exactly what's in your Delhivery dashboard",
    DELHIVERY_PICKUP_NAME: pickupName || "❌ NOT SET",
    DELHIVERY_PICKUP_ADDRESS: pickupAddress || "❌ NOT SET",
    DELHIVERY_PICKUP_CITY: pickupCity || "❌ NOT SET",
    DELHIVERY_PICKUP_STATE: pickupState || "❌ NOT SET",
    DELHIVERY_PICKUP_PINCODE: pickupPin || "❌ NOT SET",
  };

  if (!token) {
    return NextResponse.json({ error: "DELHIVERY_API_TOKEN not set", envCheck });
  }

  // Build a realistic test shipment (Delhivery flags obviously fake names/phones)
  const payload = buildDelhiveryPayload({
    orderId: `TEST-${Date.now()}`,
    customerName: "Dhruv Aggarwal",
    mobile: "9650595027",
    email: "dhruvaggarwal98760@gmail.com",
    addressLine1: "B-703 7th Floor HPCL Housing Society Sector Pi-1",
    addressLine2: "Amit Nagar Greater Noida",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    pincode: "201308",
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
