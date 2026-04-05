import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const [
    { count: totalBookings },
    { count: confirmedBookings },
    { count: pendingBookings },
    { count: cancelledBookings },
    { count: blockedDates },
    { count: unreadInquiries },
    { data: revenueData },
    { data: upcoming },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("blocked_dates").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("bookings").select("total_price").eq("payment_status", "paid"),
    supabase.from("bookings")
      .select("booking_ref, guest_name, tier_id, check_in, check_out, guest_count, status")
      .in("status", ["confirmed", "pending"])
      .gte("check_in", new Date().toISOString().split("T")[0])
      .order("check_in", { ascending: true })
      .limit(5),
  ]);

  const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

  return NextResponse.json({
    totalBookings: totalBookings || 0,
    confirmedBookings: confirmedBookings || 0,
    pendingBookings: pendingBookings || 0,
    cancelledBookings: cancelledBookings || 0,
    blockedDates: blockedDates || 0,
    unreadInquiries: unreadInquiries || 0,
    totalRevenue,
    upcoming: upcoming || [],
  });
}
