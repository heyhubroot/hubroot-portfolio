/**
 * SITE CONFIG: the single place for contact details and CTA wiring.
 *
 * - Change email / X here and they update everywhere (nav CTA, footer, contact page, CTA blocks).
 * - calendarUrl: leave null until a real booking link exists. When set, a "Book a call"
 *   option appears automatically in every CTA block and on the contact page.
 * - formEndpoint: optional. If set (e.g. a Formspree / Netlify function / n8n webhook URL that
 *   accepts JSON POST), the contact form posts there. If null, the form opens a pre-filled email.
 */
export const site = {
  name: "Hubroot",
  title: "AI Automation Engineer",
  tagline: "AI Systems Builder for business operations",
  url: "https://hubroot.example", // TODO: replace with the real domain once deployed (used for metadata only)
  description:
    "I design and build AI-powered automation systems that remove repetitive operational work, around the tools a business already uses.",
  contact: {
    email: "adeshokanabdullahi@gmail.com",
    x: { handle: "@hubrootbuilds", url: "https://x.com/hubrootbuilds" },
    calendarUrl: null as string | null,
    formEndpoint: null as string | null,
  },
  portrait: {
    // One-file swap: drop a real photo at /public/images/hubroot-portrait.webp
    src: "/images/hubroot-portrait.webp",
    alt: "Portrait of Hubroot",
  },
  primaryCta: {
    label: "Tell me what you’re trying to automate",
    href: "/contact#start",
  },
} as const;

export type ContactOption = {
  id: "form" | "email" | "x" | "calendar";
  label: string;
  meta: string;
  href: string;
  external?: boolean;
};

/** Every CTA block renders from this list, so adding a calendar is a config change, not a rebuild. */
export function contactOptions({ includeForm = true } = {}): ContactOption[] {
  const { email, x, calendarUrl } = site.contact;
  const options: ContactOption[] = [];
  if (includeForm)
    options.push({ id: "form", label: site.primaryCta.label, meta: "short form · 2 mins", href: site.primaryCta.href });
  if (calendarUrl)
    options.push({ id: "calendar", label: "Book a call", meta: "calendar", href: calendarUrl, external: true });
  options.push({ id: "email", label: "Email me", meta: email, href: `mailto:${email}` });
  options.push({ id: "x", label: "Message me on X", meta: x.handle, href: x.url, external: true });
  return options;
}
