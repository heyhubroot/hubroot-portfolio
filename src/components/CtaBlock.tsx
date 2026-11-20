import Link from "next/link";
import { contactOptions, site } from "@/config/site";
import { ArrowIcon, CalendarIcon, ExternalIcon, FormIcon, MailIcon, XLogo } from "./icons";

const optionIcon = { form: FormIcon, email: MailIcon, x: XLogo, calendar: CalendarIcon };

/** Inline row of contact options. Renders from config, so a calendar link appears automatically when set. */
export function ContactOptions({ includeForm = true, variant = "row" }: { includeForm?: boolean; variant?: "row" | "stack" }) {
  return (
    <ul role="list" className={`copts copts--${variant}`}>
      {contactOptions({ includeForm }).map((o) => {
        const Icon = optionIcon[o.id];
        const inner = (
          <>
            <Icon size={16} />
            <span className="copts__text">
              <span className="copts__label">{o.label}</span>
              <span className="copts__meta mono">{o.meta}</span>
            </span>
            {o.external ? <ExternalIcon /> : <ArrowIcon size={14} />}
          </>
        );
        return (
          <li key={o.id} className={`copts__item copts__item--${o.id}`}>
            {o.id === "form" ? (
              <Link href={o.href} className="copts__link">{inner}</Link>
            ) : (
              <a href={o.href} className="copts__link" {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function CtaBlock({
  eyebrow = "Next step",
  title,
  body = "Describe the workflow in your own words. What happens now, where it hurts, which tools are involved. I’ll read it and get back to you.",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="cta section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta__inner">
          <div className="cta__copy">
            <p className="label label--accent">{eyebrow}</p>
            <h2 id="cta-title" className="display h2">
              {title ?? <>Tell me what you’re <em>trying to automate.</em></>}
            </h2>
            <p className="lede">{body}</p>
            <Link href={site.primaryCta.href} className="btn btn--primary btn--lg">
              {site.primaryCta.label} <ArrowIcon />
            </Link>
          </div>
          <div className="cta__side">
            <p className="label">Or reach me directly</p>
            <ContactOptions includeForm={false} variant="stack" />
          </div>
        </div>
      </div>
    </section>
  );
}
