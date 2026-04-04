import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-[family-name:var(--font-heading)] font-bold text-caribbean-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-warm-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to paradise.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
