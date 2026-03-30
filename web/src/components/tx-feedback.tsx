import { sepoliaTxUrl } from "@/lib/explorer";

export function TxFeedback({ hash, successMessage }: { hash?: `0x${string}` | undefined; successMessage: string }) {
  if (!hash) return null;
  return (
    <div className="space-y-2 rounded-xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] p-4 text-sm">
      <p className="font-medium text-[var(--primary)]">{successMessage}</p>
      <p className="break-all font-mono text-xs text-[color-mix(in_srgb,var(--primary)_65%,white)]">{hash}</p>
      <a
        href={sepoliaTxUrl(hash)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
      >
        View on Sepolia Etherscan
      </a>
    </div>
  );
}
