import Link from "next/link";
import type { Project } from "@/data/types";
import { NodeGlyph, ToolIcon, nodeKindLabel } from "./icons";
import { StatusBadge, HumanLoopBadge } from "./StatusBadge";

const LOOP = 10; // seconds for one pass through the steps

/**
 * Hero visual: a real system from the case studies, shown as a wide app window below the headline
 * (AmpliQ's dashboard composition). Every label comes from project data, so nothing is invented.
 * The "run" highlight is pure CSS and stops under prefers-reduced-motion.
 */
export function HeroSystem({ project }: { project: Project }) {
  const steps = project.flow.slice(0, 5);
  const branch = project.exceptions.find((e) => e.owner === "human" && steps.some((s) => s.id === e.at));
  const branchAt = branch ? steps.findIndex((s) => s.id === branch.at) : -1;
  const decision = project.decisions[1] ?? project.decisions[0];
  const humans = project.exceptions.filter((e) => e.owner === "human").length;
  const slot = LOOP / (steps.length + 1);

  return (
    <div className="hero-sys">
      <div className="window hero-sys__window" style={{ ["--loop" as string]: `${LOOP}s` }}>
        <div className="window__bar">
          <span className="window__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="window__addr">n8n / {project.slug}</span>
          <StatusBadge status={project.status} />
        </div>

        <div className="hero-sys__body">
          <aside className="hero-sys__side">
            <p className="label label--accent">Live workflow</p>
            <p className="hero-sys__title">{project.title}</p>
            <dl className="hero-sys__stats">
              <div className="tint--indigo">
                <dt>Steps</dt>
                <dd>{project.flow.length}</dd>
              </div>
              <div className="tint--amber">
                <dt>Failure paths</dt>
                <dd>{project.exceptions.length}</dd>
              </div>
              <div className="tint--mint">
                <dt>Go to a person</dt>
                <dd>{humans}</dd>
              </div>
            </dl>
            {decision && (
              <p className="hero-sys__note">
                <span className="label">Design decision</span>
                {decision.title}
              </p>
            )}
            <Link href={`/work/${project.slug}`} className="link-arrow hero-sys__link">
              Read the case study
            </Link>
          </aside>

          <div className="hero-sys__main">
            <ol className="hero-sys__steps" role="list" aria-label={`${project.title}: main steps`}>
              {steps.map((s, i) => {
                const tool = s.tools?.[0];
                return (
                  <li key={s.id} className="hs-step" data-kind={s.kind} style={{ ["--d" as string]: `${i * slot}s` }}>
                    <span className={`hs-step__icon${tool ? " hs-step__icon--brand" : ""}`}>
                      {tool ? <ToolIcon id={tool} size={16} brandColor title="" /> : <NodeGlyph kind={s.kind} size={16} />}
                    </span>
                    <span className="hs-step__label">{s.label}</span>
                    <span className="hs-step__kind">{nodeKindLabel[s.kind]}</span>
                    <span className="hs-step__tick" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {i === branchAt && branch && (
                      <span className="hs-branch" style={{ ["--d" as string]: `${steps.length * slot}s` }}>
                        <span className="hs-branch__head">
                          <NodeGlyph kind="exception" size={14} /> If it goes wrong
                        </span>
                        <span className="hs-branch__text">{branch.trigger}</span>
                        <HumanLoopBadge label={`Flagged for ${branch.ownerLabel ?? "a person"}`} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="hero-sys__run" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
