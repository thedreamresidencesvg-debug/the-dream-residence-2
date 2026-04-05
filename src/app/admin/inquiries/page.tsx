"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Loader2,
  Mail,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const { loading: authLoading, adminFetch } = useAdmin();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/inquiries");
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (!authLoading) loadInquiries();
  }, [authLoading, loadInquiries]);

  const toggleRead = async (id: string, isRead: boolean) => {
    try {
      await adminFetch("/api/admin/inquiries", {
        method: "PATCH",
        body: JSON.stringify({ id, is_read: !isRead }),
      });
      loadInquiries();
    } catch {
      // handled
    }
  };

  const openInquiry = async (inquiry: Inquiry) => {
    setSelected(inquiry);
    if (!inquiry.is_read) {
      await adminFetch("/api/admin/inquiries", {
        method: "PATCH",
        body: JSON.stringify({ id: inquiry.id, is_read: true }),
      });
      loadInquiries();
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
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-caribbean-600 hover:text-caribbean-700 text-sm flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
            Inquiries
          </h1>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-warm-200 p-12 text-center text-warm-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No inquiries yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition-colors ${
                  inq.is_read ? "border-warm-200" : "border-purple-300 bg-purple-50/30"
                }`}
                onClick={() => openInquiry(inq)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!inq.is_read && (
                        <span className="w-2 h-2 bg-purple-600 rounded-full shrink-0" />
                      )}
                      <p className="font-semibold text-warm-900 truncate">{inq.name}</p>
                      <span className="text-warm-400 text-xs shrink-0">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-warm-700 text-sm font-medium truncate">{inq.subject}</p>
                    <p className="text-warm-500 text-sm truncate">{inq.message}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRead(inq.id, inq.is_read); }}
                    className="p-2 text-warm-400 hover:text-purple-600 shrink-0"
                    title={inq.is_read ? "Mark unread" : "Mark read"}
                  >
                    {inq.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-warm-900">{selected.subject}</h3>
                <button onClick={() => setSelected(null)} className="text-warm-400 hover:text-warm-600 text-sm">
                  Close
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-warm-900">{selected.name}</span>
                  <span className="text-warm-400">
                    {new Date(selected.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-warm-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selected.email}`} className="text-purple-600 hover:underline">
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm text-warm-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${selected.phone}`} className="text-purple-600 hover:underline">
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-warm-50 rounded-xl p-4">
                <p className="text-warm-700 text-sm whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex-1 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 text-sm text-center"
                >
                  Reply via Email
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 text-sm text-center"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
