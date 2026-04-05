import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  try {
    const promos = await stripe.promotionCodes.list({
      code: code.trim(),
      active: true,
      limit: 1,
    });

    if (promos.data.length === 0) {
      return NextResponse.json({ error: "Invalid or expired discount code" }, { status: 404 });
    }

    const promo = promos.data[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fp = promo as any;

    // In newer Stripe API versions, coupon may be under "promotion" or accessed differently
    // Try to get the coupon/promotion ID and retrieve it
    const promotionId = fp.promotion;
    const couponObj = fp.coupon;

    // Try coupon field first (older API)
    if (couponObj && typeof couponObj === "object" && couponObj.percent_off !== undefined) {
      return NextResponse.json({
        valid: true,
        code: promo.code,
        percent_off: couponObj.percent_off,
        amount_off: couponObj.amount_off,
        currency: couponObj.currency || "usd",
        name: couponObj.name || promo.code,
      });
    }

    // If promotion field exists, it might be the coupon/discount ID
    if (promotionId) {
      // Try retrieving as a coupon
      try {
        const coupon = await stripe.coupons.retrieve(promotionId);
        return NextResponse.json({
          valid: true,
          code: promo.code,
          percent_off: coupon.percent_off ?? null,
          amount_off: coupon.amount_off ?? null,
          currency: coupon.currency || "usd",
          name: coupon.name || promo.code,
        });
      } catch {
        // Not a coupon ID, continue
      }
    }

    // Fallback: list all coupons and find one that matches this promo
    const coupons = await stripe.coupons.list({ limit: 100 });
    for (const coupon of coupons.data) {
      // Check if any promo code under this coupon matches our code
      const promoCheck = await stripe.promotionCodes.list({
        coupon: coupon.id,
        code: code.trim(),
        limit: 1,
      });
      if (promoCheck.data.length > 0) {
        return NextResponse.json({
          valid: true,
          code: promo.code,
          percent_off: coupon.percent_off ?? null,
          amount_off: coupon.amount_off ?? null,
          currency: coupon.currency || "usd",
          name: coupon.name || promo.code,
        });
      }
    }

    // If we still can't find coupon details, return what we have
    return NextResponse.json({
      valid: true,
      code: promo.code,
      percent_off: null,
      amount_off: null,
      currency: "usd",
      name: promo.code,
      debug_promotion: String(promotionId),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Discount validation error:", err);
    return NextResponse.json({ error: `Failed to validate code: ${message}` }, { status: 500 });
  }
}
