import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-b border-[color-mix(in_srgb,var(--accent)_18%,transparent)] pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] sm:text-4xl">{title}</h1>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--primary)_78%,white)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
