import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Manage Availability" };

export default function AdminAvailabilityPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="text-caribbean-600 hover:text-caribbean-700 text-sm flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <CalendarDays className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
            Manage Availability
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden">
          <div className="p-8 text-center text-warm-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Calendar coming soon</p>
            <p className="text-sm mt-1">Connect Supabase to manage blocked dates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
