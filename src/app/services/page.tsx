import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { sortedProjects } from "@/data/projects";
import { SectionHead } from "@/components/Blocks";
import { IntegrationConstellation } from "@/components/IntegrationConstellation";
import { ORBIT, tools } from "@/data/tools";
import { CtaBlock } from "@/components/CtaBlock";
import { ToolIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Services",
  description: "The operational problems I build automation systems for: booking, outreach, support, e-commerce ops, recruitment, back-office and internal AI tools.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="label">Services</p>
          <h1 className="display page-hero__title">
            Start from the problem, <em>not the tool.</em>
          </h1>
          <p className="lede">
            These are the kinds of workflows I build systems for. For each one: what usually goes wrong when it’s done by
            hand, and what the system does instead.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {services.map((s, i) => {
            const related = sortedProjects.filter((p) => p.services.includes(s.id));
            return (
              <article key={s.id} className="svc" id={s.id} aria-labelledby={`svc-${s.id}`}>
                <div className="svc__col">
                  <p className="label">
                    <span className="label--accent">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <h2 id={`svc-${s.id}`} className="svc__name">
                    {s.name}
                  </h2>
                  <ul role="list" className="card__tools" style={{ marginTop: 16 }} aria-label="Typical tools">
                    {s.tools.map((t) => (
                      <li key={t} title={tools[t].name}>
                        <ToolIcon id={t} size={18} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="svc__col">
                  <p className="label">The problem</p>
                  <p>{s.problem}</p>
                </div>
                <div className="svc__col">
                  <p className="label label--accent">The system</p>
                  <p style={{ color: "var(--ink)" }}>{s.system}</p>
                  {related.length > 0 && (
                    <div className="svc__related">
                      <span className="label">Related work</span>
                      {related.map((p) => (
                        <Link key={p.slug} href={`/work/${p.slug}`}>
                          → {p.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="const-title">
        <div className="container">
          <SectionHead
            index="+"
            label="Integrations"
            id="const-title"
            title="Built around the tools you already have."
            intro="I’d rather connect what your team already uses than make everyone learn something new."
          />
          <IntegrationConstellation
            usage={Object.fromEntries(
              ORBIT.map((id) => [
                id,
                sortedProjects.flatMap((p) => p.stack.filter((s) => s.tool === id).map((s) => ({ slug: p.slug, title: p.title, role: s.role }))),
              ]),
            )}
          />
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
