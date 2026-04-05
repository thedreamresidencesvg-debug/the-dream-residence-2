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
    const raw = JSON.parse(JSON.stringify(promo));

    // Return all raw data so we can see the structure
    return NextResponse.json({
      valid: true,
      code: promo.code,
      percent_off: raw.coupon?.percent_off ?? null,
      amount_off: raw.coupon?.amount_off ?? null,
      currency: raw.coupon?.currency || "usd",
      name: raw.coupon?.name || promo.code,
      raw_keys: raw.coupon ? Object.keys(raw.coupon) : "no coupon",
      raw_coupon: raw.coupon,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Discount validation error:", err);
    return NextResponse.json({ error: `Failed to validate code: ${message}` }, { status: 500 });
  }
}
