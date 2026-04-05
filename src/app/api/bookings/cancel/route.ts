import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sendCancellationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { booking_ref, email } = await req.json();

    if (!booking_ref || !email) {
      return NextResponse.json(
        { error: "Booking reference and email are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Find the booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_ref", booking_ref.toUpperCase())
      .eq("guest_email", email.toLowerCase().trim())
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Booking not found. Please check your reference and email." },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "This booking has already been cancelled." },
        { status: 400 }
      );
    }

    if (booking.status !== "confirmed" && booking.status !== "pending") {
      return NextResponse.json(
        { error: "This booking cannot be cancelled." },
        { status: 400 }
      );
    }

    // Calculate refund based on cancellation policy
    const now = new Date();
    const checkInDate = new Date(booking.check_in + "T12:00:00");
    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let refundPercent = 0;
    let refundMessage = "";

    if (daysUntilCheckIn > 7) {
      refundPercent = 100;
      refundMessage = "Full refund - cancelled more than 7 days before check-in.";
    } else if (daysUntilCheckIn >= 3) {
      refundPercent = 50;
      refundMessage = "50% refund - cancelled 3-7 days before check-in.";
    } else {
      refundPercent = 0;
      refundMessage = "No refund - cancelled within 3 days of check-in.";
    }

    const refundAmount = Math.round((booking.total_price * refundPercent) / 100);

    // Process Stripe refund if applicable
    if (refundAmount > 0 && booking.stripe_payment_intent && booking.payment_status === "paid") {
      try {
        await stripe.refunds.create({
          payment_intent: booking.stripe_payment_intent,
          amount: refundAmount,
        });
      } catch (refundErr) {
        console.error("Stripe refund error:", refundErr);
        return NextResponse.json(
          { error: "Failed to process refund. Please contact us for assistance." },
          { status: 500 }
        );
      }
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        payment_status: refundAmount > 0 ? "refunded" : booking.payment_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id);

    if (updateError) {
      console.error("Failed to update booking:", updateError);
      return NextResponse.json(
        { error: "Failed to cancel booking" },
        { status: 500 }
      );
    }

    // Get tier name for email
    const { data: tier } = await supabase
      .from("tiers")
      .select("name")
      .eq("id", booking.tier_id)
      .single();

    // Send cancellation email
    try {
      await sendCancellationEmail({
        booking_ref: booking.booking_ref,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        tier_name: tier?.name || booking.tier_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        refund_amount: refundAmount,
      });
    } catch (emailErr) {
      console.error("Failed to send cancellation email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      refund_percent: refundPercent,
      refund_amount: refundAmount,
      message: refundMessage,
    });
  } catch (err) {
    console.error("Cancellation error:", err);
    return NextResponse.json(
      { error: "Failed to process cancellation" },
      { status: 500 }
    );
  }
}

// GET endpoint to look up booking details before cancelling
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  const email = searchParams.get("email");

  if (!ref || !email) {
    return NextResponse.json(
      { error: "Reference and email required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("booking_ref, tier_id, check_in, check_out, nights, total_price, guest_name, guest_count, status, payment_status")
    .eq("booking_ref", ref.toUpperCase())
    .eq("guest_email", email.toLowerCase().trim())
    .single();

  if (error || !booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  // Get tier name
  const { data: tier } = await supabase
    .from("tiers")
    .select("name")
    .eq("id", booking.tier_id)
    .single();

  // Calculate refund preview
  const now = new Date();
  const checkInDate = new Date(booking.check_in + "T12:00:00");
  const daysUntilCheckIn = Math.ceil(
    (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  let refundPercent = 0;
  if (daysUntilCheckIn > 7) refundPercent = 100;
  else if (daysUntilCheckIn >= 3) refundPercent = 50;

  return NextResponse.json({
    ...booking,
    tier_name: tier?.name || booking.tier_id,
    days_until_checkin: daysUntilCheckIn,
    refund_percent: refundPercent,
    refund_amount: Math.round((booking.total_price * refundPercent) / 100),
  });
}
