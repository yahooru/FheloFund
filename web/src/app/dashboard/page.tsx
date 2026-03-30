"use client";

import { useAccount, useReadContract } from "wagmi";
import Link from "next/link";
import { NetworkGuard } from "@/components/network-guard";
import { useFundAddress } from "@/hooks/use-fund-address";
import { fheloFundAbi } from "@/lib/fheloFundAbi";
import { fmtEth } from "@/lib/format";
import { sepoliaAddressUrl } from "@/lib/explorer";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/copy-button";

export default function DashboardPage() {
  const fund = useFundAddress();
  const { address, isConnected } = useAccount();

  const { data: totalShares, isLoading: l1 } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "totalShares",
    query: { enabled: !!fund },
  });
  const { data: totalAssets, isLoading: l2 } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "totalAssetsTracked",
    query: { enabled: !!fund },
  });
  const { data: myShares, isLoading: l3 } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "sharesOf",
    args: address ? [address] : undefined,
    query: { enabled: !!fund && !!address },
  });
  const { data: myEthValue, isLoading: l4 } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "ethShareValue",
    args: myShares !== undefined ? [myShares] : undefined,
    query: { enabled: !!fund && !!address && myShares !== undefined },
  });
  const { data: manager } = useReadContract({
    address: fund,
    abi: fheloFundAbi,
    functionName: "manager",
    query: { enabled: !!fund },
  });

  const loading = l1 || l2 || l3 || l4;

  return (
    <NetworkGuard>
      <PageHeader
        eyebrow="Portfolio"
        title="Dashboard"
        description="Live reads from the FheloFund contract on Sepolia — your position, pool totals, and manager address."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/invest"
              className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:brightness-110"
            >
              Invest
            </Link>
            <Link
              href="/activity"
              className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
            >
              Activity
            </Link>
          </div>
        }
      />

      {!fund && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            Set <code className="font-mono text-[var(--primary)]">NEXT_PUBLIC_FUND_ADDRESS</code> in your
            environment to load live contract data.
          </p>
        </Card>
      )}

      {fund && (
        <Card className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Fund contract</p>
            <p className="mt-1 break-all font-mono text-sm text-[var(--primary)]">{fund}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={fund} />
            <a
              href={sepoliaAddressUrl(fund)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--primary)] transition hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]"
            >
              Etherscan
            </a>
          </div>
        </Card>
      )}

      {fund && !isConnected && (
        <Card>
          <p className="text-[color-mix(in_srgb,var(--primary)_80%,white)]">
            Connect your wallet in the header to load your share balance and implied ETH value.
          </p>
        </Card>
      )}

      {loading && fund && isConnected && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton className="mb-3 h-3 w-24" />
              <Skeleton className="h-8 w-40" />
            </Card>
          ))}
        </div>
      )}

      {fund && isConnected && address && !loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card glow>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Your wallet</p>
            <p className="mt-2 break-all font-mono text-sm leading-relaxed text-[var(--primary)]">{address}</p>
          </Card>
          <Card glow>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Your shares (wei)</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-[var(--primary)]">{myShares?.toString() ?? "0"}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Your position (ETH)</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--primary)]">{fmtEth(myEthValue)}</p>
            <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--primary)_55%,white)]">Implied from shares × NAV</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Pool total assets</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--primary)]">{fmtEth(totalAssets)}</p>
            <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--primary)_55%,white)]">Tracked on-chain</p>
          </Card>
          <Card className="sm:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Total shares outstanding</p>
                <p className="mt-1 font-mono text-xl text-[var(--primary)]">{totalShares?.toString() ?? "0"}</p>
              </div>
              <div className="text-sm text-[color-mix(in_srgb,var(--primary)_72%,white)]">
                Manager{" "}
                <span className="font-mono text-[var(--primary)]">{manager ? String(manager) : "—"}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 border-t border-[color-mix(in_srgb,var(--accent)_15%,transparent)] pt-8">
        <Link href="/withdraw" className="text-sm font-semibold text-[var(--accent)] hover:underline">
          Withdraw →
        </Link>
        <Link href="/manager" className="text-sm font-semibold text-[color-mix(in_srgb,var(--primary)_75%,white)] hover:text-[var(--primary)]">
          Manager panel
        </Link>
      </div>
    </NetworkGuard>
  );
}
