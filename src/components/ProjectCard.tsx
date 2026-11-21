import Link from "next/link";
import type { Project } from "@/data/types";
import { tools } from "@/data/tools";
import { StatusBadge, HumanLoopBadge } from "./StatusBadge";
import { ArrowIcon, NodeGlyph, ToolIcon, nodeKindLabel } from "./icons";

/**
 * Project card. The whole card is one link (stretched from the title), so it is a single tab stop.
 * `feature` lays it out wide with the workflow drawn as a vertical step list.
 */
export function ProjectCard({
  project,
  index,
  headingLevel = 3,
  variant = "default",
}: {
  project: Project;
  index?: number;
  headingLevel?: 2 | 3;
  variant?: "default" | "feature";
}) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const feature = variant === "feature";
  const steps = project.flow.slice(0, feature ? 6 : 4);
  const humanSteps = project.flow.filter((n) => n.kind === "human").length + project.exceptions.filter((e) => e.owner === "human").length;

  return (
    <article className={`pcard pcard--${project.status.tier}${feature ? " pcard--feature" : ""}`}>
      <div className="pcard__main">
        <div className="pcard__top">
          <StatusBadge status={project.status} />
          {index !== undefined && <span className="pcard__index">{String(index + 1).padStart(2, "0")}</span>}
        </div>
        <H className="pcard__title">
          <Link href={`/work/${project.slug}`} className="pcard__link">
            {project.title}
          </Link>
        </H>
        <p className="pcard__summary">{project.summary}</p>

        {!feature && (
          <ol className="pcard__flow" role="list" aria-label="System flow">
            {steps.map((s) => (
              <li key={s.id} data-kind={s.kind}>
                <NodeGlyph kind={s.kind} size={12} />
                {s.label}
              </li>
            ))}
            {project.flow.length > steps.length && <li className="pcard__more">+{project.flow.length - steps.length}</li>}
          </ol>
        )}

        <div className="pcard__foot">
          <ul role="list" className="pcard__tools" aria-label="Tools">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s.tool} title={tools[s.tool].name}>
                <ToolIcon id={s.tool} size={16} />
              </li>
            ))}
          </ul>
          <span className="pcard__meta">
            <span className="pcard__meta-exc">
              <NodeGlyph kind="exception" size={13} /> {project.exceptions.length} failure paths
            </span>
            {humanSteps > 0 && (
              <span className="pcard__meta-human">
                <HumanLoopBadge compact /> {humanSteps}
                <span className="sr-only"> human handoffs</span>
              </span>
            )}
          </span>
          <span className="pcard__go" aria-hidden="true">
            <ArrowIcon size={16} />
          </span>
        </div>
      </div>

      {feature && (
        <div className="pcard__visual" aria-hidden="true">
          <p className="label">System view · {project.flow.length} steps</p>
          <ol className="pcard__vflow" role="list">
            {steps.map((s, i) => {
              const exc = project.exceptions.find((e) => e.at === s.id);
              return (
                <li key={s.id} data-kind={s.kind}>
                  <span className="pcard__vicon">
                    {s.tools?.[0] ? <ToolIcon id={s.tools[0]} size={14} brandColor title="" /> : <NodeGlyph kind={s.kind} size={14} />}
                  </span>
                  <span className="pcard__vlabel">{s.label}</span>
                  <span className="pcard__vkind">{nodeKindLabel[s.kind]}</span>
                  {exc && i < 4 && (
                    <span className={`pcard__vexc pcard__vexc--${exc.owner}`}>
                      <NodeGlyph kind="exception" size={12} /> {exc.trigger}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </article>
  );
}
