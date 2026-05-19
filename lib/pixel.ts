/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Meta Pixel event helpers
 * All functions are no-ops on the server or if fbq hasn't loaded yet.
 */

declare global {
  interface Window { fbq?: (...args: any[]) => void; }
}

function fbq(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, data);
  }
}

/** Fire when a product is added to cart */
export function pixelAddToCart(params: {
  productId: string;
  productName: string;
  value: number;
  currency?: string;
}) {
  fbq("AddToCart", {
    content_ids: [params.productId],
    content_name: params.productName,
    content_type: "product",
    value: params.value,
    currency: params.currency ?? "INR",
  });
}

/** Fire when the payment modal opens (user about to pay) */
export function pixelInitiateCheckout(params: {
  value: number;
  numItems: number;
  contentIds: string[];
  currency?: string;
}) {
  fbq("InitiateCheckout", {
    value: params.value,
    num_items: params.numItems,
    content_ids: params.contentIds,
    content_type: "product",
    currency: params.currency ?? "INR",
  });
}

/**
 * Fire once after a confirmed order.
 * Uses sessionStorage to prevent double-firing on page refresh.
 */
export function pixelPurchase(params: {
  orderId: string;
  value: number;
  contentIds: string[];
  currency?: string;
}) {
  const key = `px_purchased_${params.orderId}`;
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(key)) return; // already fired
  sessionStorage.setItem(key, "1");
  fbq("Purchase", {
    value: params.value,
    currency: params.currency ?? "INR",
    content_ids: params.contentIds,
    content_type: "product",
    order_id: params.orderId,
  });
}
