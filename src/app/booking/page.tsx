"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import {
  Check,
  Calendar,
  User,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { tiers, getTierById, type BookingTier } from "@/data/tiers";
import { formatCurrency, calculateNights, formatDate } from "@/lib/utils";

const STEPS = ["Select Room", "Choose Dates", "Your Details", "Review & Pay"];

function BookingFlow() {
  const searchParams = useSearchParams();
  const preselectedTier = searchParams.get("tier");

  const [step, setStep] = useState(preselectedTier ? 1 : 0);
  const [selectedTier, setSelectedTier] = useState<BookingTier | null>(
    preselectedTier ? getTierById(preselectedTier) || null : null
  );
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    requests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0;
  const total = selectedTier ? selectedTier.price * nights : 0;

  const today = new Date().toISOString().split("T")[0];

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!selectedTier;
      case 1:
        return checkIn && checkOut && nights > 0;
      case 2:
        return guestInfo.name && guestInfo.email && guestInfo.guests > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedTier) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier_id: selectedTier.id,
          check_in: checkIn,
          check_out: checkOut,
          guest_name: guestInfo.name,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          guest_count: guestInfo.guests,
          special_requests: guestInfo.requests,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }

      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      setBookingRef(data.booking_id || "TDR-" + Date.now().toString(36).toUpperCase());
      setBookingComplete(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-3">
          Booking Submitted!
        </h2>
        <p className="text-warm-500 text-lg mb-2">
          Your booking reference: <strong className="text-warm-900">{bookingRef}</strong>
        </p>
        <p className="text-warm-500 mb-8">
          We&apos;ve sent a confirmation to <strong>{guestInfo.email}</strong>.
          You&apos;ll hear from us within 24 hours.
        </p>
        <div className="bg-warm-50 rounded-2xl p-6 border border-warm-200 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-warm-900 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-warm-500">Room</span>
              <span className="font-medium">{selectedTier?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-500">Check-in</span>
              <span className="font-medium">{formatDate(new Date(checkIn))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-500">Check-out</span>
              <span className="font-medium">{formatDate(new Date(checkOut))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-500">Nights</span>
              <span className="font-medium">{nights}</span>
            </div>
            <div className="flex justify-between border-t border-warm-200 pt-2 mt-2">
              <span className="font-semibold text-warm-900">Total</span>
              <span className="font-bold text-caribbean-600">{formatCurrency(total)} USD</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i < step
                    ? "bg-caribbean-400 text-warm-900"
                    : i === step
                    ? "bg-purple-600 text-white"
                    : "bg-warm-200 text-warm-500"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  i === step ? "font-semibold text-warm-900" : "text-warm-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-warm-300" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {/* Step 0: Select Tier */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-6 text-center">
              Choose Your Room Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
                    selectedTier?.id === tier.id
                      ? "border-caribbean-400 ring-2 ring-caribbean-400/20 shadow-lg"
                      : "border-warm-200 hover:border-warm-300"
                  }`}
                >
                  <div className="relative h-36">
                    <Image src={tier.image} alt={tier.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    {selectedTier?.id === tier.id && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-caribbean-400 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-warm-900" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-warm-900">{tier.name}</h3>
                    <p className="text-caribbean-600 font-bold text-lg">{formatCurrency(tier.price)}<span className="text-warm-400 text-sm font-normal"> / night</span></p>
                    <p className="text-warm-500 text-sm mt-1">{tier.shortDescription}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Dates */}
        {step === 1 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-6 text-center">
              Select Your Dates
            </h2>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-5">
              <div>
                <label htmlFor="checkin" className="block text-sm font-medium text-warm-700 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1.5" />Check-in Date
                </label>
                <input
                  id="checkin"
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white"
                />
              </div>
              <div>
                <label htmlFor="checkout" className="block text-sm font-medium text-warm-700 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1.5" />Check-out Date
                </label>
                <input
                  id="checkout"
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={!checkIn}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white disabled:opacity-50"
                />
              </div>
              {nights > 0 && (
                <div className="bg-caribbean-50 rounded-xl p-4 text-center">
                  <p className="text-warm-600 text-sm">
                    {nights} night{nights > 1 ? "s" : ""} &times;{" "}
                    {formatCurrency(selectedTier!.price)} ={" "}
                    <strong className="text-caribbean-700 text-lg">{formatCurrency(total)} USD</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Guest Info */}
        {step === 2 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-6 text-center">
              Guest Information
            </h2>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-5">
              <div>
                <label htmlFor="gname" className="block text-sm font-medium text-warm-700 mb-1.5">
                  <User className="w-4 h-4 inline mr-1.5" />Full Name *
                </label>
                <input
                  id="gname"
                  type="text"
                  required
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label htmlFor="gemail" className="block text-sm font-medium text-warm-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="gemail"
                  type="email"
                  required
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="gphone" className="block text-sm font-medium text-warm-700 mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  id="gphone"
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white"
                  placeholder="+1 (000) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="gcount" className="block text-sm font-medium text-warm-700 mb-1.5">
                  Number of Guests *
                </label>
                <select
                  id="gcount"
                  value={guestInfo.guests}
                  onChange={(e) => setGuestInfo({ ...guestInfo, guests: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white"
                >
                  {Array.from({ length: selectedTier?.maxGuests || 6 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="greqs" className="block text-sm font-medium text-warm-700 mb-1.5">
                  Special Requests
                </label>
                <textarea
                  id="greqs"
                  rows={3}
                  value={guestInfo.requests}
                  onChange={(e) => setGuestInfo({ ...guestInfo, requests: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none bg-white resize-y"
                  placeholder="Airport pickup, early check-in, dietary needs, etc."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && selectedTier && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-6 text-center">
              Review Your Booking
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
              <div className="relative h-40">
                <Image src={selectedTier.image} alt={selectedTier.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-xl">{selectedTier.name}</h3>
                  <p className="text-white/80 text-sm">{formatCurrency(selectedTier.price)} USD / night</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-warm-500 text-sm">Check-in</p>
                    <p className="font-semibold">{formatDate(new Date(checkIn))}</p>
                  </div>
                  <div>
                    <p className="text-warm-500 text-sm">Check-out</p>
                    <p className="font-semibold">{formatDate(new Date(checkOut))}</p>
                  </div>
                  <div>
                    <p className="text-warm-500 text-sm">Guest</p>
                    <p className="font-semibold">{guestInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-warm-500 text-sm">Guests</p>
                    <p className="font-semibold">{guestInfo.guests}</p>
                  </div>
                </div>
                {guestInfo.requests && (
                  <div>
                    <p className="text-warm-500 text-sm">Special Requests</p>
                    <p className="text-warm-700 text-sm">{guestInfo.requests}</p>
                  </div>
                )}
                <div className="border-t border-warm-200 pt-4">
                  <div className="flex justify-between text-sm text-warm-500 mb-1">
                    <span>{formatCurrency(selectedTier.price)} &times; {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-caribbean-600">{formatCurrency(total)} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <h4 className="font-semibold text-amber-800 text-sm mb-2">Cancellation Policy</h4>
              <ul className="text-amber-700 text-xs space-y-1">
                <li>Free cancellation up to 7 days before check-in (full refund)</li>
                <li>50% refund for cancellations 3-7 days before check-in</li>
                <li>No refund within 3 days of check-in</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-lg mx-auto">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 text-warm-600 hover:text-warm-900 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-all shadow-md disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              {isSubmitting ? "Processing..." : `Pay ${formatCurrency(total)} USD`}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function BookingPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Book Your Stay
          </h1>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Secure your Caribbean getaway in just a few steps.
          </p>
        </div>
        <Suspense fallback={<div className="text-center py-12 text-warm-400">Loading...</div>}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
