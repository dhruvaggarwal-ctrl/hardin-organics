import { products } from "@/data/products";

/**
 * Single source of truth for coupon + bundle discount codes.
 * Percent-based so bundle savings stay correct automatically if product
 * prices change — imported by both the client-facing validate route and
 * the server-side order pricer below, so they can never drift apart.
 */
export const COUPONS: Record<string, {
  type: "percent" | "fixed";
  value: number;           // percent: 0-100 | fixed: rupee amount
  allowedOn: "all" | "non-sale";
  label: string;
}> = {
  WELCOME10: {
    type: "percent",
    value: 10,
    allowedOn: "non-sale",
    label: "10% off",
  },
  STARTERDUO16: {
    type: "percent",
    value: 16,
    allowedOn: "all",
    label: "Starter Duo — 16% off",
  },
  DOUBLEUP25: {
    type: "percent",
    value: 25,
    allowedOn: "all",
    label: "Double Up Pack — 25% off",
  },
};

/** localStorage key used to hand a bundle's coupon code from a "Buy Bundle" button to the checkout page. */
export const PENDING_COUPON_KEY = "hardin_pending_coupon";

export const FREE_SHIPPING_THRESHOLD = 399;
export const MULTI_ITEM_DISCOUNT = 50;
export const FLAT_SHIPPING_FEE = 60;

export interface OrderItemInput {
  id: string;
  quantity: number;
  price: number;
}

export interface VerifiedPricing {
  valid: boolean;
  error?: string;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  couponDiscount: number;
  shipping: number;
  total: number;
}

/**
 * Recomputes the authoritative order total from catalog data.
 * Never trust client-supplied subtotal/discount/totalAmount for anything
 * that touches money (Razorpay order amount, Delhivery COD amount, etc.) —
 * always run the cart through this first.
 */
export function verifyAndPriceOrder(
  items: OrderItemInput[],
  couponCode: string | null | undefined,
  orderType: string = "regular"
): VerifiedPricing {
  const empty: VerifiedPricing = {
    valid: false,
    subtotal: 0,
    discount: 0,
    couponCode: null,
    couponDiscount: 0,
    shipping: 0,
    total: 0,
  };

  if (!Array.isArray(items) || items.length === 0) {
    return { ...empty, error: "Cart is empty." };
  }

  let subtotal = 0;
  let totalItems = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    if (!product) return { ...empty, error: `Unknown product: ${item.id}` };

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 50) {
      return { ...empty, error: `Invalid quantity for ${item.id}` };
    }

    const validPrices = [product.price, ...product.sizes.map((s) => s.price)];
    const claimedPrice = Number(item.price);
    if (!validPrices.includes(claimedPrice)) {
      return { ...empty, error: `Price mismatch for ${item.id}` };
    }

    subtotal += claimedPrice * quantity;
    totalItems += quantity;
  }

  const discount = totalItems >= 2 ? MULTI_ITEM_DISCOUNT : 0;
  const discountedSubtotal = subtotal - discount;

  let couponDiscount = 0;
  let verifiedCouponCode: string | null = null;
  if (couponCode) {
    const upper = String(couponCode).trim().toUpperCase();
    const coupon = COUPONS[upper];
    if (coupon) {
      const isValidForOrderType = !(coupon.allowedOn === "non-sale" && orderType === "BOGO");
      if (isValidForOrderType) {
        verifiedCouponCode = upper;
        couponDiscount = coupon.type === "percent"
          ? Math.round(discountedSubtotal * coupon.value / 100)
          : Math.min(coupon.value, discountedSubtotal);
      }
    }
  }

  const afterCoupon = discountedSubtotal - couponDiscount;
  const shipping = afterCoupon >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = afterCoupon + shipping;

  return {
    valid: true,
    subtotal,
    discount,
    couponCode: verifiedCouponCode,
    couponDiscount,
    shipping,
    total,
  };
}
