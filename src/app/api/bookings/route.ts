import { NextRequest, NextResponse } from "next/server";

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

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 }
      );
    }

    // Validate tier
    const validTiers = ["private-suite", "full-house", "shared-space"];
    if (!validTiers.includes(tier_id)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const bookingId = "TDR-" + Date.now().toString(36).toUpperCase();

    console.log("New booking:", {
      bookingId,
      tier_id,
      check_in,
      check_out,
      guest_name,
      guest_email,
      guest_phone,
      guest_count,
      special_requests,
    });

    // TODO: Check availability via Supabase
    // TODO: Create Stripe Checkout session
    // TODO: Save booking to Supabase
    // TODO: Send confirmation email via Resend

    // For now, return success with booking ID
    return NextResponse.json({
      success: true,
      booking_id: bookingId,
      // checkout_url will be set when Stripe is configured
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
