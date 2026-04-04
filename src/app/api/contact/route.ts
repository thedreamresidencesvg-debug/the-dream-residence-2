import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // For now, log the inquiry. When Supabase/Resend are configured,
    // this will save to DB and send email notification.
    console.log("New inquiry:", { name, email, phone, subject, message });

    // TODO: Save to Supabase inquiries table
    // TODO: Send email notification via Resend

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
