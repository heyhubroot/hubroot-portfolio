"use client";

import { useState } from "react";
import { site } from "@/config/site";

type State = "idle" | "sending" | "sent" | "mailto" | "error";

const fields = {
  workflow: "What workflow do you want to automate?",
  pain: "What’s the painful part right now?",
  tools: "Which tools are involved?",
  outcome: "What would “working” look like?",
};

/**
 * Short qualifying form.
 * - If site.contact.formEndpoint is set, it POSTs JSON there (Formspree / Netlify function / n8n webhook…).
 * - Otherwise it opens the visitor's email app with everything pre-filled. Nothing is lost either way.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [mailBody, setMailBody] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.company_website) return; // honeypot

    const endpoint = site.contact.formEndpoint;
    if (endpoint) {
      setState("sending");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        setState("sent");
        form.reset();
      } catch {
        setState("error");
      }
      return;
    }

    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.business ? `Business / role: ${data.business}` : "",
      "",
      `${fields.workflow}\n${data.workflow}`,
      "",
      `${fields.pain}\n${data.pain}`,
      "",
      `${fields.tools}\n${data.tools || "-"}`,
      "",
      `${fields.outcome}\n${data.outcome || "-"}`,
      "",
      `Timeline: ${data.timeline || "not sure yet"}`,
      `Budget: ${data.budget || "not shared"}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
    setMailBody(body);
    const subject = `Automation enquiry: ${data.workflow.slice(0, 60)}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setState("mailto");
  }

  if (state === "sent") {
    return (
      <div className="form-done" role="status">
        <p className="label label--accent">Received</p>
        <p className="h3">Thanks, I’ve got it.</p>
        <p className="muted">I’ll read through it properly and reply by email.</p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate>
      <fieldset className="cform__group">
        <legend className="label">01 · The workflow</legend>
        <div className="field">
          <label htmlFor="f-workflow">{fields.workflow}</label>
          <textarea id="f-workflow" name="workflow" rows={3} required placeholder="e.g. customers book on WhatsApp and someone checks the calendar by hand" />
        </div>
        <div className="field">
          <label htmlFor="f-pain">{fields.pain}</label>
          <textarea id="f-pain" name="pain" rows={3} required placeholder="e.g. replies are slow, bookings get double-entered, follow-ups get missed" />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-tools">
              {fields.tools} <span className="opt">optional</span>
            </label>
            <input id="f-tools" name="tools" type="text" placeholder="Google Sheets, Gmail, WhatsApp…" />
          </div>
          <div className="field">
            <label htmlFor="f-outcome">
              {fields.outcome} <span className="opt">optional</span>
            </label>
            <input id="f-outcome" name="outcome" type="text" placeholder="e.g. bookings confirmed without anyone typing" />
          </div>
        </div>
      </fieldset>

      <fieldset className="cform__group">
        <legend className="label">02 · Timing <span className="opt">optional</span></legend>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-timeline">Timeline</label>
            <select id="f-timeline" name="timeline" defaultValue="">
              <option value="">Not sure yet</option>
              <option>As soon as possible</option>
              <option>Within the next month</option>
              <option>In 1–3 months</option>
              <option>Just exploring</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-budget">Budget</label>
            <input id="f-budget" name="budget" type="text" placeholder="a rough range is fine" />
          </div>
        </div>
      </fieldset>

      <fieldset className="cform__group">
        <legend className="label">03 · You</legend>
        <div className="field-row">
          <div className="field">
            <label htmlFor="f-name">Name</label>
            <input id="f-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="f-email">Email</label>
            <input id="f-email" name="email" type="email" autoComplete="email" required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="f-business">
            Business / role <span className="opt">optional</span>
          </label>
          <input id="f-business" name="business" type="text" autoComplete="organization" />
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-hp">Leave this empty</label>
          <input id="f-hp" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>

      <div className="cform__submit">
        <button type="submit" className="btn btn--primary btn--lg" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
        <p className="muted cform__note">
          {site.contact.formEndpoint
            ? "Goes straight to my inbox."
            : "This opens your email app with everything filled in, so you can check it before it sends."}
        </p>
      </div>

      {state === "error" && (
        <p className="form-msg form-msg--error" role="alert">
          Something went wrong sending that. Please email me directly at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      )}
      {state === "mailto" && (
        <div className="form-msg" role="status">
          <p>
            Your email app should have opened with this filled in. If nothing happened, copy the text below and send it to{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
          </p>
          <textarea readOnly rows={6} value={mailBody} aria-label="Your message, ready to copy" onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
    </form>
  );
}
