import Link from "next/link";
import { site } from "@/config/site";
import { featuredProjects, getProject, sortedProjects } from "@/data/projects";
import { services } from "@/data/services";
import { faqs, problems, processSteps, reliabilityPillars } from "@/data/content";
import { ORBIT, tools } from "@/data/tools";
import type { ServiceId } from "@/data/types";
import { SectionHead, Accordion, Window } from "@/components/Blocks";
import { ProjectCard } from "@/components/ProjectCard";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ExceptionExplorer } from "@/components/ExceptionExplorer";
import { CtaBlock } from "@/components/CtaBlock";
import { Portrait } from "@/components/Portrait";
import { HeroSystem } from "@/components/HeroSystem";
import { ProcessTabs } from "@/components/ProcessTabs";
import { Words } from "@/components/Reveal";
import { ArrowIcon, CalendarIcon, FormIcon, MailIcon, NodeGlyph, ToolIcon } from "@/components/icons";

/** Each service gets a tint + a glyph, so the grid reads as categories, not identical boxes. */
const serviceLook: Record<ServiceId, { tint: string; icon: React.ReactNode }> = {
  booking: { tint: "indigo", icon: <CalendarIcon size={20} /> },
  outreach: { tint: "sky", icon: <MailIcon size={20} /> },
  support: { tint: "mint", icon: <NodeGlyph kind="notification" size={20} /> },
  ecommerce: { tint: "amber", icon: <NodeGlyph kind="integration" size={20} /> },
  recruitment: { tint: "lilac", icon: <NodeGlyph kind="actor" size={20} /> },
  backoffice: { tint: "sky", icon: <ToolIcon id="docs" size={20} title="" /> },
  "internal-tools": { tint: "indigo", icon: <NodeGlyph kind="ai" size={20} /> },
};

const pillarTint = { exception: "amber", human: "mint", monitoring: "indigo", database: "sky" } as const;

