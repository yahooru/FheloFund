"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatEther, parseAbiItem } from "viem";
import Link from "next/link";
import { usePublicClient } from "wagmi";
import { sepolia } from "wagmi/chains";
import { NetworkGuard } from "@/components/network-guard";
import { useFundAddress } from "@/hooks/use-fund-address";
import { sepoliaTxUrl } from "@/lib/explorer";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogsChunked, ACTIVITY_SCAN_BLOCKS } from "@/lib/get-logs-chunked";
import { friendlyActivityError } from "@/lib/user-errors";

function isValidTxHash(h: string): h is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(h);
}

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
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!fund || !publicClient) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const latest = await publicClient.getBlockNumber();
        if (cancelled) return;
        const fromBlock = latest > ACTIVITY_SCAN_BLOCKS ? latest - ACTIVITY_SCAN_BLOCKS : 0n;

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
          getLogsChunked(publicClient, {
            address: fund,
            event: deposit,
            fromBlock,
            toBlock: latest,
          }),
          getLogsChunked(publicClient, {
            address: fund,
            event: withdraw,
            fromBlock,
            toBlock: latest,
          }),
          getLogsChunked(publicClient, {
            address: fund,
            event: trade,
            fromBlock,
            toBlock: latest,
          }),
        ]);

        if (cancelled) return;

        const mapped: Row[] = [];

        for (const l of dLogs) {
          const a = (l as unknown as { args: { user: string; ethIn: bigint; sharesMinted: bigint } }).args;
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
          const a = (l as unknown as { args: { user: string; sharesBurned: bigint; ethOut: bigint } }).args;
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
          const a = (l as unknown as { args: { manager: string; pnlDelta: bigint; newTotalAssets: bigint } }).args;
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
        console.error("[FheloFund] activity load failed", e);
        if (!cancelled) setErr(friendlyActivityError());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fund, publicClient, reloadToken]);

  return (
    <NetworkGuard>
      <PageHeader
        eyebrow="On-chain"
        title="Activity"
        description="Recent deposits, withdrawals, and manager trades (loaded in small block batches so it works with standard RPC plans). Verify any transaction on Etherscan."
      />

      {!fund && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm text-[color-mix(in_srgb,var(--primary)_85%,white)]">
            The app needs a fund address configured. If you’re an admin, add it in the deployment environment.
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

      {err && !loading && (
        <Card className="border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--primary)_88%,white)]">{err}</p>
          <button
            type="button"
            onClick={() => {
              setErr(null);
              setReloadToken((t) => t + 1);
            }}
            className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--background)]"
          >
            Try again
          </button>
        </Card>
      )}

      {fund && !loading && !err && rows.length === 0 && (
        <Card>
          <p className="text-[color-mix(in_srgb,var(--primary)_75%,white)]">
            No activity in the latest window yet. After you deposit or trade, use Refresh below or check back
            shortly.
          </p>
          <button
            type="button"
            onClick={() => setReloadToken((t) => t + 1)}
            className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--accent)]"
          >
            Refresh
          </button>
        </Card>
      )}

      {!loading && !err && rows.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[color-mix(in_srgb,var(--primary)_50%,white)]">
            Showing up to 100 most recent events from the latest scanned range.
          </p>
          <button
            type="button"
            onClick={() => setReloadToken((t) => t + 1)}
            className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:border-[var(--accent)]"
          >
            Refresh
          </button>
        </div>
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
                    View on Etherscan
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
