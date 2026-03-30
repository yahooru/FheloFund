export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] ${className}`}
      aria-hidden
    />
  );
}
