"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[FheloFund] route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--background)_96%,black)] p-8 text-center shadow-[0_0_40px_-16px_color-mix(in_srgb,var(--accent)_25%,transparent)]">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">Something went wrong</p>
      <h1 className="mt-3 text-2xl font-bold text-[var(--primary)]">This page hit an error</h1>
      <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_75%,white)]">
        Try again, or return home. If this persists on Vercel, confirm environment variables are set and redeploy
        (see README).
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-black/40 p-3 text-left font-mono text-xs text-[color-mix(in_srgb,var(--accent)_85%,white)]">
          {error.message}
        </pre>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--background)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)]"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
