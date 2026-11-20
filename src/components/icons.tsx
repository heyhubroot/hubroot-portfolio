import type { NodeKind, ToolId } from "@/data/types";
import { brandIcons } from "@/data/tool-icons.generated";
import { tools } from "@/data/tools";

type GlyphProps = { size?: number; className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Neutral line glyphs for generic capabilities (not brands). */
const genericPaths: Record<string, React.ReactNode> = {
  email: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" {...stroke} />
      <path d="m3.5 7 8.5 6 8.5-6" {...stroke} />
    </>
  ),
  llm: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" {...stroke} />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M10 10h4v4h-4z" {...stroke} />
    </>
  ),
  knowledgebase: (
    <>
      <path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" {...stroke} />
      <path d="M5 17a3 3 0 0 1 3-3h10M9 8h5" {...stroke} />
    </>
  ),
  docs: (
    <>
      <path d="M7 3h7l4 4v14H7z" {...stroke} />
      <path d="M14 3v4h4M10 12h5M10 15.5h5" {...stroke} />
    </>
  ),
  datastore: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" {...stroke} />
      <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" {...stroke} />
    </>
  ),
  notify: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" {...stroke} />
      <path d="M10 20.5a2 2 0 0 0 4 0" {...stroke} />
    </>
  ),
  crm: (
    <>
      <circle cx="9" cy="9" r="3.2" {...stroke} />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 6.5h6M15 10.5h6M17 14.5h4" {...stroke} />
    </>
  ),
  validation: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" {...stroke} />
      <path d="m8.8 12 2.2 2.2 4.4-4.4" {...stroke} />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1.2" {...stroke} />
      <rect x="15" y="4" width="6" height="5" rx="1.2" {...stroke} />
      <rect x="9" y="15" width="6" height="5" rx="1.2" {...stroke} />
      <path d="M9 6.5h6M18 9v3H12v3M6 9v3h6" {...stroke} />
    </>
  ),
};

export function ToolIcon({
  id,
  size = 18,
  className,
  brandColor = false,
  title,
}: {
  id: ToolId;
  size?: number;
  className?: string;
  /** use the brand's own colour instead of currentColor */
  brandColor?: boolean;
  title?: string;
}) {
  const brand = brandIcons[id];
  const label = title ?? tools[id]?.name ?? id;
  // title="" means decorative: the visible text next to it already names the tool
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        {...a11y}
        fill={brandColor ? brand.hex : "currentColor"}
      >
        <path d={brand.path} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...a11y}>
      {genericPaths[id] ?? <circle cx="12" cy="12" r="7" {...stroke} />}
    </svg>
  );
}

/** Glyphs for the node grammar. Shape carries meaning so state is never colour-only. */
export function NodeGlyph({ kind, size = 16, className }: { kind: NodeKind } & GlyphProps) {
  const p: Record<NodeKind, React.ReactNode> = {
    actor: (
      <>
        <circle cx="12" cy="8" r="3.5" {...stroke} />
        <path d="M5 20a7 7 0 0 1 14 0" {...stroke} />
      </>
    ),
    input: <path d="M4 12h12M12 7l5 5-5 5M20 4v16" {...stroke} />,
    ai: (
      <path
        d="M12 3.5 13.8 9 19.5 10.5 13.8 12 12 17.5 10.2 12 4.5 10.5 10.2 9zM18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"
        {...stroke}
      />
    ),
    decision: <path d="m12 3 9 9-9 9-9-9z" {...stroke} />,
    integration: (
      <>
        <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0zM12 16v5" {...stroke} />
      </>
    ),
    database: genericPaths.datastore,
    human: (
      <>
        <circle cx="12" cy="7.5" r="3.2" {...stroke} />
        <path d="M6 20v-2.5A4.5 4.5 0 0 1 10.5 13h3a4.5 4.5 0 0 1 4.5 4.5V20M9.5 17l1.8 1.8L15 15" {...stroke} />
      </>
    ),
    exception: (
      <>
        <path d="M12 3.5 21.5 20h-19z" {...stroke} />
        <path d="M12 10v4.5M12 17.3v.1" {...stroke} />
      </>
    ),
    notification: genericPaths.notify,
    monitoring: <path d="M3 12h4l2.5-6 5 12L17 12h4" {...stroke} />,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {p[kind]}
    </svg>
  );
}

export const nodeKindLabel: Record<NodeKind, string> = {
  actor: "Business actor",
  input: "Input",
  ai: "AI step",
  decision: "Decision",
  integration: "Integration",
  database: "Database",
  human: "Human handoff",
  exception: "Exception",
  notification: "Notification",
  monitoring: "Monitoring",
};

export function ArrowIcon({ size = 16, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" {...stroke} />
    </svg>
  );
}

export function ExternalIcon({ size = 14, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M8 16 16 8M9 8h7v7" {...stroke} />
    </svg>
  );
}

export function XLogo({ size = 16, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77zm-1.08 16.18h1.7L7.4 4.73H5.58z" />
    </svg>
  );
}

export function MailIcon({ size = 16, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {genericPaths.email}
    </svg>
  );
}

export function CalendarIcon({ size = 16, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" {...stroke} />
      <path d="M3.5 10h17M8 3v4M16 3v4" {...stroke} />
    </svg>
  );
}

export function FormIcon({ size = 16, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M4 5h16M4 10h10M4 15h16M4 20h7" {...stroke} />
    </svg>
  );
}
