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
import { DecisionLog, MediaEvidence } from "@/components/Blocks";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaBlock } from "@/components/CtaBlock";
import { ToolIcon } from "@/components/icons";

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
 * Opening → Before → Why it mattered → System concept → Interactive workflow → Key decisions →
 * Reliability layer → Evidence → What this demonstrates → Technology → CTA
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
        <div className="container">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/work">Work</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{String(idx + 1).padStart(2, "0")}</span>
          </nav>
          <StatusBadge status={p.status} showTier />
          <h1 className="display cs-hero__title">{p.title}</h1>
          <p className="lede cs-hero__lede">{p.opening}</p>
          <dl className="cs-meta">
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
              </dd>
            </div>
            <div>
              <dt className="label">Stack</dt>
              <dd style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "var(--ink-2)" }}>
                {p.stack.map((s) => (
                  <ToolIcon key={s.tool} id={s.tool} size={18} />
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="container">
        {/* BEFORE + WHY IT MATTERED */}
        <section className="cs-block" aria-labelledby="why">
          <div className="cs-block__head">
            <p className="label">01 · Why it mattered</p>
            <h2 id="why">What the manual way was costing</h2>
          </div>
          <ul role="list" className="bullets">
            {p.whyItMattered.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>

        {/* SYSTEM CONCEPT */}
        <section className="cs-block" aria-labelledby="concept">
          <div className="cs-block__head">
            <p className="label">02 · System concept</p>
            <h2 id="concept">What I set out to build</h2>
          </div>
          <p className="lede" style={{ color: "var(--ink)" }}>{p.concept}</p>
        </section>
      </div>

      {/* INTERACTIVE WORKFLOW: control-room band */}
      <section className="system-surface system-band" aria-labelledby="system">
        <div className="container">
          <div className="system-band__head">
            <p className="label">03 · Before / after</p>
            <div>
              <h2 id="system" className="display">From manual steps to a system</h2>
              <p style={{ marginTop: 12 }}>
                Toggle between the manual process and the system. Click any step to see what it does, what tools it touches,
                and what happens if it goes wrong.
              </p>
            </div>
          </div>
          <BeforeAfter before={p.before} flow={p.flow} exceptions={p.exceptions} />
        </div>
      </section>

      <div className="container">
        {/* KEY DECISIONS */}
        <section className="cs-block" aria-labelledby="decisions">
          <div className="cs-block__head">
            <p className="label">04 · Decision log</p>
            <h2 id="decisions">Why I built it this way</h2>
          </div>
          <DecisionLog decisions={p.decisions} />
        </section>

        {/* RELIABILITY LAYER */}
        <section className="cs-block" aria-labelledby="reliability">
          <div className="cs-block__head">
            <p className="label">05 · Reliability layer</p>
            <h2 id="reliability">What can go wrong, and who steps in</h2>
          </div>
          <div>
            <ExceptionExplorer exceptions={p.exceptions} flow={p.flow} />
            {humanPoints.length > 0 && (
              <div style={{ marginTop: 28 }}>
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
            <p className="label">06 · Evidence</p>
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
            <p className="label">07 · What this demonstrates</p>
            <h2 id="demo" className="sr-only">What this demonstrates</h2>
          </div>
          <p className="demonstrates">{p.demonstrates}</p>
        </section>

        {/* ARCHITECTURE + TECHNOLOGY (kept near the end on purpose) */}
        <section className="cs-block" aria-labelledby="stack">
          <div className="cs-block__head">
            <p className="label">08 · Stack / integrations</p>
            <h2 id="stack">What it’s built with</h2>
          </div>
          <div>
            <ul role="list" className="stack-row">
              {p.stack.map((s) => (
                <li key={s.tool}>
                  <ToolIcon id={s.tool} size={20} title="" />
                  <strong style={{ fontWeight: 540 }}>{tools[s.tool].name}</strong>
                  <span className="muted">{s.role}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 28 }}>
              <WorkflowDiagram flow={p.flow} exceptions={p.exceptions} title="Architecture · static view" minimal />
            </div>
          </div>
        </section>

        {/* MORE WORK */}
        <section className="cs-block" aria-labelledby="more">
          <div className="cs-block__head">
            <p className="label">More systems</p>
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
        title={<>Got a process that looks <em>something like this?</em></>}
        body="Tell me how it runs today and where it hurts. If it’s a good fit for automation I’ll tell you how I’d approach it. If it isn’t, I’ll tell you that too."
      />
    </article>
  );
}
