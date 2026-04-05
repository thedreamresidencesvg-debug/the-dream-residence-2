"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAdmin() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    setToken(stored);
    setLoading(false);
  }, [router]);

  const adminFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const t = token || localStorage.getItem("admin_token");
      if (!t) {
        router.push("/admin/login");
        throw new Error("Not authenticated");
      }

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
          ...options.headers,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        throw new Error("Session expired");
      }

      return res;
    },
    [token, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }, [router]);

  return { token, loading, adminFetch, logout };
}
