import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { sendCancellationEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createServerClient();

  let query = supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    bookings: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function PATCH(req: NextRequest) {
  const user = await verifyAdmin(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { booking_id, action } = await req.json();

  if (!booking_id || !action) {
    return NextResponse.json({ error: "booking_id and action required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", booking_id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (action === "cancel") {
    // Process refund if paid
    if (booking.stripe_payment_intent && booking.payment_status === "paid") {
      try {
        await stripe.refunds.create({
          payment_intent: booking.stripe_payment_intent,
        });
      } catch (err) {
        console.error("Refund error:", err);
        return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
      }
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        payment_status: booking.payment_status === "paid" ? "refunded" : booking.payment_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get tier name
    const tierNames: Record<string, string> = {
      "private-suite": "Private Suite",
      "full-house": "Full House",
      "shared-space": "Shared Space",
    };

    try {
      await sendCancellationEmail({
        booking_ref: booking.booking_ref || "N/A",
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        tier_name: tierNames[booking.tier_id] || booking.tier_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        refund_amount: booking.payment_status === "paid" ? booking.total_price : 0,
      });
    } catch {
      // Email failure shouldn't block the cancellation
    }

    return NextResponse.json({ success: true, action: "cancelled" });
  }

  if (action === "confirm") {
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: "confirmed" });
  }

  if (action === "complete") {
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: "completed" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
