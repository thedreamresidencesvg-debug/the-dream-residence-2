import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");

  if (!tier || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: "tier, check_in, and check_out are required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("check_availability", {
    p_tier_id: tier,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }

  return NextResponse.json({ available: data });
}
