import { formatEther } from "viem";

export function fmtEth(wei: bigint | undefined): string {
  if (wei === undefined) return "—";
  const s = formatEther(wei);
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  if (n === 0) return "0";
  if (n < 0.0001) return "<0.0001";
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}
