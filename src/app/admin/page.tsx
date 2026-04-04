import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, BookOpen, Ban, LayoutDashboard } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const stats = [
  { label: "Total Bookings", value: "0", icon: BookOpen, color: "bg-caribbean-100 text-caribbean-700" },
  { label: "Upcoming", value: "0", icon: CalendarDays, color: "bg-purple-100 text-purple-700" },
  { label: "Blocked Dates", value: "0", icon: Ban, color: "bg-red-100 text-red-700" },
];

export default function AdminDashboard() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-warm-200 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-warm-900">{stat.value}</p>
              <p className="text-warm-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/bookings"
            className="bg-white rounded-xl p-6 border border-warm-200 shadow-sm hover:border-caribbean-300 transition-colors"
          >
            <BookOpen className="w-6 h-6 text-caribbean-600 mb-2" />
            <h3 className="font-bold text-warm-900 mb-1">Manage Bookings</h3>
            <p className="text-warm-500 text-sm">View, confirm, or cancel guest bookings.</p>
          </Link>
          <Link
            href="/admin/availability"
            className="bg-white rounded-xl p-6 border border-warm-200 shadow-sm hover:border-caribbean-300 transition-colors"
          >
            <CalendarDays className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-bold text-warm-900 mb-1">Manage Availability</h3>
            <p className="text-warm-500 text-sm">Block or unblock dates for maintenance or personal use.</p>
          </Link>
        </div>

        <div className="mt-8 bg-caribbean-50 rounded-xl p-6 border border-caribbean-200">
          <h3 className="font-semibold text-caribbean-900 mb-2">Setup Required</h3>
          <p className="text-caribbean-700 text-sm mb-3">
            To enable full functionality, configure these services:
          </p>
          <ul className="text-caribbean-700 text-sm space-y-1 list-disc list-inside">
            <li>Supabase - Database for bookings and availability</li>
            <li>Stripe - Online payment processing</li>
            <li>Resend - Email notifications</li>
          </ul>
          <p className="text-caribbean-600 text-xs mt-3">
            Add your API keys to <code className="bg-caribbean-100 px-1 py-0.5 rounded">.env.local</code>
          </p>
        </div>
      </div>
    </div>
  );
}
