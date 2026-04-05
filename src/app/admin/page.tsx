"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  BookOpen,
  Ban,
  LayoutDashboard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  blockedDates: number;
  unreadInquiries: number;
  totalRevenue: number;
  upcoming: {
    booking_ref: string;
    guest_name: string;
    tier_id: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    status: string;
  }[];
}

const tierNames: Record<string, string> = {
  "private-suite": "Private Suite",
  "full-house": "Full House",
  "shared-space": "Shared Space",
};

function formatCurrency(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function AdminDashboard() {
  const { loading: authLoading, adminFetch, logout } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    adminFetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authLoading, adminFetch]);

  if (authLoading || loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-purple-600" />
            <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-warm-500 hover:text-red-600 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-caribbean-100 text-caribbean-700">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-warm-900">{stats?.totalBookings || 0}</p>
            <p className="text-warm-500 text-xs">Total Bookings</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-green-100 text-green-700">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-warm-900">{stats?.confirmedBookings || 0}</p>
            <p className="text-warm-500 text-xs">Confirmed</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-yellow-100 text-yellow-700">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-warm-900">{stats?.pendingBookings || 0}</p>
            <p className="text-warm-500 text-xs">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-red-100 text-red-700">
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-warm-900">{stats?.cancelledBookings || 0}</p>
            <p className="text-warm-500 text-xs">Cancelled</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-purple-100 text-purple-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-warm-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <p className="text-warm-500 text-xs">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-blue-100 text-blue-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-warm-900">{stats?.unreadInquiries || 0}</p>
            <p className="text-warm-500 text-xs">Unread Messages</p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        {stats?.upcoming && stats.upcoming.length > 0 && (
          <div className="bg-white rounded-xl border border-warm-200 shadow-sm mb-8 overflow-hidden">
            <div className="p-4 border-b border-warm-200">
              <h3 className="font-bold text-warm-900">Upcoming Check-ins</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-warm-50">
                  <tr>
                    <th className="text-left p-3 text-warm-500 font-medium">Ref</th>
                    <th className="text-left p-3 text-warm-500 font-medium">Guest</th>
                    <th className="text-left p-3 text-warm-500 font-medium">Room</th>
                    <th className="text-left p-3 text-warm-500 font-medium">Check-in</th>
                    <th className="text-left p-3 text-warm-500 font-medium">Check-out</th>
                    <th className="text-left p-3 text-warm-500 font-medium">Guests</th>
                    <th className="text-left p-3 text-warm-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.upcoming.map((b) => (
                    <tr key={b.booking_ref} className="border-t border-warm-100">
                      <td className="p-3 font-mono text-xs">{b.booking_ref || "—"}</td>
                      <td className="p-3 font-medium">{b.guest_name}</td>
                      <td className="p-3">{tierNames[b.tier_id] || b.tier_id}</td>
                      <td className="p-3">{b.check_in}</td>
                      <td className="p-3">{b.check_out}</td>
                      <td className="p-3">{b.guest_count}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          b.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/bookings"
            className="bg-white rounded-xl p-5 border border-warm-200 shadow-sm hover:border-caribbean-300 transition-colors"
          >
            <BookOpen className="w-6 h-6 text-caribbean-600 mb-2" />
            <h3 className="font-bold text-warm-900 mb-1">Manage Bookings</h3>
            <p className="text-warm-500 text-xs">View, confirm, or cancel guest bookings</p>
          </Link>
          <Link
            href="/admin/availability"
            className="bg-white rounded-xl p-5 border border-warm-200 shadow-sm hover:border-caribbean-300 transition-colors"
          >
            <Ban className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-bold text-warm-900 mb-1">Block Dates</h3>
            <p className="text-warm-500 text-xs">Block dates for maintenance or personal use</p>
          </Link>
          <Link
            href="/admin/inquiries"
            className="bg-white rounded-xl p-5 border border-warm-200 shadow-sm hover:border-caribbean-300 transition-colors relative"
          >
            <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-bold text-warm-900 mb-1">Inquiries</h3>
            <p className="text-warm-500 text-xs">View contact form messages</p>
            {(stats?.unreadInquiries || 0) > 0 && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {stats?.unreadInquiries}
              </span>
            )}
          </Link>
          <Link
            href="/admin/availability"
            className="bg-white rounded-xl p-5 border border-warm-200 shadow-sm hover:border-caribbean-300 transition-colors"
          >
            <CalendarDays className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-bold text-warm-900 mb-1">Calendar View</h3>
            <p className="text-warm-500 text-xs">See all bookings and blocked dates</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
