"use client";

import { sepolia } from "wagmi/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Card } from "@/components/ui/card";

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return <>{children}</>;
  if (chainId === sepolia.id) return <>{children}</>;

  return (
    <Card className="mx-auto max-w-2xl text-center">
      <p className="mb-2 text-lg font-semibold text-[var(--primary)]">Wrong network</p>
      <p className="mb-6 text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_78%,white)]">
        FheloFund runs on <strong className="text-[var(--primary)]">Ethereum Sepolia</strong>. Switch your
        wallet to Sepolia to read contract state and send transactions.
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchChain?.({ chainId: sepolia.id })}
        className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[0_0_24px_-8px_color-mix(in_srgb,var(--primary)_50%,transparent)] transition hover:brightness-110 disabled:opacity-50"
      >
        {isPending ? "Switching…" : "Switch to Sepolia"}
      </button>
    </Card>
  );
}
