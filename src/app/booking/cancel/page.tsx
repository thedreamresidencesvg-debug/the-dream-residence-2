"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  XCircle,
  CheckCircle,
  Search,
  Home,
  Loader2,
} from "lucide-react";

interface BookingDetails {
  booking_ref: string;
  tier_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  guest_name: string;
  guest_count: number;
  status: string;
  days_until_checkin: number;
  refund_percent: number;
  refund_amount: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function CancelFlow() {
  const searchParams = useSearchParams();
  const preRef = searchParams.get("ref") || "";
  const preEmail = searchParams.get("email") || "";

  const [ref, setRef] = useState(preRef);
  const [email, setEmail] = useState(preEmail);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [cancelResult, setCancelResult] = useState<{
    refund_percent: number;
    refund_amount: number;
    message: string;
  } | null>(null);

  const lookupBooking = useCallback(async () => {
    if (!ref || !email) return;
    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const res = await fetch(
        `/api/bookings/cancel?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooking(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to look up booking"
      );
    } finally {
      setLoading(false);
    }
  }, [ref, email]);

  useEffect(() => {
    if (preRef && preEmail) {
      lookupBooking();
    }
  }, [preRef, preEmail, lookupBooking]);

  const handleCancel = async () => {
    if (!booking) return;
    setCancelling(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: ref, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCancelResult(data);
      setCancelled(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel booking"
      );
    } finally {
      setCancelling(false);
    }
  };

  if (cancelled && cancelResult) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-3">
          Booking Cancelled
        </h2>
        <p className="text-warm-500 mb-2">
          Your booking <strong className="text-warm-900">{ref}</strong> has been
          cancelled.
        </p>
        <p className="text-warm-600 mb-6">{cancelResult.message}</p>
        {cancelResult.refund_amount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-semibold">
              Refund of {formatCurrency(cancelResult.refund_amount)} USD will be
              processed within 5-10 business days.
            </p>
          </div>
        )}
        <p className="text-warm-500 text-sm mb-6">
          A cancellation confirmation has been sent to your email.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Lookup Form */}
      {!booking && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200">
          <h2 className="text-xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-2">
            Look Up Your Booking
          </h2>
          <p className="text-warm-500 text-sm mb-6">
            Enter your booking reference and email to view and cancel your
            reservation.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">
                Booking Reference
              </label>
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value.toUpperCase())}
                placeholder="DR-XXXXXXXX"
                className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <button
              onClick={lookupBooking}
              disabled={!ref || !email || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? "Looking up..." : "Find Booking"}
            </button>
          </div>
        </div>
      )}

      {/* Booking Details + Cancel */}
      {booking && (
        <div>
          {booking.status === "cancelled" ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-warm-900 mb-2">
                Already Cancelled
              </h3>
              <p className="text-warm-500">
                This booking has already been cancelled.
              </p>
              <button
                onClick={() => setBooking(null)}
                className="mt-4 text-caribbean-600 font-medium hover:underline"
              >
                Look up another booking
              </button>
            </div>
          ) : booking.status === "completed" ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-warm-900 mb-2">
                Stay Completed
              </h3>
              <p className="text-warm-500">
                This booking has been completed and cannot be cancelled.
              </p>
            </div>
          ) : (
            <>
              {/* Booking Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden mb-4">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-warm-900 text-lg">
                      {booking.tier_name}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-warm-500">Reference</span>
                      <span className="font-bold">{booking.booking_ref}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-500">Guest</span>
                      <span className="font-medium">{booking.guest_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-500">Check-in</span>
                      <span className="font-medium">
                        {formatDate(booking.check_in)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-500">Check-out</span>
                      <span className="font-medium">
                        {formatDate(booking.check_out)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-500">Nights</span>
                      <span className="font-medium">{booking.nights}</span>
                    </div>
                    <div className="flex justify-between border-t border-warm-200 pt-3">
                      <span className="font-bold text-warm-900">
                        Total Paid
                      </span>
                      <span className="font-bold text-caribbean-600">
                        {formatCurrency(booking.total_price)} USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Cancellation Policy
                </h4>
                <ul className="text-amber-700 text-sm space-y-1.5">
                  <li
                    className={
                      booking.refund_percent === 100 ? "font-bold" : ""
                    }
                  >
                    {booking.refund_percent === 100 ? "-> " : ""}Free
                    cancellation more than 7 days before check-in (full refund)
                  </li>
                  <li
                    className={
                      booking.refund_percent === 50 ? "font-bold" : ""
                    }
                  >
                    {booking.refund_percent === 50 ? "-> " : ""}50% refund for
                    cancellations 3-7 days before check-in
                  </li>
                  <li
                    className={
                      booking.refund_percent === 0 ? "font-bold" : ""
                    }
                  >
                    {booking.refund_percent === 0 ? "-> " : ""}No refund within
                    3 days of check-in
                  </li>
                </ul>
              </div>

              {/* Refund Preview */}
              <div className="bg-white rounded-xl border border-warm-200 p-4 mb-4">
                <p className="text-warm-600 text-sm mb-1">
                  Your check-in is in{" "}
                  <strong>{booking.days_until_checkin} days</strong>
                </p>
                {booking.refund_amount > 0 ? (
                  <p className="text-green-700 font-semibold">
                    You will receive a {booking.refund_percent}% refund of{" "}
                    {formatCurrency(booking.refund_amount)} USD
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    No refund is applicable for this cancellation
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setBooking(null)}
                  className="flex-1 px-6 py-3 bg-warm-100 text-warm-700 font-semibold rounded-lg hover:bg-warm-200 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {cancelling ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function CancelPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Cancel Booking
          </h1>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Need to change your plans? Look up your booking below.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-center py-12 text-warm-400">Loading...</div>
          }
        >
          <CancelFlow />
        </Suspense>
      </div>
    </div>
  );
}
