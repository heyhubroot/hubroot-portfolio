import type { Metadata } from "next";
import { processSteps, reliabilityPillars } from "@/data/content";
import { getProject } from "@/data/projects";
import { PageHero, SectionHead } from "@/components/Blocks";
import { ExceptionExplorer } from "@/components/ExceptionExplorer";
import { CtaBlock } from "@/components/CtaBlock";
import { NodeGlyph } from "@/components/icons";

export const metadata: Metadata = {
  title: "How I Work",
  description: "Discovery, workflow mapping, system design, build, testing, go-live, handover and monitoring.",
};

const pillarTint = { exception: "amber", human: "mint", monitoring: "indigo", database: "sky" } as const;

export default function HowIWorkPage() {
  const example = getProject("ecommerce-return-requests")!;
  return (
    <>
      <PageHero
        eyebrow="How I work"
        title={
          <>
            Understand the process <em>before touching a tool.</em>
          </>
        }
        lede="Most of the work in a good automation happens before anything gets built. This is roughly how I go from “we have this annoying process” to a system the team actually trusts."
      />

      <section className="section section--band">
        <div className="container split split--wide">
          <div className="split__aside">
            <div className="split__sticky" data-reveal>
              <p className="label label--accent">The steps</p>
              <h2 className="display h2 split__title">
                Seven steps, <em>in this order.</em>
              </h2>
              <ol role="list" className="process-index">
                {processSteps.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#step-${s.id}`}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {s.short}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <ol role="list" className="process">
            {processSteps.map((s, i) => (
              <li key={s.id} id={`step-${s.id}`} className="process__step" data-reveal>
                <span className="process__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="process__title">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h2>
                <div>
                  <p className="process__body">{s.body}</p>
                  <p className="process__out">{s.output}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section system-surface" aria-labelledby="fail-title">
        <div className="container">
          <SectionHead
            align="center"
            index="05"
            label="Step 05, up close"
            id="fail-title"
            title={
              <>
                Testing the <em>annoying cases.</em>
              </>
            }
            intro="These are the failure scenarios from the returns workflow I built. Every one of them has a defined path, and some of them deliberately end with a person."
          />
          <div data-reveal>
            <ExceptionExplorer exceptions={example.exceptions} flow={example.flow} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="container">
          <SectionHead
            label="Principles"
            id="principles-title"
            title={
              <>
                What I hold <em>every build to.</em>
              </>
            }
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
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
