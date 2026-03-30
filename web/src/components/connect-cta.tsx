"use client";

import Link from "next/link";
import { WalletButton } from "@/components/wallet-button";

export function ConnectCta() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <WalletButton />
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
        >
          Open dashboard
        </Link>
        <Link
          href="/invest"
          className="inline-flex items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_40%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]"
        >
          Start investing
        </Link>
      </div>
    </div>
  );
}