export default function Home() {
  const demo = getProject("whatsapp-appointment-booking")!;
  const liveCount = sortedProjects.filter((p) => p.status.tier === "live").length;
  const [lead, second, ...rest] = featuredProjects;

  return (
    <>
      {/* ───────────── 1 · HERO ───────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container container--wide hero__stage">
          <ul className="hero__tiles" role="list" aria-hidden="true">
            {(["whatsapp", "calcom", "n8n", "googlesheets", "gmail", "openai"] as const).map((t, i) => (
              <li key={t} className={`tile tile--${i + 1}`}>
                <ToolIcon id={t} size={26} brandColor title="" />
              </li>
            ))}
          </ul>

          <div className="hero__copy">
            <p className="eyebrow-pill hero__eyebrow">
              <span className="eyebrow-pill__dot" aria-hidden="true" />
              {site.title}
            </p>
            <h1 id="hero-title" className="display hero__title">
              <Words text="Stop doing it all by hand." step={0.07} />{" "}
              <Words text="Let systems do the work." start={0.5} step={0.08} accent />
            </h1>
            <p className="hero__sub">
              I build AI automation around the tools you already use, with a person stepping in when it matters.
            </p>
            <div className="hero__actions">
              <Link href={site.primaryCta.href} className="btn btn--primary btn--lg">
                Start a project <ArrowIcon />
              </Link>
              <Link href="/work" className="btn btn--soft btn--lg">
                See the work <ArrowIcon />
              </Link>
            </div>
            <ul role="list" className="hero__facts">
              <li>
                <span className="hero__fact-n">{sortedProjects.length}</span> systems built
              </li>
              <li>
                <span className="hero__fact-dot" aria-hidden="true" />
                <span className="hero__fact-n">{liveCount}</span> in real use
              </li>
              <li>
                <NodeGlyph kind="human" size={16} /> Human handoffs built in
              </li>
            </ul>
          </div>
        </div>

        <div className="container hero__visual">
          <HeroSystem project={demo} />
        </div>
      </section>

      {/* ───────────── tools marquee ───────────── */}
      <section className="marquee" aria-label="Tools I build with">
        <p className="marquee__k">Built around the tools teams already use</p>
        <div className="marquee__viewport">
          <ul role="list" className="marquee__track">
            {[...ORBIT, ...ORBIT].map((id, i) => (
              <li key={`${id}-${i}`} aria-hidden={i >= ORBIT.length ? true : undefined}>
                <ToolIcon id={id} size={20} brandColor title="" />
                {tools[id].name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── 2 · PROBLEMS ───────────── */}
      <section className="section section--band" aria-labelledby="problems-title">
        <div className="container split">
          <div className="split__aside">
            <div className="split__sticky" data-reveal>
              <p className="label label--accent">
                <span className="label__n">01</span>Sound familiar?
              </p>
              <h2 id="problems-title" className="display h2 split__title">
                The work that quietly <em>eats your week.</em>
              </h2>
              <p className="split__intro">
                None of these is a big dramatic problem. They just keep happening, every day, and somebody on your team is
                always the one covering for them.
              </p>
            </div>
          </div>
          <ul role="list" className="problems">
            {problems.map((p, i) => (
              <li key={p.title} className="problem" data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 0.08}s` }}>
                <span className="problem__n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="problem__title">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="swipe-hint" aria-hidden="true">
            Swipe for more <ArrowIcon size={14} />
          </p>
        </div>
      </section>

      {/* ───────────── 3 · WHAT I BUILD ───────────── */}
      <section className="section" aria-labelledby="build-title">
        <div className="container">
          <SectionHead
            index="02"
            label="What I build"
            id="build-title"
            title={
              <>
                Systems for specific <em>parts of the business.</em>
              </>
            }
            intro="I don’t sell tools. I look at one workflow, work out where it breaks, and build the system that runs it properly."
          />
          <ul role="list" className="svc-grid">
            {services.map((s, i) => {
              const look = serviceLook[s.id];
              return (
                <li key={s.id} className={`svc-card tint--${look.tint}`} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 4) * 0.06}s` }}>
                  <span className="svc-card__icon">{look.icon}</span>
                  <h3 className="svc-card__name">{s.name}</h3>
                  <p className="svc-card__problem">{s.problem}</p>
                  <ul role="list" className="svc-card__tools" aria-label="Typical tools">
                    {s.tools.slice(0, 4).map((t) => (
                      <li key={t} title={tools[t].name}>
                        <ToolIcon id={t} size={14} />
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
            <li className="svc-card svc-card--link" data-reveal style={{ ["--reveal-delay" as string]: "0.18s" }}>
              <Link href="/services" className="svc-card__more">
                <span className="label label--accent">Services</span>
                <span className="svc-card__more-title">What each system actually does</span>
                <span className="svc-card__more-go" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          </ul>
          <p className="swipe-hint" aria-hidden="true">
            Swipe for more <ArrowIcon size={14} />
          </p>
        </div>
      </section>

      {/* ───────────── 4 · SELECTED WORK ───────────── */}
      <section className="section section--band" aria-labelledby="work-title">
        <div className="container">
          <SectionHead
            index="03"
            label="Selected work"
            id="work-title"
            title={
              <>
                Things I’ve built, <em>and what state they’re in.</em>
              </>
            }
            intro="Every project has an honest status label. Some are running for clients, some are completed builds, some are prototypes. I’d rather you know which is which."
          />
          <ul role="list" className="work-bento">
            <li className="work-bento__lead" data-reveal>
              <ProjectCard project={lead} index={0} variant="feature" />
            </li>
            <li data-reveal style={{ ["--reveal-delay" as string]: "0.08s" }}>
              <ProjectCard project={second} index={1} />
            </li>
            {rest.map((p, i) => (
              <li key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 0.08}s` }}>
                <ProjectCard project={p} index={i + 2} />
              </li>
            ))}
            <li className="work-bento__all" data-reveal>
              <Link href="/work" className="all-card">
                <span className="all-card__n">{sortedProjects.length}</span>
                <span className="all-card__text">
                  <span className="all-card__title">See all {sortedProjects.length} systems</span>
                  <span className="all-card__sub">Filter by business area or by how proven they are.</span>
                </span>
                <span className="all-card__go" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ───────────── 5 · SYSTEM VISUALIZATION (showcase band) ───────────── */}
      <section className="section showcase" aria-labelledby="viz-title">
        <div className="container">
          <SectionHead
            align="center"
            index="04"
            label="From messy to reliable"
            id="viz-title"
            title={
              <>
                Same work. <em>Different system.</em>
              </>
            }
            intro="This is the WhatsApp booking system I built for a client. Switch between how it ran by hand and how it runs now. Click any step, or walk through it, and look at what happens when something goes wrong."
          />
          <div data-reveal>
            <Window title={`n8n / ${demo.slug}`} meta={<span className="window__live">In real use</span>} className="showcase__window">
              <BeforeAfter before={demo.before} flow={demo.flow} exceptions={demo.exceptions} />
            </Window>
          </div>
          <p className="showcase__foot">
            <Link href={`/work/${demo.slug}`} className="btn btn--glass">
              Read the full case study <ArrowIcon size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* ───────────── 6 · HOW I WORK ───────────── */}
      <section className="section" aria-labelledby="how-title">
        <div className="container split split--wide">
          <div className="split__aside">
            <div className="split__sticky" data-reveal>
              <p className="label label--accent">
                <span className="label__n">05</span>How I work
              </p>
              <h2 id="how-title" className="display h2 split__title">
                Understand it first. <em>Then build it.</em>
              </h2>
              <p className="split__intro">
                Most automation goes wrong because somebody started building before they understood the process. I do it the
                other way round.
              </p>
              <Link href="/how-i-work" className="link-arrow">
                What happens at each step <ArrowIcon size={16} />
              </Link>
            </div>
          </div>
          <div data-reveal style={{ ["--reveal-delay" as string]: "0.1s" }}>
            <ProcessTabs steps={processSteps} />
          </div>
        </div>
      </section>

      {/* ───────────── 7 · RELIABILITY ───────────── */}
      <section className="section section--band" aria-labelledby="rel-title">
        <div className="container">
          <SectionHead
            index="06"
            label="Reliability"
            id="rel-title"
            title={
              <>
                The happy path is <em>the easy part.</em>
              </>
            }
            intro="Any demo works when the data is clean. What matters is what happens on a bad day, so the failure paths and handoffs are part of the build from the start."
          />
          <ul role="list" className="pillars">
            {reliabilityPillars.map((p, i) => (
              <li key={p.title} className={`pillar tint--${pillarTint[p.kind]}`} data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.06}s` }}>
                <span className="pillar__icon">
                  <NodeGlyph kind={p.kind} size={20} />
                </span>
                <h3 className="pillar__title">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="rel-try" data-reveal>
            <div className="rel-try__head">
              <p className="label label--accent">Try it</p>
              <p className="rel-try__title">Failure scenarios from the booking system</p>
            </div>
            <ExceptionExplorer exceptions={demo.exceptions} flow={demo.flow} />
          </div>
        </div>
      </section>

      {/* ───────────── 8 · ABOUT ───────────── */}
      <section className="section" aria-labelledby="about-title">
        <div className="container about-home">
          <div className="about-home__photo" data-reveal>
            <Portrait />
            <div className="name-card">
              <span className="name-card__dot" aria-hidden="true" />
              <span>
                <strong>{site.name}</strong>
                <span className="name-card__role">{site.title}</span>
              </span>
            </div>
          </div>
          <div className="about-home__copy" data-reveal style={{ ["--reveal-delay" as string]: "0.1s" }}>
            <p className="label label--accent">
              <span className="label__n">07</span>About
            </p>
            <h2 id="about-title" className="display h2">
              Hi, I’m <em>Hubroot.</em>
            </h2>
            <div className="prose about-home__prose">
              <p>
                I build automation systems for business operations. Booking flows, outreach pipelines, order tracking,
                returns, support assistants, small internal tools. Most of them start with somebody on a team doing the same
                thing by hand every day.
              </p>
              <p>
                I care more about the system working on a bad day than looking good in a demo. So I spend a lot of time on
                the boring parts: what happens when data is missing, when an API fails, when a customer says something the
                bot doesn’t understand. Those are the bits that decide if people trust it.
              </p>
            </div>
            <ul role="list" className="tool-chips" aria-label="Tools I work with">
              {(["n8n", "whatsapp", "calcom", "airtable", "googlesheets", "gmail", "supabase", "openai", "elevenlabs", "nextjs"] as const).map((t) => (
                <li key={t}>
                  <ToolIcon id={t} size={16} brandColor title="" />
                  {tools[t].name}
                </li>
              ))}
            </ul>
            <Link href="/about" className="link-arrow">
              More about me <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── 9 · FAQ ───────────── */}
      <section className="section section--band" aria-labelledby="faq-title">
        <div className="container split">
          <div className="split__aside">
            <div className="split__sticky" data-reveal>
              <p className="label label--accent">
                <span className="label__n">08</span>Questions
              </p>
              <h2 id="faq-title" className="display h2 split__title">
                Before <em>you ask.</em>
              </h2>
              <p className="split__intro">Still not sure? Ask me directly. A short message is fine.</p>
              <Link href={site.primaryCta.href} className="link-arrow">
                <FormIcon size={16} /> Start with the short form
              </Link>
            </div>
          </div>
          <div data-reveal>
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      {/* ───────────── 10 · FINAL CTA ───────────── */}
      <CtaBlock />
    </>
  );
}
