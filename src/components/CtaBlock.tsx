import Link from "next/link";
import { contactOptions, site } from "@/config/site";
import { ArrowIcon, CalendarIcon, ExternalIcon, FormIcon, MailIcon, XLogo } from "./icons";

const optionIcon = { form: FormIcon, email: MailIcon, x: XLogo, calendar: CalendarIcon };

/** Contact options. Renders from config, so a calendar link appears automatically when set. */
export function ContactOptions({ includeForm = true, variant = "row" }: { includeForm?: boolean; variant?: "row" | "stack" | "pills" }) {
  return (
    <ul role="list" className={`copts copts--${variant}`}>
      {contactOptions({ includeForm }).map((o) => {
        const Icon = optionIcon[o.id];
        const inner = (
          <>
            <span className="copts__icon">
              <Icon size={16} />
            </span>
            <span className="copts__text">
              <span className="copts__label">{o.label}</span>
              <span className="copts__meta">{o.meta}</span>
            </span>
            <span className="copts__go">{o.external ? <ExternalIcon /> : <ArrowIcon size={14} />}</span>
          </>
        );
        return (
          <li key={o.id} className={`copts__item copts__item--${o.id}`}>
            {o.id === "form" ? (
              <Link href={o.href} className="copts__link">
                {inner}
              </Link>
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

/** Closing call to action: the aurora band, as on AmpliQ's waitlist section. */
export function CtaBlock({
  eyebrow = "Next step",
  title,
  body = "Describe it in plain words: what happens now, where it gets stuck, which tools are involved. I’ll tell you honestly whether automation is the right fix, and what I’d build.",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta__inner" data-reveal>
          <p className="eyebrow-pill">
            <span className="eyebrow-pill__dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="cta-title" className="display cta__title">
            {title ?? (
              <>
                Show me the process <em>that’s slowing you down.</em>
              </>
            )}
          </h2>
          <p className="lede cta__body">{body}</p>
          <div className="cta__actions">
            <Link href={site.primaryCta.href} className="btn btn--primary btn--lg">
              Start a project <ArrowIcon />
            </Link>
          </div>
          <div className="cta__direct">
            <span className="cta__direct-k">Or reach me directly</span>
            <ContactOptions includeForm={false} variant="pills" />
          </div>
        </div>
      </div>
    </section>
  );
}
