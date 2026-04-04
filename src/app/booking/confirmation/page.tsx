"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-3">
          Booking Confirmed!
        </h1>
        <p className="text-warm-500 text-lg mb-2">
          Thank you for booking The Dream Residence.
        </p>
        <p className="text-warm-500 mb-6">
          A confirmation email has been sent. We&apos;ll be in touch with check-in
          details shortly.
        </p>
        {sessionId && (
          <p className="text-warm-400 text-sm mb-6">
            Reference: {sessionId.slice(0, 20)}...
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
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
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-warm-400">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
