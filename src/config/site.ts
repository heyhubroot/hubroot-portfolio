/**
 * SITE CONFIG: the single place for contact details and CTA wiring.
 *
 * - Change email / X here and they update everywhere (nav CTA, footer, contact page, CTA blocks).
 * - calendarUrl: leave null until a real booking link exists. When set, a "Book a call"
 *   option appears automatically in every CTA block and on the contact page.
 * - The contact form posts to /api/contact, which sends through Resend using the server-only
 *   RESEND_API_KEY environment variable. Submissions go to contact.email below.
 */
export const site = {
  name: "Hubroot",
  title: "AI Automation Engineer",
  tagline: "AI Systems Builder for business operations",
  url: "https://hubroot.example", // TODO: replace with the real domain once deployed (used for metadata only)
  description:
    "Workflow automation and AI systems that take repetitive operational work off your team: enquiries, follow-ups, orders, documents and handoffs, built around the tools you already use.",
  contact: {
    email: "adeshokanabdullahi@gmail.com",
    x: { handle: "@hubrootbuilds", url: "https://x.com/hubrootbuilds" },
    calendarUrl: null as string | null,
  },
  portrait: {
    // First file that exists wins. Drop the photo at /public/me.jpg to replace the current one.
    sources: ["/me.jpg", "/images/hubroot-portrait.webp"],
    alt: "Portrait of Hubroot",
  },
  primaryCta: {
    label: "Start a project",
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
    options.push({ id: "form", label: site.primaryCta.label, meta: "2-minute form · I reply by email", href: site.primaryCta.href });
  if (calendarUrl)
    options.push({ id: "calendar", label: "Book a call", meta: "calendar", href: calendarUrl, external: true });
  options.push({ id: "email", label: "Email me", meta: email, href: `mailto:${email}` });
  options.push({ id: "x", label: "Message me on X", meta: x.handle, href: x.url, external: true });
  return options;
}
