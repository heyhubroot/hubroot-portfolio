/** The reusable node grammar for every system diagram on the site. */
export type NodeKind =
  | "actor"
  | "input"
  | "ai"
  | "decision"
  | "integration"
  | "database"
  | "human"
  | "exception"
  | "notification"
  | "monitoring";

export type ToolId =
  // brand tools (icons from simple-icons)
  | "n8n"
  | "whatsapp"
  | "calcom"
  | "gmail"
  | "googlesheets"
  | "airtable"
  | "supabase"
  | "openai"
  | "elevenlabs"
  | "nextjs"
  | "netlify"
  | "googlemaps"
  | "mcp"
  // generic capabilities (neutral line glyphs)
  | "email"
  | "llm"
  | "knowledgebase"
  | "docs"
  | "datastore"
  | "notify"
  | "crm"
  | "validation"
  | "workflow";

export type FlowNode = {
  id: string;
  kind: NodeKind;
  /** business-facing label, shown on the node */
  label: string;
  /** plain-English explanation shown when the node is selected */
  detail: string;
  /** optional technical note revealed on select (kept secondary on purpose) */
  tech?: string;
  tools?: ToolId[];
};

export type ExceptionCase = {
  id: string;
  /** which main-path node this branch comes off */
  at: string;
  trigger: string;
  response: string;
  /** who ends up handling it */
  owner: "system" | "human";
  ownerLabel?: string;
};

export type StatusTier = "live" | "build" | "prototype";

export type ProjectStatus = {
  /** honest proof label, exactly as Hubroot describes it */
  label: string;
  tier: StatusTier;
};

export type ServiceId =
  | "booking"
  | "outreach"
  | "support"
  | "ecommerce"
  | "recruitment"
  | "backoffice"
  | "internal-tools";

export type ProjectMedia = {
  type: "image" | "video";
  /** path under /public, e.g. /images/projects/<slug>/workflow-canvas.webp */
  src: string;
  alt: string;
  /** what this piece of evidence proves. Never show media without this. */
  proves: string;
  poster?: string;
  width?: number;
  height?: number;
};

export type Decision = { title: string; body: string };

export type Project = {
  slug: string;
  title: string;
  /** one line, framed as the business problem/system, not the tech */
  summary: string;
  status: ProjectStatus;
  services: ServiceId[];
  featured?: boolean;
  /** lower = earlier */
  order: number;

  opening: string;
  before: string[];
  whyItMattered: string[];
  concept: string;
  flow: FlowNode[];
  exceptions: ExceptionCase[];
  decisions: Decision[];
  /** honest evidence: what exists today */
  evidence: string[];
  demonstrates: string;
  stack: { tool: ToolId; role: string }[];
  media?: ProjectMedia[];
};
