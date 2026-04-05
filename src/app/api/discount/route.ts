import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  try {
    // List promotion codes with expanded coupon
    const promos = await stripe.promotionCodes.list({
      code: code.trim(),
      active: true,
      limit: 1,
    });

    if (promos.data.length === 0) {
      return NextResponse.json({ error: "Invalid or expired discount code" }, { status: 404 });
    }

    const promo = promos.data[0];
    const promoId = promo.id;

    // Retrieve the single promotion code with coupon expanded
    const fullPromo = await stripe.promotionCodes.retrieve(promoId, {
      expand: ["coupon"],
    });

    // Try multiple ways to get coupon data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fp = fullPromo as any;
    const couponObj = fp.coupon;

    // If coupon is a string ID, retrieve it
    if (typeof couponObj === "string") {
      const coupon = await stripe.coupons.retrieve(couponObj);
      return NextResponse.json({
        valid: true,
        code: promo.code,
        percent_off: coupon.percent_off ?? null,
        amount_off: coupon.amount_off ?? null,
        currency: coupon.currency || "usd",
        name: coupon.name || promo.code,
      });
    }

    // If coupon is an object with data
    if (couponObj && typeof couponObj === "object") {
      return NextResponse.json({
        valid: true,
        code: promo.code,
        percent_off: couponObj.percent_off ?? null,
        amount_off: couponObj.amount_off ?? null,
        currency: couponObj.currency || "usd",
        name: couponObj.name || promo.code,
      });
    }

    // Last resort: return all keys for debugging
    return NextResponse.json({
      valid: true,
      code: promo.code,
      percent_off: null,
      amount_off: null,
      currency: "usd",
      name: promo.code,
      debug_promo_keys: Object.keys(fullPromo),
      debug_promo_id: promoId,
      debug_coupon_type: typeof couponObj,
      debug_coupon_value: String(couponObj),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Discount validation error:", err);
    return NextResponse.json({ error: `Failed to validate code: ${message}` }, { status: 500 });
  }
}
