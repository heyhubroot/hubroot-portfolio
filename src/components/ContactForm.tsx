"use client";

import { useRef, useState } from "react";
import { site } from "@/config/site";
import { sanitize, validate, TIMELINES, type ContactPayload, type FieldErrors } from "@/lib/contact";
import { ArrowIcon } from "./icons";

type State = "idle" | "sending" | "sent" | "error";

const labels = {
  workflow: "What workflow do you want to automate?",
  pain: "What’s the painful part right now?",
  tools: "Which tools are involved?",
  outcome: "What would “working” look like?",
};

const serverMessage: Record<string, string> = {
  rate_limited: "That’s a few messages in a short time. Give it a few minutes, or email me directly.",
  not_configured: "The form isn’t connected on this version of the site yet.",
  send_failed: "The email service didn’t accept the message.",
};

/**
 * Project form → POST /api/contact → Resend → Hubroot's inbox (reply-to = the visitor).
 * The API key only exists on the server. If sending fails for any reason, the visitor gets a
 * pre-filled email link so nothing they typed is lost.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [fallback, setFallback] = useState("");
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function mailtoFor(d: ContactPayload) {
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      d.phone ? `Phone: ${d.phone}` : "",
      d.business ? `Business / role: ${d.business}` : "",
      "",
      `${labels.workflow}\n${d.workflow}`,
      "",
      `${labels.pain}\n${d.pain}`,
      "",
      `${labels.tools}\n${d.tools || "-"}`,
      "",
      `${labels.outcome}\n${d.outcome || "-"}`,
      "",
      `Timeline: ${d.timeline || "not sure yet"}`,
      `Budget: ${d.budget || "not shared"}`,
    ].join("\n");
    const subject = `Automation enquiry: ${d.workflow.slice(0, 60)}`;
    return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // no double submits, even on a fast double-click
    const form = e.currentTarget;
    const data = sanitize(Object.fromEntries(new FormData(form).entries()));
    if (data.company_website) return;

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // focus the first invalid field in reading order
      const first = Array.from(form.elements).find(
        (el): el is HTMLInputElement => "name" in el && Boolean(found[(el as HTMLInputElement).name as keyof FieldErrors]),
      );
      first?.focus();
      return;
    }

    inFlight.current = true;
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors };
      if (res.ok && json.ok) {
        setState("sent");
        form.reset();
        return;
      }
      if (json.error === "invalid" && json.fields) {
        setErrors(json.fields);
        setState("idle");
        return;
      }
      setErrorMsg(serverMessage[json.error ?? ""] ?? "Something went wrong sending that.");
      setFallback(mailtoFor(data));
      setState("error");
    } catch {
      setErrorMsg("I couldn’t reach the server. Your connection may have dropped.");
      setFallback(mailtoFor(data));
      setState("error");
    } finally {
      inFlight.current = false;
    }
  }

  if (state === "sent") {
    return (
      <div className="form-done" role="status" aria-live="polite">
        <span className="form-done__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="label label--accent">Received</p>
        <p className="h3">Thanks, I’ve got it.</p>
        <p className="muted">I’ll read through it properly and reply by email.</p>
        <button type="button" className="btn btn--soft btn--sm" onClick={() => setState("idle")}>
          Send another
        </button>
      </div>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k]
      ? {
          "aria-invalid": true as const,
          "aria-describedby": `e-${k}`,
        }
      : {};
  const msg = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p className="field__err" id={`e-${k}`}>
        {errors[k]}
      </p>
    ) : null;

  const sending = state === "sending";

  return (
    <form ref={formRef} className="cform" onSubmit={onSubmit} noValidate aria-busy={sending}>
      <fieldset className="cform__group" disabled={sending}>
        <legend className="label label--accent">01 · The project</legend>
        <div className="field">
          <label htmlFor="f-workflow">{labels.workflow}</label>
          <textarea
            id="f-workflow"
            name="workflow"
            rows={3}
            required
            maxLength={3000}
            placeholder="e.g. customers book on WhatsApp and someone checks the calendar by hand"
            {...err("workflow")}
          />
          {msg("workflow")}
        </div>
        <div className="field">
          <label htmlFor="f-pain">{labels.pain}</label>
          <textarea
            id="f-pain"
            name="pain"
            rows={3}
            required
            maxLength={3000}
            placeholder="e.g. replies are slow, bookings get double-entered, follow-ups get missed"
            {...err("pain")}
          />
          {msg("pain")}
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-tools">
              {labels.tools} <span className="opt">optional</span>
            </label>
            <input id="f-tools" name="tools" type="text" maxLength={500} placeholder="Google Sheets, Gmail, WhatsApp…" />
          </div>
          <div className="field">
            <label htmlFor="f-outcome">
              {labels.outcome} <span className="opt">optional</span>
            </label>
            <input id="f-outcome" name="outcome" type="text" maxLength={500} placeholder="e.g. bookings confirmed without anyone typing" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-timeline">
              Timeline <span className="opt">optional</span>
            </label>
            <select id="f-timeline" name="timeline" defaultValue="" {...err("timeline")}>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>
                  {t || "Not sure yet"}
                </option>
              ))}
            </select>
            {msg("timeline")}
          </div>
          <div className="field">
            <label htmlFor="f-budget">
              Budget <span className="opt">optional</span>
            </label>
            <input id="f-budget" name="budget" type="text" maxLength={120} placeholder="a rough range is fine" />
          </div>
        </div>
      </fieldset>

      <fieldset className="cform__group" disabled={sending}>
        <legend className="label label--accent">02 · You</legend>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-name">Name</label>
            <input id="f-name" name="name" type="text" autoComplete="name" required maxLength={100} {...err("name")} />
            {msg("name")}
          </div>
          <div className="field">
            <label htmlFor="f-email">Email</label>
            <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} {...err("email")} />
            {msg("email")}
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-phone">
              Phone number <span className="opt">optional</span>
            </label>
            <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={32} placeholder="+234…" {...err("phone")} />
            {msg("phone")}
          </div>
          <div className="field">
            <label htmlFor="f-business">
              Business / role <span className="opt">optional</span>
            </label>
            <input id="f-business" name="business" type="text" autoComplete="organization" maxLength={120} />
          </div>
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-hp">Leave this empty</label>
          <input id="f-hp" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>

      <div className="cform__submit">
        <button type="submit" className="btn btn--primary btn--lg" disabled={sending} aria-disabled={sending}>
          {sending ? (
            <>
              <span className="spinner" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send it <ArrowIcon />
            </>
          )}
        </button>
        <p className="muted cform__note">Goes straight to my inbox. I reply by email.</p>
      </div>

      <div aria-live="assertive">
        {state === "error" && (
          <div className="form-msg form-msg--error" role="alert">
            <p>
              <strong>{errorMsg}</strong> Nothing you typed is lost: you can{" "}
              <a href={fallback}>send it from your email app instead</a>, or write to me at{" "}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
