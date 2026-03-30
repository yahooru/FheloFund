"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NetworkGuard } from "@/components/network-guard";
import { useFundAddress } from "@/hooks/use-fund-address";
import { fheloFundAbi } from "@/lib/fheloFundAbi";
import { fmtEth } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TxFeedback } from "@/components/tx-feedback";

export default function WithdrawPage() {
  const fund = useFundAddress();
  const { address, isConnected } = useAccount();
  const [shareAmount, setShareAmount] = useState("");

  const { data: myShares } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "sharesOf",
    args: address ? [address] : undefined,
    query: { enabled: !!fund && !!address },
  });

  const { data: myEthValue } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "ethShareValue",
    args: myShares !== undefined ? [myShares] : undefined,
    query: { enabled: !!fund && !!address && myShares !== undefined },
  });

  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function onWithdraw() {
    if (!fund || !shareAmount) return;
    reset();
    const shares = BigInt(shareAmount);
    writeContract({
      address: fund,
      abi: fheloFundAbi,
      functionName: "withdraw",
      args: [shares],
    });
  }

  function setMax() {
    if (myShares !== undefined) setShareAmount(myShares.toString());
  }

  return (
    <NetworkGuard>
      <PageHeader
        eyebrow="Redeem"
        title="Withdraw"
        description="Burn fund shares to receive ETH pro-rata. Enter the amount in wei (integer). Use “Max” to fill your full balance."
      />

      {!fund && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            Set <code className="font-mono text-[var(--primary)]">NEXT_PUBLIC_FUND_ADDRESS</code> first.
          </p>
        </Card>
      )}

      {fund && isConnected && myShares !== undefined && (
        <Card className="mb-6 max-w-xl border-[color-mix(in_srgb,var(--primary)_20%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_78%,white)]">
            Your shares:{" "}
            <span className="font-mono font-semibold text-[var(--primary)]">{myShares.toString()}</span>
            {myEthValue !== undefined && (
              <>
                {" "}
                · ~<span className="tabular-nums text-[var(--primary)]">{fmtEth(myEthValue)}</span> ETH at
                current NAV
              </>
            )}
          </p>
        </Card>
      )}

      {fund && isConnected && address && myShares !== undefined && (
        <Card glow className="max-w-xl space-y-5">
          <div>
            <label className="text-sm font-medium text-[var(--accent)]">Share amount (wei)</label>
            <input
              type="text"
              inputMode="numeric"
              value={shareAmount}
              onChange={(e) => setShareAmount(e.target.value.replace(/\D/g, ""))}
              placeholder={myShares.toString()}
              className="mt-2 w-full rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--background)] px-4 py-3 font-mono text-[var(--primary)] outline-none transition focus:border-[var(--primary)]"
            />
          </div>
          <button
            type="button"
            onClick={setMax}
            className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Use max shares
          </button>
          <button
            type="button"
            disabled={isPending || confirming || !shareAmount}
            onClick={onWithdraw}
            className="w-full rounded-xl border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] py-3.5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] disabled:opacity-50"
          >
            {isPending || confirming ? "Confirm in wallet…" : "Withdraw ETH"}
          </button>
          {error && (
            <p className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] p-3 text-sm text-[color-mix(in_srgb,var(--accent)_90%,white)]">
              {error.message}
            </p>
          )}
          {isSuccess && hash && <TxFeedback hash={hash} successMessage="Withdrawal confirmed on-chain." />}
        </Card>
      )}

      {fund && !isConnected && (
        <Card>
          <p className="text-[color-mix(in_srgb,var(--primary)_80%,white)]">Connect your wallet to withdraw.</p>
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
