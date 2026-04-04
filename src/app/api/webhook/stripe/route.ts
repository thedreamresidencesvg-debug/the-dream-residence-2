import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Update booking status to confirmed
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "paid",
        stripe_payment_intent: session.payment_intent as string,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session.id);

    if (error) {
      console.error("Failed to update booking:", error);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;

    // Cancel the pending booking
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session.id);

    if (error) {
      console.error("Failed to cancel booking:", error);
    }
  }

  return NextResponse.json({ received: true });
}
