import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blocked_dates: data || [] });
}

export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { start_date, end_date, tier_id, reason } = await req.json();

  if (!start_date || !end_date) {
    return NextResponse.json({ error: "start_date and end_date required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("blocked_dates")
    .insert({
      start_date,
      end_date,
      tier_id: tier_id || null,
      reason: reason || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, blocked_date: data });
}

export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
