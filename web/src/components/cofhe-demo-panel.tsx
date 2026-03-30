"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export function CofheDemoPanel() {
  const [status, setStatus] = useState<string | null>(null);

  async function loadConfig() {
    setStatus("Loading…");
    try {
      const { createCofheConfig } = await import("@cofhe/sdk/web");
      const { chains } = await import("@cofhe/sdk/chains");
      const config = createCofheConfig({
        supportedChains: [chains.sepolia],
      });
      setStatus(
        `CoFHE config OK for Sepolia (chain id ${chains.sepolia.id}). Environment: ${chains.sepolia.environment}. Use this as a starting point when wiring encrypted inputs to Fhenix-ready contracts.`,
      );
      void config;
    } catch {
      setStatus("Could not initialize the demo in this browser. Try again or use a modern desktop browser.");
    }
  }

  return (
    <Card glow className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[var(--primary)]">Initialize CoFHE in the browser</h2>
        <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_78%,white)]">
          The <strong className="text-[var(--primary)]">@cofhe/sdk</strong> package is bundled for web. Click below
          to validate configuration for Sepolia (requires a browser context — not Node).
        </p>
      </div>
      <button
        type="button"
        onClick={loadConfig}
        className="rounded-xl border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-5 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[color-mix(in_srgb,var(--primary)_16%,transparent)]"
      >
        Initialize CoFHE config (client)
      </button>
      {status && (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--background)_100%,black)] p-4 text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_82%,white)]">
          {status}
        </div>
      )}
    </Card>
  );
}
