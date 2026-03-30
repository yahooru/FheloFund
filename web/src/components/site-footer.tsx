import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invest", label: "Invest" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/activity", label: "Activity" },
  { href: "/privacy-demo", label: "CoFHE" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--background)_88%,black)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-lg font-semibold text-[var(--primary)]">FheloFund</p>
          <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_72%,white)]">
            Wallet-native fund demo on Ethereum Sepolia. Deposits, shares, and manager actions are real
            on-chain transactions.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[color-mix(in_srgb,var(--primary)_80%,white)] transition hover:text-[var(--primary)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[color-mix(in_srgb,var(--accent)_12%,transparent)] py-4 text-center text-xs text-[color-mix(in_srgb,var(--primary)_45%,white)]">
        Sepolia testnet · Balances are public on-chain · Built with Next.js & wagmi
      </div>
    </footer>
  );
}
