"use client";

import { useMemo, useState } from "react";
import { parseEther } from "viem";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NetworkGuard } from "@/components/network-guard";
import { useFundAddress } from "@/hooks/use-fund-address";
import { fheloFundAbi } from "@/lib/fheloFundAbi";
import { friendlyTxError } from "@/lib/user-errors";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TxFeedback } from "@/components/tx-feedback";

function parseSignedWei(ethStr: string): bigint {
  const trimmed = ethStr.trim();
  const neg = trimmed.startsWith("-");
  const body = neg ? trimmed.slice(1) : trimmed;
  if (!body || body === ".") return 0n;
  const w = parseEther(body as `${number}`);
  return neg ? -w : w;
}

export default function ManagerPage() {
  const fund = useFundAddress();
  const { address, isConnected } = useAccount();
  const [deltaEth, setDeltaEth] = useState("0");

  const { data: manager } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "manager",
    query: { enabled: !!fund },
  });

  const isManager = useMemo(() => {
    if (!address || !manager) return false;
    return address.toLowerCase() === (manager as string).toLowerCase();
  }, [address, manager]);

  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function onTrade() {
    if (!fund) return;
    reset();
    const pnlDelta = parseSignedWei(deltaEth);
    writeContract({
      address: fund,
      abi: fheloFundAbi,
      functionName: "executeTrade",
      args: [pnlDelta],
    });
  }

  return (
    <NetworkGuard>
      <PageHeader
        eyebrow="Operations"
        title="Manager"
        description="Simulated P&amp;L updates totalAssetsTracked for all shareholders — no ETH leaves the contract. Only the on-chain manager address can execute."
      />

      {!fund && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            Set <code className="font-mono text-[var(--primary)]">NEXT_PUBLIC_FUND_ADDRESS</code> first.
          </p>
        </Card>
      )}

      {fund && !isConnected && (
        <Card>
          <p className="text-[color-mix(in_srgb,var(--primary)_80%,white)]">Connect your wallet.</p>
        </Card>
      )}

      {fund && isConnected && manager && (
        <Card className="mb-6 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">On-chain manager</p>
          <p className="mt-2 break-all font-mono text-sm text-[var(--primary)]">{String(manager)}</p>
        </Card>
      )}

      {fund && isConnected && !isManager && (
        <Card className="max-w-xl border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]">
          <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            This wallet is not the manager. Deploy the contract with your address as manager, or ask the owner
            to call <code className="font-mono text-[var(--primary)]">setManager</code>.
          </p>
        </Card>
      )}

      {fund && isConnected && isManager && (
        <Card glow className="max-w-xl space-y-6">
          <div>
            <label className="text-sm font-medium text-[var(--accent)]">P&amp;L delta (ETH)</label>
            <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--primary)_55%,white)]">
              Positive increases NAV; negative decreases. Values are converted to wei for the contract.
            </p>
            <input
              type="text"
              inputMode="decimal"
              value={deltaEth}
              onChange={(e) => setDeltaEth(e.target.value)}
              placeholder="0.01 or -0.005"
              className="mt-3 w-full rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--background)] px-4 py-3 font-mono text-[var(--primary)] outline-none transition focus:border-[var(--primary)]"
            />
          </div>
          <button
            type="button"
            disabled={isPending || confirming}
            onClick={onTrade}
            className="w-full rounded-xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-[var(--background)] transition hover:brightness-110 disabled:opacity-50"
          >
            {isPending || confirming ? "Confirm in wallet…" : "Execute trade (simulate P&amp;L)"}
          </button>
            {error && (
              <p className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] p-3 text-sm text-[color-mix(in_srgb,var(--accent)_90%,white)]">
                {friendlyTxError(error)}
              </p>
            )}
          {isSuccess && hash && <TxFeedback hash={hash} successMessage="Trade recorded on-chain." />}
        </Card>
      )}

      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--primary)_60%,white)]">
        <Link href="/dashboard" className="font-semibold text-[var(--primary)] hover:underline">
          ← Back to dashboard
        </Link>
      </p>
    </NetworkGuard>
  );
}
