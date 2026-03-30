import { getFundAddress } from "@/lib/env";

export function FundMissingBanner() {
  const addr = getFundAddress();
  if (addr) return null;
  return (
    <div className="border-b border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--background))] px-4 py-3 text-center text-sm text-[color-mix(in_srgb,var(--primary)_90%,white)]">
      <span className="inline-flex items-center gap-2">
        <span className="font-semibold text-[var(--primary)]">Configuration needed</span>
        <span className="hidden sm:inline">—</span>
        <span>
          Set <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[var(--primary)]">NEXT_PUBLIC_FUND_ADDRESS</code> in{" "}
          <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono">web/.env.local</code> after deploying the contract.
        </span>
      </span>
    </div>
  );
}
