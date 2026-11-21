import type { ServiceId, ToolId } from "./types";

export type Service = {
  id: ServiceId;
  name: string;
  /** the outcome, as a client would say it. Used as the headline on cards. */
  promise: string;
  /** the operational problem, in the buyer's words */
  problem: string;
  /** the system I build for it */
  system: string;
  /** typical moving parts, shown small */
  includes: string[];
  tools: ToolId[];
};

export const services: Service[] = [
  {
    id: "booking",
    promise: "Every enquiry answered and booked, even on your busiest day.",
    name: "Lead Qualification & Appointment Booking",
    problem:
      "People message you to book and somebody has to reply, check the calendar, go back and forth, then remember to confirm. Some of them just stop replying because nobody answered fast enough.",
    system:
      "A booking flow that understands what the person wants, checks real availability, books it, confirms it, and handles reschedules and cancellations. Anything it can’t understand goes to a person, not into a void.",
    includes: ["intent detection", "live availability", "reschedule / cancel", "handoff to staff"],
    tools: ["whatsapp", "calcom", "n8n"],
  },
  {
    id: "outreach",
    promise: "Prospects researched and first drafts written before your team sits down.",
    name: "Sales & Outreach Automation",
    problem:
      "Prospect lists live in a sheet, research is manual, and every email is either copy-pasted generic or takes ten minutes to write.",
    system:
      "A pipeline that finds and checks leads, qualifies them against your criteria, drafts personalised outreach and writes it back where your team works, with a human reviewing before anything is sent.",
    includes: ["lead sourcing", "validation", "qualification", "draft + review"],
    tools: ["googlesheets", "openai", "gmail", "n8n"],
  },
  {
    id: "support",
    promise: "Routine questions answered. Urgent ones handed to a person with the context attached.",
    name: "Customer Support Automation",
    problem:
      "The same questions keep coming in, the answers live in somebody’s head or a scattered doc, and urgent issues get buried under the easy ones.",
    system:
      "An assistant grounded in your own knowledge base that answers what it actually knows, says when it doesn’t, and escalates the rest to a person with the context already attached.",
    includes: ["grounded answers", "confidence fallback", "escalation", "ticket updates"],
    tools: ["llm", "knowledgebase", "workflow"],
  },
  {
    id: "ecommerce",
    promise: "Every order tracked from checkout to doorstep, without the chasing.",
    name: "E-commerce Operations Automation",
    problem:
      "Orders, riders, delivery updates and returns are tracked across chats and spreadsheets, so customers ask “where is my order?” and nobody is sure.",
    system:
      "Order-to-delivery and returns workflows that keep one record per order, assign and update fulfilment, notify the customer, and push failed deliveries or odd returns to someone who can fix them.",
    includes: ["order records", "rider assignment", "customer updates", "returns & refunds"],
    tools: ["airtable", "googlesheets", "email", "n8n"],
  },
  {
    id: "recruitment",
    promise: "Candidates moving forward instead of waiting in someone’s inbox.",
    name: "Recruitment & HR Automation",
    problem:
      "Applications come from everywhere, candidate status lives in someone’s inbox, and recruiters spend more time updating trackers than talking to people.",
    system:
      "An applicant pipeline where each application becomes a candidate record, moves through screening and interview stages, and tells the recruiter exactly what needs their action.",
    includes: ["candidate records", "stages", "recruiter actions", "pipeline view"],
    tools: ["nextjs", "supabase", "netlify"],
  },
  {
    id: "backoffice",
    promise: "Documents read, checked and routed without anyone re-typing them.",
    name: "Document & Back-office Automation",
    problem:
      "Invoices and documents are read and re-typed by hand, matched against POs by eye, and approvals get stuck in someone’s inbox.",
    system:
      "Extraction and matching that does the reading and checking, routes approvals to the right person, and stops on mismatches instead of guessing.",
    includes: ["extraction", "matching", "approval routing", "mismatch exceptions"],
    tools: ["docs", "llm", "workflow"],
  },
  {
    id: "internal-tools",
    promise: "Small tools built around how your team actually works.",
    name: "Custom AI Internal Tools",
    problem:
      "Your team needs a small tool that fits exactly how you work, and off-the-shelf software is either too much or not quite it.",
    system:
      "Focused internal tools and assistants built on your data, with clear limits on what the AI is allowed to do and a person in charge of what matters.",
    includes: ["internal apps", "knowledge assistants", "role-based actions"],
    tools: ["nextjs", "supabase", "openai"],
  },
];

export const serviceName = (id: ServiceId) => services.find((s) => s.id === id)?.name ?? id;
export const serviceShort: Record<ServiceId, string> = {
  booking: "Booking",
  outreach: "Sales & outreach",
  support: "Support",
  ecommerce: "E-commerce ops",
  recruitment: "Recruitment",
  backoffice: "Back-office",
  "internal-tools": "Internal tools",
};
