"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Home, XCircle, Loader2 } from "lucide-react";

interface BookingInfo {
  booking_ref: string;
  tier_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  guest_name: string;
  guest_email: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Poll for booking details (webhook may take a moment)
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      try {
        const res = await fetch(`/api/bookings/lookup?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.booking_ref) {
            setBooking(data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore, will retry
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      } else {
        setLoading(false);
      }
    };

    poll();
  }, [sessionId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-3">
          Booking Confirmed!
        </h1>
        <p className="text-warm-500 text-lg mb-2">
          Thank you for booking The Dream Residence.
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-warm-400 my-6">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading booking details...</span>
          </div>
        ) : booking ? (
          <>
            {/* Booking Reference */}
            <div className="bg-caribbean-50 border-2 border-caribbean-300 rounded-xl p-4 my-6">
              <p className="text-warm-500 text-sm mb-1">Your Booking Reference</p>
              <p className="text-3xl font-bold text-caribbean-700 tracking-wider">{booking.booking_ref}</p>
              <p className="text-warm-400 text-xs mt-1">Save this for your records</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-warm-50 rounded-2xl p-6 border border-warm-200 text-left mb-6">
              <h3 className="font-semibold text-warm-900 mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-500">Room</span>
                  <span className="font-medium">{booking.tier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Guest</span>
                  <span className="font-medium">{booking.guest_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Check-in</span>
                  <span className="font-medium">{formatDate(booking.check_in)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Check-out</span>
                  <span className="font-medium">{formatDate(booking.check_out)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Nights</span>
                  <span className="font-medium">{booking.nights}</span>
                </div>
                <div className="flex justify-between border-t border-warm-200 pt-2 mt-2">
                  <span className="font-semibold text-warm-900">Total Paid</span>
                  <span className="font-bold text-caribbean-600">
                    {formatCurrency(booking.total_price)} USD
                  </span>
                </div>
              </div>
            </div>

            <p className="text-warm-500 text-sm mb-6">
              A confirmation email with your booking details has been sent to{" "}
              <strong>{booking.guest_email}</strong>.
            </p>
          </>
        ) : (
          <>
            <p className="text-warm-500 mb-2">
              A confirmation email has been sent. We&apos;ll be in touch with check-in
              details shortly.
            </p>
            {sessionId && (
              <p className="text-warm-400 text-sm mb-6">
                Reference: {sessionId.slice(0, 20)}...
              </p>
            )}
          </>
        )}

        {/* Cancellation Policy */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
          <h4 className="font-semibold text-amber-800 text-sm mb-2">Cancellation Policy</h4>
          <ul className="text-amber-700 text-xs space-y-1">
            <li>Free cancellation up to 7 days before check-in (full refund)</li>
            <li>50% refund for cancellations 3-7 days before check-in</li>
            <li>No refund within 3 days of check-in</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/booking/cancel"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-100 text-warm-700 font-semibold rounded-lg hover:bg-warm-200 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Cancel Booking
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-warm-100 text-warm-700 font-semibold rounded-lg hover:bg-warm-200 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-warm-400">
          Loading...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
