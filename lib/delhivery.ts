/**
 * Delhivery API integration
 * Uses direct token from DELHIVERY_API_TOKEN env var
 * Auth header: Authorization: Token <api_token>
 */

const DELHIVERY_API = "https://track.delhivery.com";

function getToken() {
  const token = process.env.DELHIVERY_API_TOKEN;
  if (!token) throw new Error("DELHIVERY_API_TOKEN env var not set");
  return token;
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Token ${getToken()}`,
  };
}

export interface DelhiveryShipment {
  name: string;           // consignee name
  add: string;            // address line
  pin: string;            // pincode
  city: string;
  state: string;
  country: string;
  phone: string;
  order: string;          // your order ID
  payment_mode: string;   // "Prepaid" | "COD"
  return_pin: string;     // pickup pincode
  return_city: string;
  return_phone: string;
  return_add: string;
  return_name: string;
  return_email: string;
  return_state: string;
  return_country: string;
  products_desc: string;
  hsn_code: string;
  cod_amount: string;     // "0" for prepaid
  order_date: string;     // YYYY-MM-DD
  total_amount: string;
  seller_add: string;
  seller_name: string;
  seller_inv: string;
  quantity: string;
  waybill: string;        // leave "" to auto-assign
  shipment_width: string;
  shipment_height: string;
  weight: string;         // in kg
  shipment_length: string;
  fragile_shipment: boolean;
}

export interface DelhiveryCreateResponse {
  upload_wbn?: string;
  packages?: Array<{
    waybill: string;
    refnum: string;
    sort_code: string;
    client: string;
    remarks?: string[];
    status: string;
  }>;
  success?: boolean;
  error?: string;
  rmk?: string;
}

export interface DelhiveryTrackResponse {
  ShipmentData?: Array<{
    Shipment: {
      Waybill: string;
      Status: string;
      StatusType: string;
      ScheduledDeliveryDate: string | null;
      DeliveryDate: string | null;
      PickUpDate: string | null;
      Destination: string;
      Origin: string;
      Consignee: string;
      ConsigneeAdd: string;
      ReferenceNo: string;
      Scans: Array<{
        ScanDetail: {
          ScanDateTime: string;
          Scan: string;
          ScanType: string;
          Instructions: string;
          StatusDateTime: string;
          ScannedLocation: string;
          CityLocation: string;
        };
      }>;
    };
  }>;
}

/** Create a shipment on Delhivery */
export async function createDelhiveryShipment(
  shipment: DelhiveryShipment
): Promise<DelhiveryCreateResponse | null> {
  try {
    const token = getToken();

    // Delhivery's create endpoint requires application/x-www-form-urlencoded
    // with the payload as format=json&data=<JSON string>
    const pickupLocationName = process.env.DELHIVERY_PICKUP_LOCATION_NAME || "Primary";
    const dataJson = JSON.stringify({
      shipments: [shipment],
      pickup_location: { name: pickupLocationName },
    });
    console.log("[Delhivery] Using pickup location name:", pickupLocationName);

    const formBody = `format=json&data=${encodeURIComponent(dataJson)}`;

    console.log("[Delhivery] Creating shipment for order:", shipment.order);
    console.log("[Delhivery] Payload:", dataJson);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);
    let res: Response;
    try {
      res = await fetch(`${DELHIVERY_API}/api/cmu/create.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Token ${token}`,
        },
        body: formBody,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }

    const responseText = await res.text();
    console.log("[Delhivery] Response status:", res.status);
    console.log("[Delhivery] Response body:", responseText);

    if (!res.ok) {
      console.error("[Delhivery] createShipment HTTP error:", res.status, responseText);
      return null;
    }

    const json = JSON.parse(responseText) as DelhiveryCreateResponse;

    // Log any package-level errors Delhivery returns
    if (json.packages?.length) {
      json.packages.forEach((pkg) => {
        if (pkg.remarks?.length) {
          console.warn("[Delhivery] Package remarks for", pkg.waybill, ":", pkg.remarks);
        }
      });
    }
    if (json.rmk) console.warn("[Delhivery] Remark:", json.rmk);

    return json;
  } catch (e) {
    console.error("[Delhivery] createShipment exception:", e);
    return null;
  }
}

/** Track a shipment by waybill number */
export async function trackByWaybill(
  waybill: string
): Promise<DelhiveryTrackResponse | null> {
  try {
    const url = `${DELHIVERY_API}/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}&token=${getToken()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);
    let res: Response;
    try {
      res = await fetch(url, { headers: getHeaders(), signal: controller.signal });
      clearTimeout(timeoutId);
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }

    if (!res.ok) {
      console.error("[Delhivery] track error:", res.status);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("[Delhivery] track exception:", e);
    return null;
  }
}

/** Build a Delhivery shipment payload from our order */
export function buildDelhiveryPayload(order: {
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
}): DelhiveryShipment {
  const isCod = order.paymentMethod?.toLowerCase() === "cod";
  const productDesc = order.items.map((i) => `${i.name} x${i.quantity}`).join(", ");
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  // Pickup / return details — update these to match your registered Delhivery pickup address
  const PICKUP_NAME = process.env.DELHIVERY_PICKUP_NAME || "Hardin Organics";
  const PICKUP_ADD = process.env.DELHIVERY_PICKUP_ADDRESS || "";
  const PICKUP_CITY = process.env.DELHIVERY_PICKUP_CITY || "";
  const PICKUP_STATE = process.env.DELHIVERY_PICKUP_STATE || "";
  const PICKUP_PIN = process.env.DELHIVERY_PICKUP_PINCODE || "";
  const PICKUP_PHONE = process.env.DELHIVERY_PICKUP_PHONE || "9650595027";
  const PICKUP_EMAIL = process.env.DELHIVERY_PICKUP_EMAIL || "marketinghardinorganics@gmail.com";

  return {
    name: order.customerName,
    add: [order.addressLine1, order.addressLine2].filter(Boolean).join(", "),
    pin: order.pincode,
    city: order.city,
    state: order.state,
    country: "India",
    phone: order.mobile,
    order: order.orderId,
    payment_mode: isCod ? "COD" : "Prepaid",
    return_pin: PICKUP_PIN,
    return_city: PICKUP_CITY,
    return_phone: PICKUP_PHONE,
    return_add: PICKUP_ADD,
    return_name: PICKUP_NAME,
    return_email: PICKUP_EMAIL,
    return_state: PICKUP_STATE,
    return_country: "India",
    products_desc: productDesc,
    hsn_code: "3401",        // HS code for soap
    cod_amount: isCod ? String(order.totalAmount) : "0",
    order_date: new Date().toISOString().slice(0, 10),
    total_amount: String(order.totalAmount),
    seller_add: PICKUP_ADD,
    seller_name: PICKUP_NAME,
    seller_inv: order.orderId,
    quantity: String(totalQty),
    waybill: "",              // empty = auto-assign by Delhivery
    shipment_width: "10",
    shipment_height: "8",
    weight: String(0.2 * totalQty),
    shipment_length: "15",
    fragile_shipment: false,
  };
}
