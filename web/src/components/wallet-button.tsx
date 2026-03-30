"use client";

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
import { friendlyConnectError } from "@/lib/user-errors";

function shortAddress(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => {
            const injected = connectors.find((c) => c.id === "injected" || c.name === "Injected");
            if (injected) connect({ connector: injected });
            else if (connectors[0]) connect({ connector: connectors[0] });
          }}
          disabled={isPending}
          className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] shadow-[0_0_20px_-6px_color-mix(in_srgb,var(--primary)_45%,transparent)] transition hover:brightness-110 disabled:opacity-50"
        >
          {isPending ? "Connecting…" : "Connect wallet"}
        </button>
        {error && (
          <span className="max-w-[220px] text-right text-xs text-[color-mix(in_srgb,var(--accent)_90%,white)]">
            {friendlyConnectError(error)}
          </span>
        )}
      </div>
    );
  }

  const wrong = chainId !== sepolia.id;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--background)_92%,black)] px-2 py-1.5 pl-3 sm:gap-3">
      <div className="min-w-0 text-right">
        <p className="truncate font-mono text-xs text-[var(--primary)]">{shortAddress(address)}</p>
        {wrong && (
          <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--accent)]">Wrong network</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => disconnect()}
        className="shrink-0 rounded-lg border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
      >
        Disconnect
      </button>
    </div>
  );
}
