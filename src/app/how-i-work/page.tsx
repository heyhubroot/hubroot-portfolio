import type { Metadata } from "next";
import { processSteps, reliabilityPillars } from "@/data/content";
import { getProject } from "@/data/projects";
import { SectionHead } from "@/components/Blocks";
import { ExceptionExplorer } from "@/components/ExceptionExplorer";
import { CtaBlock } from "@/components/CtaBlock";
import { NodeGlyph } from "@/components/icons";

export const metadata: Metadata = {
  title: "How I Work",
  description: "Discovery, workflow mapping, system design, build, testing, go-live, handover and monitoring.",
};

export default function HowIWorkPage() {
  const example = getProject("ecommerce-return-requests")!;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="label">How I work</p>
          <h1 className="display page-hero__title">
            Understand the process <em>before touching a tool.</em>
          </h1>
          <p className="lede">
            Most of the work in a good automation happens before anything gets built. This is roughly how I go from “we
            have this annoying process” to a system the team actually trusts.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <ol role="list" className="process">
            {processSteps.map((s, i) => (
              <li key={s.id} className="process__step">
                <h2 className="h4 process__title">
                  <span className="mono process__n">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <p className="process__body">{s.body}</p>
                <p className="mono process__out">{s.output}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section system-surface" aria-labelledby="fail-title">
        <div className="container">
          <SectionHead
            index="→"
            label="Step 05, up close"
            id="fail-title"
            title={<>Testing the <em>annoying cases.</em></>}
            intro="These are the failure scenarios from the returns workflow I built. Every one of them has a defined path, and some of them deliberately end with a person."
          />
          <ExceptionExplorer exceptions={example.exceptions} flow={example.flow} />
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="container">
          <SectionHead index="+" label="Principles" id="principles-title" title="What I hold every build to." />
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
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
