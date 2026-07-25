import { NextRequest, NextResponse } from "next/server";
import { COUPONS } from "@/lib/pricing";

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
