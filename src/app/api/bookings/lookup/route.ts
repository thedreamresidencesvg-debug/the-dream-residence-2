import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sendBookingConfirmation } from "@/lib/email";

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, booking_ref, tier_id, check_in, check_out, nights, total_price, guest_name, guest_email, guest_count, special_requests, status, payment_status, confirmation_email_sent")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const tierNames: Record<string, string> = {
    "private-suite": "Private Suite",
    "full-house": "Full House",
    "shared-space": "Shared Space",
  };

  // If booking is still pending, check Stripe and update it
  if (booking.status === "pending") {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.status === "complete" || session.payment_status === "paid") {
        const bookingRef = booking.booking_ref ||
          "DR-" + session.id.replace("cs_", "").substring(0, 8).toUpperCase();

        await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "paid",
            stripe_payment_intent: (session.payment_intent as string) || null,
            booking_ref: bookingRef,
            updated_at: new Date().toISOString(),
          })
          .eq("id", booking.id);

        booking.status = "confirmed";
        booking.payment_status = "paid";
        booking.booking_ref = bookingRef;
      }
    } catch (err) {
      console.error("Failed to check Stripe session:", err);
    }
  }

  // Send confirmation email if not already sent
  if (booking.status === "confirmed" && !booking.confirmation_email_sent) {
    try {
      await sendBookingConfirmation({
        booking_ref: booking.booking_ref || "N/A",
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        tier_name: tierNames[booking.tier_id] || booking.tier_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        nights: booking.nights,
        total_price: booking.total_price,
        guest_count: booking.guest_count,
        special_requests: booking.special_requests,
      });

      // Mark email as sent so we don't send duplicates
      await supabase
        .from("bookings")
        .update({ confirmation_email_sent: true })
        .eq("id", booking.id);
    } catch (emailErr) {
      console.error("Failed to send confirmation email from lookup:", emailErr);
    }
  }

  return NextResponse.json({
    ...booking,
    tier_name: tierNames[booking.tier_id] || booking.tier_id,
  });
}
