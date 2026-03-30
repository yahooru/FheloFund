"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] px-2 py-1 text-xs font-medium text-[var(--accent)] transition hover:border-[var(--accent)]"
    >
      {done ? "Copied" : label}
    </button>
  );
}
