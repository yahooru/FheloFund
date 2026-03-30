/** Ambient gradient + grid — uses only the global palette */
export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] blur-[100px]" />
      <div className="absolute -right-1/4 top-1/3 h-[480px] w-[480px] rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] blur-[110px]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(color-mix(in srgb, var(--accent) 8%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--accent) 8%, transparent) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--background)_40%,transparent)] to-[var(--background)]" />
    </div>
  );
}
