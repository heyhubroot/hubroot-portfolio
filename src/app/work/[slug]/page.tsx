import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, sortedProjects } from "@/data/projects";
import { serviceName } from "@/data/services";
import { tools } from "@/data/tools";
import { StatusBadge, HumanLoopBadge } from "@/components/StatusBadge";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ExceptionExplorer } from "@/components/ExceptionExplorer";
import { DecisionLog, MediaEvidence, SectionHead, Window } from "@/components/Blocks";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaBlock } from "@/components/CtaBlock";
import { ArrowIcon, NodeGlyph, ToolIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sortedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

/**
 * CASE STUDY TEMPLATE
 * Opening → Why it mattered → System concept → Interactive workflow (showcase band) → Key decisions →
 * Reliability layer → Evidence → What this demonstrates → Technology → More work → CTA
 */
export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = sortedProjects.findIndex((x) => x.slug === p.slug);
  const next = sortedProjects[(idx + 1) % sortedProjects.length];
  const prev = sortedProjects[(idx - 1 + sortedProjects.length) % sortedProjects.length];
  const humanPoints = [
    ...p.flow.filter((n) => n.kind === "human").map((n) => n.label),
    ...p.exceptions.filter((e) => e.owner === "human").map((e) => `${e.trigger} → ${e.ownerLabel ?? "a person"}`),
  ];

  return (
    <article>
      {/* OPENING */}
      <header className="cs-hero">
        <div className="container cs-hero__grid">
          <div className="page-hero__main">
            <nav aria-label="Breadcrumb" className="crumbs">
              <Link href="/work">
                <ArrowIcon size={14} className="flip" /> All work
              </Link>
              <span aria-current="page">Case study {String(idx + 1).padStart(2, "0")}</span>
            </nav>
            <StatusBadge status={p.status} showTier />
            <h1 className="display cs-hero__title">{p.title}</h1>
            <p className="lede cs-hero__lede">{p.opening}</p>
          </div>
          <dl className="cs-meta page-hero__side">
            <div>
              <dt className="label">Status</dt>
              <dd>{p.status.label}</dd>
            </div>
            <div>
              <dt className="label">Area</dt>
              <dd>{p.services.map(serviceName).join(", ")}</dd>
            </div>
            <div>
              <dt className="label">Workflow</dt>
              <dd>
                {p.flow.length} steps · {p.exceptions.length} failure paths
                {humanPoints.length > 0 && <> · {humanPoints.length} human handoffs</>}
              </dd>
            </div>
            <div>
              <dt className="label">Stack</dt>
              <dd>
                <ul role="list" className="cs-meta__tools">
                  {p.stack.map((s) => (
                    <li key={s.tool} title={tools[s.tool].name}>
                      <ToolIcon id={s.tool} size={16} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="container">
        {/* WHY IT MATTERED */}
        <section className="cs-block" aria-labelledby="why">
          <div className="cs-block__head">
            <p className="label label--accent">01 · The problem</p>
            <h2 id="why">What the manual way was costing</h2>
          </div>
          <ul role="list" className="bullets">
            {p.whyItMattered.map((w) => (
              <li key={w} data-reveal>
                <span className="bullets__icon" aria-hidden="true">
                  <NodeGlyph kind="exception" size={16} />
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* SYSTEM CONCEPT */}
        <section className="cs-block" aria-labelledby="concept">
          <div className="cs-block__head">
            <p className="label label--accent">02 · The approach</p>
            <h2 id="concept">What I set out to build</h2>
          </div>
          <p className="cs-concept" data-reveal>
            {p.concept}
          </p>
        </section>
      </div>

      {/* INTERACTIVE WORKFLOW: showcase band */}
      <section className="system-surface system-band" aria-labelledby="system">
        <div className="container">
          <SectionHead
            align="center"
            index="03"
            label="Before / after"
            id="system"
            title={
              <>
                From manual steps <em>to a system.</em>
              </>
            }
            intro="Toggle between the manual process and the system. Click any step to see what it does, what tools it touches, and what happens if it goes wrong."
          />
          <div data-reveal>
            <Window title={`n8n / ${p.slug}`} meta={<StatusBadge status={p.status} />} className="showcase__window">
              <BeforeAfter before={p.before} flow={p.flow} exceptions={p.exceptions} />
            </Window>
          </div>
        </div>
      </section>

      <div className="container">
        {/* KEY DECISIONS */}
        <section className="cs-block" aria-labelledby="decisions">
          <div className="cs-block__head">
            <p className="label label--accent">04 · Decision log</p>
            <h2 id="decisions">Why I built it this way</h2>
          </div>
          <DecisionLog decisions={p.decisions} />
        </section>

        {/* RELIABILITY LAYER */}
        <section className="cs-block" aria-labelledby="reliability">
          <div className="cs-block__head">
            <p className="label label--accent">05 · When things go wrong</p>
            <h2 id="reliability">What can go wrong, and who steps in</h2>
          </div>
          <div>
            <ExceptionExplorer exceptions={p.exceptions} flow={p.flow} />
            {humanPoints.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <p className="label" style={{ marginBottom: 12 }}>
                  Human-in-the-loop points
                </p>
                <ul role="list" className="hitl-list">
                  {humanPoints.map((h) => (
                    <li key={h}>
                      <HumanLoopBadge compact />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* EVIDENCE */}
        <section className="cs-block" aria-labelledby="evidence">
          <div className="cs-block__head">
            <p className="label label--accent">06 · Where it stands</p>
            <h2 id="evidence">What exists today</h2>
          </div>
          <div>
            <ul role="list" className="evidence">
              {p.evidence.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            {p.media && p.media.length > 0 && <MediaEvidence media={p.media} />}
          </div>
        </section>

        {/* WHAT THIS DEMONSTRATES */}
        <section className="cs-block" aria-labelledby="demo">
          <div className="cs-block__head">
            <p className="label label--accent">07 · Why it matters</p>
            <h2 id="demo" className="sr-only">
              What this demonstrates
            </h2>
          </div>
          <p className="demonstrates" data-reveal>
            {p.demonstrates}
          </p>
        </section>

        {/* ARCHITECTURE + TECHNOLOGY (kept near the end on purpose) */}
        <section className="cs-block" aria-labelledby="stack">
          <div className="cs-block__head">
            <p className="label label--accent">08 · Built with</p>
            <h2 id="stack">What it’s built with</h2>
          </div>
          <div>
            <ul role="list" className="stack-row">
              {p.stack.map((s) => (
                <li key={s.tool}>
                  <span className="stack-row__icon">
                    <ToolIcon id={s.tool} size={20} brandColor title="" />
                  </span>
                  <strong>{tools[s.tool].name}</strong>
                  <span className="muted">{s.role}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32 }}>
              <WorkflowDiagram flow={p.flow} exceptions={p.exceptions} title="Architecture · static view" minimal />
            </div>
          </div>
        </section>

        {/* MORE WORK */}
        <section className="cs-block" aria-labelledby="more">
          <div className="cs-block__head">
            <p className="label label--accent">More systems</p>
            <h2 id="more">Keep reading</h2>
          </div>
          <div className="cs-next">
            <ProjectCard project={prev} />
            <ProjectCard project={next} />
          </div>
        </section>
      </div>

      <CtaBlock
        eyebrow="Similar workflow?"
        title={
          <>
            Got a process that looks <em>something like this?</em>
          </>
        }
        body="Tell me how it runs today and where it hurts. If it’s a good fit for automation I’ll tell you how I’d approach it. If it isn’t, I’ll tell you that too."
      />
    </article>
  );
}
