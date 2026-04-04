"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement Supabase Auth login
    alert("Admin login will be available once Supabase Auth is configured.");
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
            Admin Login
          </h1>
          <p className="text-warm-500 text-sm mt-1">Sign in to manage your property</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none bg-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
