import { NextRequest, NextResponse } from "next/server";

/**
 * Coupon definitions.
 * allowedOn: "all" = works everywhere | "non-sale" = blocked on BOGO / sale pages
 */
const COUPONS: Record<string, {
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
};

export async function POST(req: NextRequest) {
  try {
    const { code, orderType } = await req.json() as { code?: string; orderType?: string };

    if (!code) {
      return NextResponse.json({ valid: false, message: "Please enter a coupon code." });
    }

    const upper = code.trim().toUpperCase();
    const coupon = COUPONS[upper];

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid coupon code." });
    }

    // Block sale-only coupons on BOGO / sale pages
    if (coupon.allowedOn === "non-sale" && orderType === "BOGO") {
      return NextResponse.json({ valid: false, message: "This coupon is not valid on sale offers." });
    }

    return NextResponse.json({
      valid: true,
      code: upper,
      type: coupon.type,
      value: coupon.value,
      label: coupon.label,
      message: `Coupon applied — ${coupon.label}!`,
    });
  } catch {
    return NextResponse.json({ valid: false, message: "Something went wrong. Try again." }, { status: 500 });
  }
}
