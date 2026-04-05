"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

interface BlockedDate {
  id: string;
  tier_id: string | null;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
}

const tierNames: Record<string, string> = {
  "private-suite": "Private Suite",
  "full-house": "Full House",
  "shared-space": "Shared Space",
};

export default function AdminAvailabilityPage() {
  const { loading: authLoading, adminFetch } = useAdmin();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    tier_id: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadDates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/availability");
      const data = await res.json();
      setBlockedDates(data.blocked_dates || []);
    } catch {
      // handled by useAdmin
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (!authLoading) loadDates();
  }, [authLoading, loadDates]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/availability", {
        method: "POST",
        body: JSON.stringify({
          start_date: formData.start_date,
          end_date: formData.end_date,
          tier_id: formData.tier_id || null,
          reason: formData.reason || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setFormData({ start_date: "", end_date: "", tier_id: "", reason: "" });
        loadDates();
      } else {
        alert(data.error || "Failed to block dates");
      }
    } catch {
      alert("Failed to block dates");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this date block?")) return;
    setDeleting(id);
    try {
      const res = await adminFetch("/api/admin/availability", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        loadDates();
      } else {
        alert(data.error || "Failed to remove block");
      }
    } catch {
      alert("Failed to remove block");
    } finally {
      setDeleting(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (authLoading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-caribbean-600 hover:text-caribbean-700 text-sm flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-purple-600" />
            <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
              Manage Availability
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 text-sm transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Block Dates"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAdd} className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  min={formData.start_date || today}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Room (optional)</label>
              <select
                value={formData.tier_id}
                onChange={(e) => setFormData({ ...formData, tier_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
              >
                <option value="">All Rooms</option>
                <option value="private-suite">Private Suite</option>
                <option value="full-house">Full House</option>
                <option value="shared-space">Shared Space</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Reason (optional)</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Maintenance, Personal use"
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Block These Dates"}
            </button>
          </form>
        )}

        {/* Blocked Dates List */}
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          </div>
        ) : blockedDates.length === 0 ? (
          <div className="bg-white rounded-xl border border-warm-200 p-12 text-center text-warm-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No blocked dates</p>
            <p className="text-sm mt-1">All dates are currently available for booking.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedDates.map((bd) => (
              <div key={bd.id} className="bg-white rounded-xl border border-warm-200 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-warm-900">
                      {bd.start_date} &rarr; {bd.end_date}
                    </p>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      {bd.tier_id ? tierNames[bd.tier_id] || bd.tier_id : "All Rooms"}
                    </span>
                  </div>
                  {bd.reason && (
                    <p className="text-warm-500 text-sm">{bd.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(bd.id)}
                  disabled={deleting === bd.id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove block"
                >
                  {deleting === bd.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
