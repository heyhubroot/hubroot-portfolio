import type { ToolId } from "./types";

export type Tool = {
  id: ToolId;
  name: string;
  /** brand = recognisable logo from simple-icons; generic = neutral line glyph */
  kind: "brand" | "generic";
};

/** Tools shown in the Integration Constellation (Services page). */
export const ORBIT: ToolId[] = ["whatsapp", "calcom", "gmail", "googlesheets", "airtable", "supabase", "openai", "elevenlabs", "nextjs", "netlify"];

export const tools: Record<ToolId, Tool> = {
  n8n: { id: "n8n", name: "n8n", kind: "brand" },
  whatsapp: { id: "whatsapp", name: "WhatsApp Cloud API", kind: "brand" },
  calcom: { id: "calcom", name: "Cal.com", kind: "brand" },
  gmail: { id: "gmail", name: "Gmail", kind: "brand" },
  googlesheets: { id: "googlesheets", name: "Google Sheets", kind: "brand" },
  airtable: { id: "airtable", name: "Airtable", kind: "brand" },
  supabase: { id: "supabase", name: "Supabase", kind: "brand" },
  openai: { id: "openai", name: "OpenAI", kind: "brand" },
  elevenlabs: { id: "elevenlabs", name: "ElevenLabs", kind: "brand" },
  nextjs: { id: "nextjs", name: "Next.js", kind: "brand" },
  netlify: { id: "netlify", name: "Netlify", kind: "brand" },
  googlemaps: { id: "googlemaps", name: "Google Maps data", kind: "brand" },
  mcp: { id: "mcp", name: "MCP", kind: "brand" },
  email: { id: "email", name: "Email", kind: "generic" },
  llm: { id: "llm", name: "LLM", kind: "generic" },
  knowledgebase: { id: "knowledgebase", name: "Knowledge base", kind: "generic" },
  docs: { id: "docs", name: "Document processing", kind: "generic" },
  datastore: { id: "datastore", name: "Data store", kind: "generic" },
  notify: { id: "notify", name: "Notifications", kind: "generic" },
  crm: { id: "crm", name: "CRM / database", kind: "generic" },
  validation: { id: "validation", name: "Email validation", kind: "generic" },
  workflow: { id: "workflow", name: "Workflow automation", kind: "generic" },
};
