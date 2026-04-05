import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("booking_ref, tier_id, check_in, check_out, nights, total_price, guest_name, guest_email, guest_count, status")
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

  return NextResponse.json({
    ...booking,
    tier_name: tierNames[booking.tier_id] || booking.tier_id,
  });
}
