import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/config/site";
import { sanitize, validate, type ContactPayload } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 20_000; // bytes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort per-instance throttle. Serverless instances don't share memory, so this only
// blunts bursts from one client; it is not a security boundary.
const hits = new Map<string, number[]>();

function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(d: ContactPayload) {
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone || "not given"],
    ["Business / role", d.business || "not given"],
    ["What workflow do they want to automate?", d.workflow],
    ["What’s the painful part right now?", d.pain],
    ["Tools involved", d.tools || "not given"],
    ["What would “working” look like?", d.outcome || "not given"],
    ["Timeline", d.timeline || "not sure yet"],
    ["Budget", d.budget || "not shared"],
  ];
  const text = rows.map(([k, v]) => `${k}:\n${v}`).join("\n\n");
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f4fd;font-family:Arial,Helvetica,sans-serif;color:#0c1445">
<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e3e5f3">
<tr><td style="padding:24px 28px;border-bottom:1px solid #e3e5f3">
<p style="margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#3340f2;font-weight:700">New project enquiry</p>
<p style="margin:8px 0 0;font-size:20px;font-weight:700">${esc(d.name)}</p>
<p style="margin:4px 0 0;font-size:14px;color:#434a78">Reply to this email to answer ${esc(d.email)} directly.</p>
</td></tr>
${rows
  .slice(2)
  .map(
    ([k, v]) => `<tr><td style="padding:16px 28px;border-bottom:1px solid #eef0f8">
<p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#676d96">${esc(k)}</p>
<p style="margin:0;font-size:15px;line-height:1.55;white-space:pre-wrap">${esc(v)}</p></td></tr>`,
  )
  .join("")}
</table></body></html>`;
  return { text, html };
}

export async function POST(req: Request) {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });

  let raw: unknown;
  try {
    const body = await req.text();
    if (body.length > MAX_BODY) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
    raw = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const data = sanitize(raw as Record<string, unknown>);

  // Honeypot filled: pretend success so bots learn nothing.
  if (data.company_website) return NextResponse.json({ ok: true });

  const errors = validate(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "invalid", fields: errors }, { status: 422 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (throttled(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set in this environment");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const { text, html } = render(data);
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [site.contact.email],
      replyTo: data.email,
      subject: `New project enquiry from ${data.name}`,
      text,
      html,
    });
    if (error) {
      console.error("[contact] Resend rejected the email:", error.name, error.message);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Resend request failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
