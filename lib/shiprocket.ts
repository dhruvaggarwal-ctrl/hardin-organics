/**
 * Shiprocket API integration
 * Uses direct Bearer token from SHIPROCKET_API_TOKEN env var
 */

const SHIPROCKET_API = "https://apiv2.shiprocket.in/v1/external";

function getHeaders() {
  const token = process.env.SHIPROCKET_API_TOKEN;
  if (!token) throw new Error("SHIPROCKET_API_TOKEN env var not set");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface ShiprocketOrder {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
  }>;
  payment_method: string; // "Prepaid" | "COD"
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

export interface ShiprocketTrackingResponse {
  tracking_data?: {
    track_status: number;
    shipment_status?: number;
    shipment_track?: Array<{
      id: number;
      awb_code: string;
      courier_company_id: number;
      shipment_id: number;
      order_id: number;
      pickup_date: string | null;
      delivered_date: string | null;
      weight: string;
      packages: number;
      current_status: string;
      delivered_to: string;
      destination: string;
      consignee_name: string;
      origin: string;
      courier_agent_details: string | null;
      courier_name: string;
    }>;
    shipment_track_activities?: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
      "sr-status"?: string;
      "sr-status-label"?: string;
    }>;
    track_url?: string;
  };
}

/** Create a shipment order on Shiprocket */
export async function createShiprocketOrder(
  order: ShiprocketOrder
): Promise<ShiprocketOrderResponse | null> {
  try {
    const res = await fetch(`${SHIPROCKET_API}/orders/create/adhoc`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Shiprocket] createOrder error:", res.status, err);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("[Shiprocket] createOrder exception:", e);
    return null;
  }
}

/** Track a shipment by AWB code */
export async function trackShipmentByAwb(
  awbCode: string
): Promise<ShiprocketTrackingResponse | null> {
  try {
    const res = await fetch(
      `${SHIPROCKET_API}/courier/track/awb/${awbCode}`,
      { headers: getHeaders() }
    );
    if (!res.ok) {
      console.error("[Shiprocket] trackByAwb error:", res.status);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("[Shiprocket] trackByAwb exception:", e);
    return null;
  }
}

/** Track a shipment by Shiprocket shipment ID */
export async function trackShipmentById(
  shipmentId: string | number
): Promise<ShiprocketTrackingResponse | null> {
  try {
    const res = await fetch(
      `${SHIPROCKET_API}/courier/track/shipment/${shipmentId}`,
      { headers: getHeaders() }
    );
    if (!res.ok) {
      console.error("[Shiprocket] trackById error:", res.status);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("[Shiprocket] trackById exception:", e);
    return null;
  }
}

/** Build a Shiprocket order payload from our order data */
export function buildShiprocketPayload(order: {
  orderId: string;
  customerName: string;
  mobile: string;
  email: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethod: string;
}): ShiprocketOrder {
  const paymentMethod =
    order.paymentMethod?.toLowerCase() === "cod" ? "COD" : "Prepaid";

  const orderItems = order.items.map((item, i) => ({
    name: item.name,
    sku: `HO-SKU-${i + 1}`,
    units: item.quantity,
    selling_price: item.price,
  }));

  return {
    order_id: order.orderId,
    order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    pickup_location: "Primary",
    billing_customer_name: order.customerName.split(" ")[0] || order.customerName,
    billing_last_name: order.customerName.split(" ").slice(1).join(" ") || "",
    billing_address: order.addressLine1,
    billing_address_2: order.addressLine2 || "",
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: "India",
    billing_email: order.email || "noreply@hardinorganics.com",
    billing_phone: order.mobile,
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: paymentMethod,
    sub_total: order.totalAmount,
    length: 15,
    breadth: 10,
    height: 8,
    weight: 0.2,
  };
}
