"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatEther, parseAbiItem } from "viem";
import Link from "next/link";
import { usePublicClient } from "wagmi";
import { sepolia } from "wagmi/chains";
import { NetworkGuard } from "@/components/network-guard";
import { useFundAddress } from "@/hooks/use-fund-address";
import { sepoliaTxUrl } from "@/lib/explorer";

function isValidTxHash(h: string): h is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(h);
}
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Row =
  | { kind: "Deposit"; user: string; ethIn: bigint; sharesMinted: bigint; txHash: string; block: bigint }
  | { kind: "Withdraw"; user: string; sharesBurned: bigint; ethOut: bigint; txHash: string; block: bigint }
  | {
      kind: "Trade";
      manager: string;
      pnlDelta: bigint;
      newTotalAssets: bigint;
      txHash: string;
      block: bigint;
    };

function Badge({ children, variant }: { children: ReactNode; variant: "in" | "out" | "trade" }) {
  const cls =
    variant === "in"
      ? "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]"
      : variant === "out"
        ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]"
        : "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[color-mix(in_srgb,var(--primary)_90%,white)]";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
}

export default function ActivityPage() {
  const fund = useFundAddress();
  const publicClient = usePublicClient({ chainId: sepolia.id });
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!fund || !publicClient) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const latest = await publicClient.getBlockNumber();
        const fromBlock = latest > 50000n ? latest - 50000n : 0n;

        const deposit = parseAbiItem(
          "event Deposit(address indexed user, uint256 ethIn, uint256 sharesMinted)",
        );
        const withdraw = parseAbiItem(
          "event Withdraw(address indexed user, uint256 sharesBurned, uint256 ethOut)",
        );
        const trade = parseAbiItem(
          "event Trade(address indexed manager, int256 pnlDelta, uint256 newTotalAssets)",
        );

        const [dLogs, wLogs, tLogs] = await Promise.all([
          publicClient.getLogs({
            address: fund,
            event: deposit,
            fromBlock,
            toBlock: latest,
          }),
          publicClient.getLogs({
            address: fund,
            event: withdraw,
            fromBlock,
            toBlock: latest,
          }),
          publicClient.getLogs({
            address: fund,
            event: trade,
            fromBlock,
            toBlock: latest,
          }),
        ]);

        if (cancelled) return;

        const mapped: Row[] = [];

        for (const l of dLogs) {
          const a = l.args as { user: string; ethIn: bigint; sharesMinted: bigint };
          mapped.push({
            kind: "Deposit",
            user: a.user,
            ethIn: a.ethIn,
            sharesMinted: a.sharesMinted,
            txHash: l.transactionHash ?? "",
            block: l.blockNumber ?? 0n,
          });
        }
        for (const l of wLogs) {
          const a = l.args as { user: string; sharesBurned: bigint; ethOut: bigint };
          mapped.push({
            kind: "Withdraw",
            user: a.user,
            sharesBurned: a.sharesBurned,
            ethOut: a.ethOut,
            txHash: l.transactionHash ?? "",
            block: l.blockNumber ?? 0n,
          });
        }
        for (const l of tLogs) {
          const a = l.args as { manager: string; pnlDelta: bigint; newTotalAssets: bigint };
          mapped.push({
            kind: "Trade",
            manager: a.manager,
            pnlDelta: a.pnlDelta,
            newTotalAssets: a.newTotalAssets,
            txHash: l.transactionHash ?? "",
            block: l.blockNumber ?? 0n,
          });
        }

        mapped.sort((x, y) => (x.block > y.block ? -1 : x.block < y.block ? 1 : 0));
        setRows(mapped.slice(0, 100));
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load logs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fund, publicClient]);

  return (
    <NetworkGuard>
      <PageHeader
        eyebrow="On-chain"
        title="Activity"
        description="Indexed from the fund contract: Deposit, Withdraw, and Trade events (last ~50k blocks). Click a transaction to verify on Etherscan."
      />

      {!fund && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            Set <code className="font-mono text-[var(--primary)]">NEXT_PUBLIC_FUND_ADDRESS</code> first.
          </p>
        </Card>
      )}

      {loading && fund && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-3 w-full max-w-md" />
            </Card>
          ))}
        </div>
      )}

      {err && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--accent)_90%,white)]">{err}</p>
        </Card>
      )}

      {fund && !loading && !err && rows.length === 0 && (
        <Card>
          <p className="text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            No events in this window yet. After you deposit or trade, refresh here to see live logs.
          </p>
        </Card>
      )}

      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={`${r.txHash}-${i}`}>
            <Card className="transition hover:border-[color-mix(in_srgb,var(--accent)_35%,transparent)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  {r.kind === "Deposit" && (
                    <>
                      <Badge variant="in">Deposit</Badge>
                      <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
                        <span className="font-mono text-[var(--primary)]">{r.user.slice(0, 10)}…</span>
                        {" · "}
                        <span className="tabular-nums">{formatEther(r.ethIn)}</span> ETH →{" "}
                        <span className="font-mono">{r.sharesMinted.toString()}</span> shares
                      </p>
                    </>
                  )}
                  {r.kind === "Withdraw" && (
                    <>
                      <Badge variant="out">Withdraw</Badge>
                      <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
                        <span className="font-mono text-[var(--primary)]">{r.user.slice(0, 10)}…</span>
                        {" · "}
                        <span className="font-mono">{r.sharesBurned.toString()}</span> shares →{" "}
                        <span className="tabular-nums">{formatEther(r.ethOut)}</span> ETH
                      </p>
                    </>
                  )}
                  {r.kind === "Trade" && (
                    <>
                      <Badge variant="trade">Trade</Badge>
                      <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
                        <span className="font-mono text-[var(--primary)]">{r.manager.slice(0, 10)}…</span>
                        {" · "}PnL Δ{" "}
                        <span className="font-mono text-xs">{r.pnlDelta.toString()}</span> wei · NAV{" "}
                        <span className="tabular-nums">{formatEther(r.newTotalAssets)}</span> ETH
                      </p>
                    </>
                  )}
                  <p className="font-mono text-xs text-[color-mix(in_srgb,var(--primary)_45%,white)]">
                    Block {r.block.toString()}
                  </p>
                </div>
                {isValidTxHash(r.txHash) && (
                  <a
                    href={sepoliaTxUrl(r.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:border-[var(--accent)]"
                  >
                    View tx
                  </a>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-[color-mix(in_srgb,var(--primary)_60%,white)]">
        <Link href="/dashboard" className="font-semibold text-[var(--primary)] hover:underline">
          ← Back to dashboard
        </Link>
      </p>
    </NetworkGuard>
  );
}
