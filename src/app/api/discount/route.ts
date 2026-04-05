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
    const raw = promo as any;
    const couponId = typeof raw.coupon === "string" ? raw.coupon : raw.coupon?.id;

    const coupon = await stripe.coupons.retrieve(couponId);

    return NextResponse.json({
      valid: true,
      code: promo.code,
      percent_off: coupon.percent_off || null,
      amount_off: coupon.amount_off || null,
      currency: coupon.currency || "usd",
      name: coupon.name || promo.code,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Discount validation error:", err);
    return NextResponse.json({ error: `Failed to validate code: ${message}` }, { status: 500 });
  }
}
