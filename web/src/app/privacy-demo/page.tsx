import Link from "next/link";
import { CofheDemoPanel } from "@/components/cofhe-demo-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function PrivacyDemoPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Fhenix · CoFHE"
        title="CoFHE client demo"
        description="This page explains how the Fhenix CoFHE SDK fits next to the transparent Sepolia fund. The deployed FheloFund contract does not use on-chain FHE; use this SDK when you move to Fhenix-ready flows."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card glow>
          <h2 className="text-lg font-semibold text-[var(--primary)]">Sepolia deployment</h2>
          <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            The live app uses standard Solidity: balances and events are visible to everyone. That keeps the
            demo auditable and easy to debug while you iterate on product and UX.
          </p>
        </Card>
        <Card glow>
          <h2 className="text-lg font-semibold text-[var(--primary)]">Future privacy layer</h2>
          <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            For encrypted amounts and strategy on-chain, you would deploy FHE-aware contracts on a Fhenix-class
            network and use CoFHE for client-side encryption and permits.
          </p>
        </Card>
      </div>

      <CofheDemoPanel />

      <p className="text-sm text-[color-mix(in_srgb,var(--primary)_60%,white)]">
        <Link href="/" className="font-semibold text-[var(--primary)] hover:underline">
          ← Back home
        </Link>
      </p>
    </div>
  );
}
