import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--background)_96%,#0a1628)] p-5 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_6%,transparent)] backdrop-blur-sm ${
        glow ? "shadow-[0_0_40px_-12px_color-mix(in_srgb,var(--primary)_35%,transparent)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
