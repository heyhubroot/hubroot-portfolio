import type { Metadata } from "next";
import Link from "next/link";
import { services, serviceShort } from "@/data/services";
import { sortedProjects } from "@/data/projects";
import { PageHero, SectionHead } from "@/components/Blocks";
import { IntegrationConstellation } from "@/components/IntegrationConstellation";
import { ORBIT, tools } from "@/data/tools";
import { CtaBlock } from "@/components/CtaBlock";
import { ArrowIcon, ToolIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Services",
  description: "The operational problems I build automation systems for: booking, outreach, support, e-commerce ops, recruitment, back-office and internal AI tools.",
};

const tints = ["indigo", "mint", "sky", "amber", "lilac", "sky", "indigo"];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Start from the problem, <em>not the tool.</em>
          </>
        }
        lede="These are the kinds of workflows I build systems for. For each one: what usually goes wrong when it’s done by hand, and what the system does instead."
      >
        <nav aria-label="Jump to a service" className="filters__group">
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="chip">
              {serviceShort[s.id]}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section section--tight section--band">
        <div className="container svc-list">
          {services.map((s, i) => {
            const related = sortedProjects.filter((p) => p.services.includes(s.id));
            return (
              <article key={s.id} className={`svc tint--${tints[i % tints.length]}`} id={s.id} aria-labelledby={`svc-${s.id}`} data-reveal>
                <div className="svc__col svc__head">
                  <span className="svc__n">
                    {String(i + 1).padStart(2, "0")} · {s.name}
                  </span>
                  <h2 id={`svc-${s.id}`} className="svc__name">
                    {s.promise}
                  </h2>
                  <ul role="list" className="svc__tools" aria-label="Typical tools">
                    {s.tools.map((t) => (
                      <li key={t} title={tools[t].name}>
                        <ToolIcon id={t} size={16} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="svc__col">
                  <p className="label">The problem</p>
                  <p>{s.problem}</p>
                </div>
                <div className="svc__col svc__system">
                  <p className="label">The system</p>
                  <p>{s.system}</p>
                  {related.length > 0 && (
                    <div className="svc__related">
                      {related.map((p) => (
                        <Link key={p.slug} href={`/work/${p.slug}`}>
                          {p.title} <ArrowIcon size={12} />
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

      <section className="section" aria-labelledby="const-title">
        <div className="container">
          <SectionHead
            label="Integrations"
            id="const-title"
            title={
              <>
                Built around the tools <em>you already have.</em>
              </>
            }
            intro="I’d rather connect what your team already uses than make everyone learn something new."
          />
          <div data-reveal>
            <IntegrationConstellation
              usage={Object.fromEntries(
                ORBIT.map((id) => [
                  id,
                  sortedProjects.flatMap((p) => p.stack.filter((s) => s.tool === id).map((s) => ({ slug: p.slug, title: p.title, role: s.role }))),
                ]),
              )}
            />
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
