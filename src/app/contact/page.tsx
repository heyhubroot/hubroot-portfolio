import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ContactOptions } from "@/components/CtaBlock";
import { Portrait } from "@/components/Portrait";
import { PageHero, Window } from "@/components/Blocks";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell me what you’re trying to automate. A short form, or email / X if you prefer.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · start a project"
        title={
          <>
            Tell me what you’re <em>trying to automate.</em>
          </>
        }
        lede="You don’t need to know the technical side. Just describe what happens now and what’s annoying about it. A few sentences is plenty."
      />

      <section className="section section--tight section--band" id="start" aria-label="Project form">
        <div className="container contact-grid">
          <Window title="New project enquiry" meta={<span className="window__live">Goes to my inbox</span>}>
            <ContactForm />
          </Window>

          <aside className="contact-aside" aria-label="Other ways to reach me">
            <div className="aside-card">
              <div className="contact-me">
                <Portrait size="small" />
                <div>
                  <p className="contact-me__name">{site.name}</p>
                  <p className="contact-me__role">{site.title}</p>
                </div>
              </div>
            </div>
            <div className="aside-card">
              <p className="label label--accent">Prefer to reach me directly?</p>
              <ContactOptions includeForm={false} variant="stack" />
            </div>
            <div className="aside-card">
              <p className="label label--accent">What happens next</p>
              <ol role="list" className="what-next">
                <li>
                  <span className="what-next__n">01</span>
                  <span>I read what you sent properly.</span>
                </li>
                <li>
                  <span className="what-next__n">02</span>
                  <span>I reply by email, usually with a couple of questions about how the process runs.</span>
                </li>
                <li>
                  <span className="what-next__n">03</span>
                  <span>If it’s a good fit, we map the workflow together and I scope the system.</span>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
