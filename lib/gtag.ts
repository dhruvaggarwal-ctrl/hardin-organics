/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GA4 (gtag.js) ecommerce event helpers.
 * All functions are no-ops on the server or if gtag hasn't loaded yet.
 * Uses GA4's standard ecommerce event names/params so Google Ads can
 * later import "purchase" as a conversion action straight from GA4.
 */

declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}

function gtag(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, data);
  }
}

interface GAItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

/** Fire when a product is added to cart */
export function gaAddToCart(params: {
  productId: string;
  productName: string;
  value: number;
  quantity?: number;
  currency?: string;
}) {
  gtag("add_to_cart", {
    currency: params.currency ?? "INR",
    value: params.value,
    items: [{
      item_id: params.productId,
      item_name: params.productName,
      price: params.value / (params.quantity ?? 1),
      quantity: params.quantity ?? 1,
    }],
  });
}

/** Fire when the payment modal opens (user about to pay) */
export function gaBeginCheckout(params: {
  value: number;
  items: GAItem[];
  currency?: string;
}) {
  gtag("begin_checkout", {
    currency: params.currency ?? "INR",
    value: params.value,
    items: params.items,
  });
}

/**
 * Fire once after a confirmed order.
 * Uses sessionStorage to prevent double-firing on page refresh.
 */
export function gaPurchase(params: {
  orderId: string;
  value: number;
  items: GAItem[];
  currency?: string;
}) {
  const key = `ga_purchased_${params.orderId}`;
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(key)) return; // already fired
  sessionStorage.setItem(key, "1");
  gtag("purchase", {
    transaction_id: params.orderId,
    value: params.value,
    currency: params.currency ?? "INR",
    items: params.items,
  });
}
