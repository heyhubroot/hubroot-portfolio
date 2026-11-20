import type { ProjectStatus } from "@/data/types";

const tierText = {
  live: "In real use",
  build: "Built",
  prototype: "Prototype / demo",
} as const;

/**
 * Honest proof label. Tier is shown by shape (filled / half / outline) AND text,
 * so it never relies on colour alone.
 */
export function StatusBadge({ status, showTier = false }: { status: ProjectStatus; showTier?: boolean }) {
  return (
    <span className={`status status--${status.tier}`}>
      <span className="status__mark" aria-hidden="true" />
      <span className="status__label">{status.label}</span>
      {showTier && <span className="sr-only"> ({tierText[status.tier]})</span>}
    </span>
  );
}

export function HumanLoopBadge({ label = "Human in the loop", compact = false }: { label?: string; compact?: boolean }) {
  return (
    <span className={`hitl${compact ? " hitl--compact" : ""}`}>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <circle cx="12" cy="7.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5.5 20v-2a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {compact ? <span className="sr-only">{label}</span> : label}
    </span>
  );
}
