import Link from "next/link";
import { site } from "@/config/site";
import { featuredProjects, getProject, sortedProjects } from "@/data/projects";
import { services } from "@/data/services";
import { faqs, problems, processSteps, reliabilityPillars } from "@/data/content";
import { SectionHead, Accordion, HeroMotif } from "@/components/Blocks";
import { ProjectCard } from "@/components/ProjectCard";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ExceptionExplorer } from "@/components/ExceptionExplorer";
import { CtaBlock } from "@/components/CtaBlock";
import { Portrait } from "@/components/Portrait";
import { ArrowIcon, MailIcon, NodeGlyph, ToolIcon, XLogo } from "@/components/icons";

export default function Home() {
  const demo = getProject("whatsapp-appointment-booking")!;
  const liveCount = sortedProjects.filter((p) => p.status.tier === "live").length;

  return (
    <>
      {/* 1 · HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero__grid">
            <div>
              <p className="label">
                <span className="label--accent">●</span> {site.title} · {site.tagline}
              </p>
              <h1 id="hero-title" className="display hero__title" style={{ marginTop: 24 }}>
                I design and build AI-powered automation systems that <em>remove repetitive operational work.</em>
              </h1>
              <p className="lede hero__sub">
                I build around the way your business already runs. I connect the tools you’re already using, plan for the
                cases where things go wrong, and make sure the team that depends on it can actually understand it.
              </p>
              <div className="hero__actions">
                <Link href={site.primaryCta.href} className="btn btn--primary btn--lg">
                  {site.primaryCta.label} <ArrowIcon />
                </Link>
                <div className="hero__direct">
                  <a href={`mailto:${site.contact.email}`}>
                    <MailIcon /> Email
                  </a>
                  <a href={site.contact.x.url} target="_blank" rel="noopener noreferrer">
                    <XLogo /> {site.contact.x.handle}
                  </a>
                </div>
              </div>
            </div>
            <HeroMotif />
          </div>
          <div className="hero__meta">
            <span className="label">{sortedProjects.length} systems documented</span>
            <span className="label">{liveCount} in real use</span>
            <span className="label">exceptions + handoffs shown for each one</span>
          </div>
        </div>
      </section>

      {/* 2 · PROBLEM RECOGNITION */}
      <section className="section section--ruled" aria-labelledby="problems-title">
        <div className="container">
          <SectionHead
            index="01"
            label="Sound familiar?"
            id="problems-title"
            title="The work that quietly eats your week."
            intro="None of these is a big dramatic problem. They just keep happening, every day, and somebody on your team is always the one covering for them."
          />
          <ul role="list" className="problems">
            {problems.map((p, i) => (
              <li key={p.title} className="problem">
                <span className="mono problem__n">⚠ {String(i + 1).padStart(2, "0")}</span>
                <h3 className="h4">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · WHAT I BUILD */}
      <section className="section section--ruled" aria-labelledby="build-title">
        <div className="container">
          <SectionHead
            index="02"
            label="What I build"
            id="build-title"
            title="Systems for specific parts of the business."
            intro="I don’t sell tools. I look at one workflow, work out where it breaks, and build the system that runs it properly."
          />
          <ul role="list" className="cards cards--3">
            {services.map((s) => (
              <li key={s.id} className="card">
                <h3 className="h4">{s.name}</h3>
                <p className="card__problem">{s.problem}</p>
                <div className="card__tags">
                  {s.includes.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 32 }}>
            <Link href="/services" className="link-arrow">
              What each system actually does <ArrowIcon size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* 4 · SELECTED WORK */}
      <section className="section section--ruled" aria-labelledby="work-title">
        <div className="container">
          <SectionHead
            index="03"
            label="Selected work"
            id="work-title"
            title="Things I’ve built, and what state they’re in."
            intro="Every project has an honest status label. Some are running for clients, some are completed builds, some are prototypes. I’d rather you know which is which."
          />
          <ul role="list" className="pgrid pgrid--3">
            {featuredProjects.map((p, i) => (
              <li key={p.slug}>
                <ProjectCard project={p} index={i} />
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 32 }}>
            <Link href="/work" className="link-arrow">
              See all {sortedProjects.length} systems <ArrowIcon size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* 5 · SYSTEM VISUALIZATION (control-room band) */}
      <section className="section system-surface" aria-labelledby="viz-title">
        <div className="container">
          <SectionHead
            index="04"
            label="From messy to reliable"
            id="viz-title"
            title={<>Same work. Different <em>system.</em></>}
            intro={
              <>
                This is the WhatsApp booking system I built for a client. Switch between how it ran by hand and how it runs
                now. Click any step, or walk through it, and look at what happens when something goes wrong.
              </>
            }
          />
          <BeforeAfter before={demo.before} flow={demo.flow} exceptions={demo.exceptions} />
          <p style={{ marginTop: 24 }}>
            <Link href={`/work/${demo.slug}`} className="link-arrow">
              Read the full case study <ArrowIcon size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* 6 · HOW I WORK */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHead
            index="05"
            label="How I work"
            id="how-title"
            title="Understand it first. Then build it."
            intro="Most automation goes wrong because somebody started building before they understood the process. I do it the other way round."
          />
          <ol role="list" className="process-strip">
            {processSteps.map((s, i) => (
              <li key={s.id}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <strong>{s.short}</strong>
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 32 }}>
            <Link href="/how-i-work" className="link-arrow">
              What happens at each step <ArrowIcon size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* 7 · RELIABILITY */}
      <section className="section section--ruled" aria-labelledby="rel-title">
        <div className="container">
          <SectionHead
            index="06"
            label="Reliability"
            id="rel-title"
            title="The happy path is the easy part."
            intro="Any demo works when the data is clean. What matters is what happens on a bad day, so the failure paths and handoffs are part of the build from the start."
          />
          <ul role="list" className="pillars">
            {reliabilityPillars.map((p) => (
              <li key={p.title} className={`pillar pillar--${p.kind}`}>
                <span className="pillar__icon">
                  <NodeGlyph kind={p.kind} size={18} />
                </span>
                <h3 className="h4">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 48 }}>
            <p className="label" style={{ marginBottom: 16 }}>
              Try it · failure scenarios from the booking system
            </p>
            <ExceptionExplorer exceptions={demo.exceptions} flow={demo.flow} />
          </div>
        </div>
      </section>

      {/* 8 · ABOUT */}
      <section className="section section--ruled" aria-labelledby="about-title">
        <div className="container about-grid">
          <Portrait />
          <div>
            <p className="label">
              <span className="label--accent">07</span> About
            </p>
            <h2 id="about-title" className="display h2" style={{ marginTop: 16, maxWidth: "16ch" }}>
              Hi, I’m Hubroot.
            </h2>
            <div className="prose" style={{ marginTop: 24 }}>
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
            <ul role="list" className="card__tools" style={{ marginTop: 28 }} aria-label="Tools I work with">
              {(["n8n", "whatsapp", "calcom", "airtable", "googlesheets", "gmail", "supabase", "openai", "elevenlabs", "nextjs"] as const).map((t) => (
                <li key={t}>
                  <ToolIcon id={t} size={18} />
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 28 }}>
              <Link href="/about" className="link-arrow">
                More about me <ArrowIcon size={14} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 9 · FAQ */}
      <section className="section section--ruled" aria-labelledby="faq-title">
        <div className="container grid-12">
          <div className="col-4">
            <p className="label">
              <span className="label--accent">08</span> Questions
            </p>
            <h2 id="faq-title" className="display h2" style={{ marginTop: 16 }}>
              Before you ask.
            </h2>
          </div>
          <div className="col-8">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      {/* 10 · FINAL CTA */}
      <CtaBlock />
    </>
  );
}
