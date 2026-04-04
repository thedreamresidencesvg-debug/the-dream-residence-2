import { NextRequest, NextResponse } from "next/server";

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

  // TODO: Query Supabase for actual availability
  // For now, return available
  return NextResponse.json({ available: true });
}
