import Link from "next/link";
import type { Project } from "@/data/types";
import { tools } from "@/data/tools";
import { StatusBadge } from "./StatusBadge";
import { ArrowIcon, ToolIcon } from "./icons";

export function ProjectCard({ project, index, headingLevel = 3 }: { project: Project; index?: number; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const steps = project.flow.slice(0, 5);
  const humanSteps = project.flow.filter((n) => n.kind === "human").length + project.exceptions.filter((e) => e.owner === "human").length;
  return (
    <article className="pcard">
      <div className="pcard__top">
        {index !== undefined && <span className="mono pcard__index">{String(index + 1).padStart(2, "0")}</span>}
        <StatusBadge status={project.status} />
      </div>
      <H className="pcard__title">
        <Link href={`/work/${project.slug}`} className="pcard__link">
          {project.title}
        </Link>
      </H>
      <p className="pcard__summary">{project.summary}</p>

      <ol className="pcard__flow mono" role="list" aria-label="System flow">
        {steps.map((s, i) => (
          <li key={s.id} data-kind={s.kind}>
            {s.label}
            {i < steps.length - 1 && <span aria-hidden="true"> →</span>}
          </li>
        ))}
        {project.flow.length > steps.length && <li className="muted">+{project.flow.length - steps.length} more</li>}
      </ol>

      <div className="pcard__foot">
        <ul role="list" className="pcard__tools" aria-label="Tools">
          {project.stack.slice(0, 5).map((s) => (
            <li key={s.tool} title={tools[s.tool].name}>
              <ToolIcon id={s.tool} size={16} />
            </li>
          ))}
        </ul>
        <span className="pcard__meta mono">
          {project.exceptions.length} failure paths{humanSteps > 0 ? ` · ${humanSteps} human handoffs` : ""}
        </span>
        <ArrowIcon className="pcard__arrow" />
      </div>
    </article>
  );
}
