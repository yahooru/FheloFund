"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WalletButton } from "@/components/wallet-button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invest", label: "Invest" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/manager", label: "Manager" },
  { href: "/activity", label: "Activity" },
  { href: "/privacy-demo", label: "CoFHE" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--background)_82%,black)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-sm font-bold text-[var(--primary)] ring-1 ring-[color-mix(in_srgb,var(--primary)_35%,transparent)] transition group-hover:ring-[var(--primary)]">
            FF
          </span>
          <span className="text-lg font-semibold tracking-tight text-[var(--primary)]">FheloFund</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]"
                    : "text-[color-mix(in_srgb,var(--primary)_78%,white)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <WalletButton />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] text-[var(--primary)] lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--background)_95%,black)] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active ? "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]" : "text-[color-mix(in_srgb,var(--primary)_85%,white)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
