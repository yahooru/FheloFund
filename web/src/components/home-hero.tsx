"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ConnectCta } from "@/components/connect-cta";

const HomeLottie = dynamic(
  () => import("@/components/home-lottie").then((m) => m.HomeLottie),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] w-full items-center justify-center lg:justify-end">
        <div className="flex h-[280px] w-[280px] flex-col items-center justify-center gap-3 rounded-[2rem] border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--background)_85%,black)] sm:h-[300px] sm:w-[300px]">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--accent)_35%,transparent)] border-t-[var(--primary)]"
            aria-hidden
          />
          <span className="text-xs text-[color-mix(in_srgb,var(--primary)_55%,white)]">Loading animation…</span>
        </div>
      </div>
    ),
  },
);

export function HomeHero() {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
          Ethereum Sepolia · Live contract
        </div>
        <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--primary)] sm:text-5xl lg:text-6xl">
          On-chain fund infrastructure,{" "}
          <span className="text-[color-mix(in_srgb,var(--primary)_92%,white)]">designed to feel production-ready</span>
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-[color-mix(in_srgb,var(--primary)_78%,white)]">
          FheloFund is a share-based ETH vault demo: deposit, hold pro-rata ownership, withdraw, and follow every
          event on-chain. This deployment uses standard Solidity on Sepolia (balances are public); full FHE
          privacy targets Fhenix-class networks.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {["Non-custodial by design", "Manager-gated strategy simulation", "Explorer-friendly activity"].map((x) => (
            <li
              key={x}
              className="flex items-center gap-2 text-sm font-medium text-[color-mix(in_srgb,var(--primary)_85%,white)]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-xs text-[var(--primary)]">
                ✓
              </span>
              {x}
            </li>
          ))}
        </ul>
        <ConnectCta />
        <div className="flex flex-wrap gap-4 pt-2 text-sm">
          <Link
            href="/invest"
            className="font-semibold text-[var(--primary)] underline decoration-[color-mix(in_srgb,var(--primary)_45%,transparent)] underline-offset-4 transition hover:decoration-[var(--primary)]"
          >
            Deposit ETH
          </Link>
          <span className="text-[color-mix(in_srgb,var(--primary)_35%,white)]">·</span>
          <Link
            href="/activity"
            className="font-semibold text-[var(--accent)] underline decoration-[color-mix(in_srgb,var(--accent)_45%,transparent)] underline-offset-4 transition hover:decoration-[var(--accent)]"
          >
            View on-chain activity
          </Link>
        </div>
      </div>
      <HomeLottie />
    </section>
  );
}
