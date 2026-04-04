import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { getTierById } from "@/data/tiers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tier_id,
      check_in,
      check_out,
      guest_name,
      guest_email,
      guest_phone,
      guest_count,
      special_requests,
    } = body;

    // Validate required fields
    if (!tier_id || !check_in || !check_out || !guest_name || !guest_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate tier
    const tier = getTierById(tier_id);
    if (!tier) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 }
      );
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = tier.price * nights * 100; // Convert to cents

    const supabase = createServerClient();

    // Check availability
    const { data: available, error: availError } = await supabase.rpc(
      "check_availability",
      { p_tier_id: tier_id, p_check_in: check_in, p_check_out: check_out }
    );

    if (availError || !available) {
      return NextResponse.json(
        { error: "Selected dates are not available for this room type" },
        { status: 409 }
      );
    }

    // Create Stripe Checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: guest_email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `The Dream Residence - ${tier.name}`,
              description: `${nights} night${nights > 1 ? "s" : ""} (${check_in} to ${check_out})`,
              images: [`${siteUrl}${tier.image}`],
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tier_id,
        check_in,
        check_out,
        guest_name,
        guest_phone: guest_phone || "",
        guest_count: String(guest_count || 1),
        special_requests: special_requests || "",
      },
      success_url: `${siteUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/booking?tier=${tier_id}`,
    });

    // Save booking as pending
    const { error: insertError } = await supabase.from("bookings").insert({
      tier_id,
      check_in,
      check_out,
      total_price: totalPrice,
      guest_name,
      guest_email,
      guest_phone: guest_phone || null,
      guest_count: guest_count || 1,
      special_requests: special_requests || null,
      status: "pending",
      stripe_session_id: session.id,
      payment_status: "unpaid",
    });

    if (insertError) {
      console.error("Booking insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
    });
  } catch (err) {
    console.error("Booking error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const keyHint = process.env.STRIPE_SECRET_KEY
      ? `key starts with: ${process.env.STRIPE_SECRET_KEY.substring(0, 8)}... (length: ${process.env.STRIPE_SECRET_KEY.length})`
      : "STRIPE_SECRET_KEY is not set";
    return NextResponse.json(
      { error: `Failed to create booking: ${message} [${keyHint}]` },
      { status: 500 }
    );
  }
}
