"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  XCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

interface Booking {
  id: string;
  booking_ref: string | null;
  tier_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_count: number;
  special_requests: string | null;
  status: string;
  payment_status: string;
  created_at: string;
}

const tierNames: Record<string, string> = {
  "private-suite": "Private Suite",
  "full-house": "Full House",
  "shared-space": "Shared Space",
};

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminBookingsPage() {
  const { loading: authLoading, adminFetch } = useAdmin();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/bookings?status=${filter}&page=${page}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      // handled by useAdmin
    } finally {
      setLoading(false);
    }
  }, [adminFetch, filter, page]);

  useEffect(() => {
    if (!authLoading) loadBookings();
  }, [authLoading, loadBookings]);

  const handleAction = async (bookingId: string, action: string) => {
    if (action === "cancel" && !confirm("Are you sure you want to cancel this booking and issue a full refund?")) {
      return;
    }

    setActionLoading(bookingId);
    try {
      const res = await adminFetch("/api/admin/bookings", {
        method: "PATCH",
        body: JSON.stringify({ booking_id: bookingId, action }),
      });
      const data = await res.json();
      if (data.success) {
        loadBookings();
        setSelectedBooking(null);
      } else {
        alert(data.error || "Action failed");
      }
    } catch {
      alert("Failed to perform action");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="text-caribbean-600 hover:text-caribbean-700 text-sm flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-600" />
            <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
              Manage Bookings
            </h1>
          </div>
          <button onClick={loadBookings} className="text-warm-500 hover:text-warm-700 p-2">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "confirmed", "pending", "cancelled", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white text-warm-600 border border-warm-200 hover:bg-warm-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-warm-200 p-12 text-center text-warm-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No bookings found</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-warm-50">
                    <tr>
                      <th className="text-left p-3 text-warm-500 font-medium">Ref</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Guest</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Room</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Dates</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Total</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Status</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Payment</th>
                      <th className="text-left p-3 text-warm-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t border-warm-100 hover:bg-warm-50">
                        <td className="p-3 font-mono text-xs">{b.booking_ref || b.id.slice(0, 8)}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="text-left hover:text-purple-600"
                          >
                            <p className="font-medium">{b.guest_name}</p>
                            <p className="text-warm-400 text-xs">{b.guest_email}</p>
                          </button>
                        </td>
                        <td className="p-3">{tierNames[b.tier_id] || b.tier_id}</td>
                        <td className="p-3 whitespace-nowrap">
                          <p>{b.check_in}</p>
                          <p className="text-warm-400 text-xs">to {b.check_out} ({b.nights}n)</p>
                        </td>
                        <td className="p-3 font-medium">{formatCurrency(b.total_price)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[b.status] || "bg-warm-100 text-warm-700"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs font-medium ${
                            b.payment_status === "paid" ? "text-green-600" :
                            b.payment_status === "refunded" ? "text-orange-600" :
                            "text-warm-400"
                          }`}>
                            {b.payment_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {b.status === "confirmed" && (
                              <>
                                <button
                                  onClick={() => handleAction(b.id, "complete")}
                                  disabled={actionLoading === b.id}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleAction(b.id, "cancel")}
                                  disabled={actionLoading === b.id}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                  title="Cancel & refund"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {b.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleAction(b.id, "confirm")}
                                  disabled={actionLoading === b.id}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                  title="Confirm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleAction(b.id, "cancel")}
                                  disabled={actionLoading === b.id}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {actionLoading === b.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-warm-400" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 text-warm-500 hover:text-warm-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-warm-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-warm-500 hover:text-warm-700 disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-warm-900">Booking Details</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-warm-400 hover:text-warm-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-500">Reference</span>
                  <span className="font-mono font-bold">{selectedBooking.booking_ref || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Guest Name</span>
                  <span className="font-medium">{selectedBooking.guest_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Email</span>
                  <span>{selectedBooking.guest_email}</span>
                </div>
                {selectedBooking.guest_phone && (
                  <div className="flex justify-between">
                    <span className="text-warm-500">Phone</span>
                    <span>{selectedBooking.guest_phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-warm-500">Room</span>
                  <span className="font-medium">{tierNames[selectedBooking.tier_id]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Check-in</span>
                  <span>{selectedBooking.check_in}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Check-out</span>
                  <span>{selectedBooking.check_out}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Nights</span>
                  <span>{selectedBooking.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Guests</span>
                  <span>{selectedBooking.guest_count}</span>
                </div>
                {selectedBooking.special_requests && (
                  <div>
                    <span className="text-warm-500">Special Requests</span>
                    <p className="mt-1 text-warm-700 bg-warm-50 rounded-lg p-3">{selectedBooking.special_requests}</p>
                  </div>
                )}
                <div className="flex justify-between border-t border-warm-200 pt-3">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-caribbean-600">{formatCurrency(selectedBooking.total_price)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[selectedBooking.status]}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Payment</span>
                  <span className="font-medium">{selectedBooking.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-500">Created</span>
                  <span>{new Date(selectedBooking.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
                <div className="flex gap-2 mt-6">
                  {selectedBooking.status === "confirmed" && (
                    <button
                      onClick={() => handleAction(selectedBooking.id, "complete")}
                      disabled={actionLoading === selectedBooking.id}
                      className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Mark Completed
                    </button>
                  )}
                  {selectedBooking.status === "pending" && (
                    <button
                      onClick={() => handleAction(selectedBooking.id, "confirm")}
                      disabled={actionLoading === selectedBooking.id}
                      className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 text-sm"
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(selectedBooking.id, "cancel")}
                    disabled={actionLoading === selectedBooking.id}
                    className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 text-sm"
                  >
                    Cancel & Refund
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
