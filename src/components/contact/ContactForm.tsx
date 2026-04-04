"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 px-6 bg-green-50 rounded-2xl border border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-4">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-green-600 font-medium hover:text-green-700 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-warm-700 mb-1.5">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none transition-all bg-white"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1.5">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none transition-all bg-white"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-warm-700 mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none transition-all bg-white"
            placeholder="+1 (784) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-warm-700 mb-1.5">
            Subject
          </label>
          <select
            id="subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none transition-all bg-white"
          >
            <option>General Inquiry</option>
            <option>Booking Question</option>
            <option>Group Booking</option>
            <option>Airport Pickup</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-warm-700 mb-1.5">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-caribbean-400 focus:border-caribbean-400 outline-none transition-all bg-white resize-y"
          placeholder="Tell us how we can help..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">
          Something went wrong. Please try again or contact us via WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
