import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ContactOptions } from "@/components/CtaBlock";
import { Portrait } from "@/components/Portrait";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell me what you’re trying to automate. A short form, or email / X if you prefer.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="label">Contact · start a project</p>
          <h1 className="display page-hero__title">
            Tell me what you’re <em>trying to automate.</em>
          </h1>
          <p className="lede">
            You don’t need to know the technical side. Just describe what happens now and what’s annoying about it. A few
            sentences is plenty.
          </p>
        </div>
      </section>

      <section className="section section--tight" id="start" aria-label="Project form">
        <div className="container contact-grid">
          <ContactForm />

          <aside className="contact-aside" aria-label="Other ways to reach me">
            <div className="contact-me">
              <Portrait size="small" />
              <div>
                <p style={{ fontWeight: 560 }}>{site.name}</p>
                <p className="mono muted" style={{ fontSize: "0.75rem" }}>
                  {site.title}
                </p>
              </div>
            </div>
            <div>
              <p className="label" style={{ marginBottom: 12 }}>
                Prefer to reach me directly?
              </p>
              <ContactOptions includeForm={false} variant="stack" />
            </div>
            <div>
              <p className="label">What happens next</p>
              <ol role="list" className="what-next">
                <li>
                  <span className="mono">01</span> I read what you sent properly.
                </li>
                <li>
                  <span className="mono">02</span> I reply by email, usually with a couple of questions about how the
                  process runs.
                </li>
                <li>
                  <span className="mono">03</span> If it’s a good fit, we map the workflow together and I scope the
                  system.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
