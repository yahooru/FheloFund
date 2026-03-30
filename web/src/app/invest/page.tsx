"use client";

import { useState } from "react";
import { parseEther } from "viem";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NetworkGuard } from "@/components/network-guard";
import { useFundAddress } from "@/hooks/use-fund-address";
import { fheloFundAbi } from "@/lib/fheloFundAbi";
import { friendlyTxError } from "@/lib/user-errors";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TxFeedback } from "@/components/tx-feedback";

const PRESETS = ["0.01", "0.05", "0.1"];

export default function InvestPage() {
  const fund = useFundAddress();
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("0.01");

  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();

  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function onDeposit() {
    if (!fund) return;
    reset();
    let value: bigint;
    try {
      value = parseEther(amount.trim() as `${number}`);
    } catch {
      return;
    }
    if (value <= 0n) return;
    writeContract({
      address: fund,
      abi: fheloFundAbi,
      functionName: "deposit",
      value,
    });
  }

  return (
    <NetworkGuard>
      <PageHeader
        eyebrow="Deposit"
        title="Invest"
        description="Send Sepolia ETH to the fund contract. Shares are minted pro-rata after the first deposit. Gas is paid in Sepolia ETH."
      />

      {!fund && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            Configure <code className="font-mono text-[var(--primary)]">NEXT_PUBLIC_FUND_ADDRESS</code> first.
          </p>
        </Card>
      )}

      {fund && !isConnected && (
        <Card>
          <p className="text-[color-mix(in_srgb,var(--primary)_80%,white)]">Connect your wallet in the header to deposit.</p>
        </Card>
      )}

      {fund && isConnected && (
        <Card glow className="max-w-xl space-y-6">
          <div>
            <label className="text-sm font-medium text-[var(--accent)]">Amount (ETH)</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--background)] px-4 py-3 font-mono text-lg text-[var(--primary)] outline-none transition focus:border-[var(--primary)]"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:border-[var(--accent)]"
                >
                  {p} ETH
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={isPending || confirming}
            onClick={onDeposit}
            className="w-full rounded-xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-[var(--background)] shadow-[0_0_24px_-8px_color-mix(in_srgb,var(--primary)_45%,transparent)] transition hover:brightness-110 disabled:opacity-50"
          >
            {isPending || confirming ? "Confirm in wallet…" : "Deposit ETH"}
          </button>
          {error && (
            <p className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-3 text-sm text-[color-mix(in_srgb,var(--accent)_90%,white)]">
              {friendlyTxError(error)}
            </p>
          )}
          {isSuccess && hash && <TxFeedback hash={hash} successMessage="Deposit confirmed on-chain." />}
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
