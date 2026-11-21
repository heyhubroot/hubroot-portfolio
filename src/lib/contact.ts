/**
 * Contact form schema, shared by the client (instant feedback) and the API route (the real check).
 * The server never trusts the client: everything is re-validated and sanitised there.
 */

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  business: string;
  workflow: string;
  pain: string;
  tools: string;
  outcome: string;
  timeline: string;
  budget: string;
  /** honeypot: real people never fill this */
  company_website?: string;
};

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

export const TIMELINES = ["", "As soon as possible", "Within the next month", "In 1–3 months", "Just exploring"] as const;

const LIMITS: Record<Exclude<keyof ContactPayload, "company_website">, number> = {
  name: 100,
  email: 254,
  phone: 32,
  business: 120,
  workflow: 3000,
  pain: 3000,
  tools: 500,
  outcome: 500,
  timeline: 40,
  budget: 120,
};

const SINGLE_LINE = new Set(["name", "email", "phone", "business", "tools", "outcome", "timeline", "budget"]);

// Pragmatic email check: one @, no spaces, a dot in the domain, sane label characters.
export const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const PHONE_RE = /^\+?[\d\s().-]{7,32}$/;

/** Trim, drop control characters, cap length. Single-line fields also lose line breaks (no header injection). */
export function clean(key: keyof typeof LIMITS, value: unknown): string {
  if (typeof value !== "string") return "";
  let v = value.normalize("NFC");
  // eslint-disable-next-line no-control-regex
  v = SINGLE_LINE.has(key) ? v.replace(/[\u0000-\u001F\u007F]+/g, " ") : v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  v = v.replace(/\r\n?/g, "\n").trim();
  if (SINGLE_LINE.has(key)) v = v.replace(/\s{2,}/g, " ");
  return v.slice(0, LIMITS[key]);
}

export function sanitize(raw: Record<string, unknown>): ContactPayload {
  const out = {} as ContactPayload;
  (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).forEach((k) => {
    out[k] = clean(k, raw[k]);
  });
  out.company_website = typeof raw.company_website === "string" ? raw.company_website.slice(0, 200) : "";
  return out;
}

export function validate(d: ContactPayload): FieldErrors {
  const e: FieldErrors = {};
  if (d.name.length < 2) e.name = "Please add your name.";
  if (!d.email) e.email = "Please add your email so I can reply.";
  else if (!EMAIL_RE.test(d.email)) e.email = "That email doesn’t look right. Check for typos.";
  if (d.phone) {
    const digits = d.phone.replace(/\D/g, "").length;
    if (!PHONE_RE.test(d.phone) || digits < 7 || digits > 15) e.phone = "Use digits, spaces or + ( ) - only, e.g. +234 801 234 5678.";
  }
  if (d.workflow.length < 10) e.workflow = "A sentence or two about the workflow is enough.";
  if (d.pain.length < 5) e.pain = "Tell me briefly what’s painful about it now.";
  if (!(TIMELINES as readonly string[]).includes(d.timeline)) e.timeline = "Pick one of the options.";
  return e;
}
