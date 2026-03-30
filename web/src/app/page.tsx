import type { Metadata } from "next";
import Link from "next/link";
import { HomeLottie } from "@/components/home-lottie";
import { ConnectCta } from "@/components/connect-cta";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Home",
};

const highlights = [
  {
    title: "Real on-chain accounting",
    body: "Deposits mint shares, withdrawals burn them, and the manager can simulate P&amp;L — all verifiable on Sepolia.",
  },
  {
    title: "Wallet-native UX",
    body: "No email login. Your address is your identity; connect MetaMask or any injected wallet.",
  },
  {
    title: "Built for what’s next",
    body: "Transparent on this testnet today; CoFHE hooks are included for a path toward Fhenix-style privacy.",
  },
];

const steps = [
  { n: "01", t: "Connect", d: "Switch to Sepolia and connect your wallet." },
  { n: "02", t: "Invest", d: "Deposit test ETH — receive pro-rata fund shares." },
  { n: "03", t: "Track", d: "Use the dashboard and activity feed for live on-chain data." },
  { n: "04", t: "Manage", d: "Authorized manager addresses can record simulated trades." },
];

export default function HomePage() {
  return (
    <div className="space-y-20 sm:space-y-28">
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
            FheloFund is a share-based ETH vault demo: deposit, hold pro-rata ownership, withdraw, and follow
            every event on-chain. This deployment uses standard Solidity on Sepolia (balances are public);
            full FHE privacy targets Fhenix-class networks.
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

      <section className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Why it matters</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--primary)] sm:text-3xl">Clarity without cutting corners</h2>
          <p className="mt-3 text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            Three colors, one coherent system — built so you can demo flows to stakeholders without hiding that
            this is Sepolia-grade transparency.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((h) => (
            <Card key={h.title} glow className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[var(--primary)]">{h.title}</h3>
              <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_72%,white)]">{h.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Flow</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--primary)] sm:text-3xl">How it works</h2>
          <p className="mt-3 text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            Each step maps to real contract calls — no mocked balances in the UI.
          </p>
        </div>
        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--background)_94%,#0a1628)] p-5"
            >
              <span className="font-mono text-sm font-bold text-[var(--accent)]">{s.n}</span>
              <div>
                <p className="font-semibold text-[var(--primary)]">{s.t}</p>
                <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--primary)_72%,white)]">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Card className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--primary)]">Ready to try the full path?</h2>
          <p className="mt-2 max-w-xl text-sm text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            Open the dashboard to load live fund metrics, then invest or withdraw with your connected wallet.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="shrink-0 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[0_0_28px_-8px_color-mix(in_srgb,var(--primary)_50%,transparent)] transition hover:brightness-110"
        >
          Go to dashboard
        </Link>
      </Card>
    </div>
  );
}
