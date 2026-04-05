import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Generate booking reference
    const bookingRef =
      "DR-" +
      session.id.replace("cs_", "").substring(0, 8).toUpperCase();

    // Update booking status to confirmed
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "paid",
        stripe_payment_intent: session.payment_intent as string,
        booking_ref: bookingRef,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session.id)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update booking:", error);
    }

    // Send confirmation email
    if (booking) {
      const meta = session.metadata || {};
      const tierName =
        meta.tier_id === "private-suite"
          ? "Private Suite"
          : meta.tier_id === "full-house"
          ? "Full House"
          : meta.tier_id === "shared-space"
          ? "Shared Space"
          : meta.tier_id || "Room";

      try {
        await sendBookingConfirmation({
          booking_ref: bookingRef,
          guest_name: booking.guest_name,
          guest_email: booking.guest_email,
          tier_name: tierName,
          check_in: booking.check_in,
          check_out: booking.check_out,
          nights: booking.nights,
          total_price: booking.total_price,
          guest_count: booking.guest_count,
          special_requests: booking.special_requests,
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;

    // Cancel the pending booking
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session.id);

    if (error) {
      console.error("Failed to cancel booking:", error);
    }
  }

  return NextResponse.json({ received: true });
}
