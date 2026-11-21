import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { sortedProjects } from "@/data/projects";
import { Portrait } from "@/components/Portrait";
import { CtaBlock, ContactOptions } from "@/components/CtaBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHero } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, what I build, and why I care about automation that holds up on a bad day.",
};

export default function AboutPage() {
  const live = sortedProjects.filter((p) => p.status.tier === "live");
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            I’m Hubroot. I build the systems <em>behind the busywork.</em>
          </>
        }
        lede={`${site.title} · ${site.tagline}`}
      />

      <section className="section">
        <div className="container about-page">
          <div className="about-page__photo" data-reveal>
            <Portrait priority />
            <div className="name-card">
              <span className="name-card__dot" aria-hidden="true" />
              <span>
                <strong>{site.name}</strong>
                <span className="name-card__role">{site.title}</span>
              </span>
            </div>
          </div>

          <div data-reveal style={{ ["--reveal-delay" as string]: "0.1s" }}>
            {/*
              NOTE FOR HUBROOT: this copy is a starting draft written from the brief.
              Replace it with your own words: how you got into this, what you were doing before,
              a real story from a build. Keep it in your voice, it can be informal.
            */}
            <div className="prose about-page__prose">
              <p>
                I’m an AI automation engineer. In plain terms, I look at the repetitive work that keeps a business running,
                the booking replies, the follow-ups, the copy-pasting between sheets, and I build systems that do it
                properly.
              </p>
              <p>
                I don’t start with the tools. I start with how the work actually happens today, including the messy bits
                nobody writes down. Then I build around that, connecting whatever the team already uses, instead of asking
                everyone to move to something new.
              </p>
              <p>
                The part I care about most is reliability. Anybody can make a demo work with clean data. I want to know what
                happens when the customer sends a voice note instead of text, when the calendar API times out, when a field
                is empty. I design for those cases on purpose, and I make sure a person is in the loop where judgement
                matters.
              </p>
              <p>
                I also don’t like hiding what state things are in. Everything on this site has an honest label: in
                production, completed build, pilot, prototype. That’s just how I prefer to work.
              </p>
            </div>

            <dl className="facts">
              <div>
                <dt>Role</dt>
                <dd>
                  {site.title} · {site.tagline}
                </dd>
              </div>
              <div>
                <dt>Systems built</dt>
                <dd>
                  {sortedProjects.length} documented on this site · <Link href="/work">see all</Link>
                </dd>
              </div>
              <div className="facts__wide">
                <dt>In real use</dt>
                <dd style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {live.map((p) => (
                    <Link key={p.slug} href={`/work/${p.slug}`} style={{ textDecoration: "none" }}>
                      <StatusBadge status={p.status} />
                      <span className="sr-only">: {p.title}</span>
                    </Link>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Works with</dt>
                <dd>n8n, WhatsApp Cloud API, Cal.com, Airtable, Google Sheets, Gmail, Supabase, OpenAI, ElevenLabs, Next.js</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Business operations: booking, outreach, support, e-commerce, recruitment, back-office</dd>
              </div>
            </dl>

            <div className="aside-card" style={{ marginTop: 40 }}>
              <p className="label label--accent" style={{ marginBottom: 16 }}>
                Say hello
              </p>
              <ContactOptions variant="stack" />
            </div>
          </div>
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
