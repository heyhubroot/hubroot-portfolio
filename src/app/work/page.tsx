import type { Metadata } from "next";
import { sortedProjects } from "@/data/projects";
import { WorkArchive } from "@/components/WorkArchive";
import { CtaBlock } from "@/components/CtaBlock";
import { PageHero } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "Work",
  description: "Automation systems I’ve built, each with an honest status label, the full workflow, and what happens when things go wrong.",
};

export default function WorkPage() {
  const count = (t: string) => sortedProjects.filter((p) => p.status.tier === t).length;
  return (
    <>
      <PageHero
        eyebrow="Work · case studies"
        title={
          <>
            The systems, <em>and the state they’re in.</em>
          </>
        }
        lede="Some of these are running for clients. Some are completed builds. Some are prototypes and demos where I was testing an idea. Each one is labelled honestly, and each one shows the full workflow, including the failure paths and where a person steps in."
      >
        <ul role="list" className="hero__facts" style={{ marginTop: 24, animation: "none" }}>
          <li>
            <span className="status__mark status__mark--live" style={{ color: "var(--human)" }} aria-hidden="true" />
            <span className="hero__fact-n">{count("live")}</span> in real use
          </li>
          <li>
            <span className="status__mark status__mark--build" style={{ color: "var(--accent)" }} aria-hidden="true" />
            <span className="hero__fact-n">{count("build")}</span> built
          </li>
          <li>
            <span className="status__mark status__mark--prototype" aria-hidden="true" />
            <span className="hero__fact-n">{count("prototype")}</span> prototypes
          </li>
        </ul>
      </PageHero>
      <section className="section section--tight section--band">
        <div className="container">
          <WorkArchive projects={sortedProjects} />
        </div>
      </section>
      <CtaBlock
        eyebrow="Got something similar?"
        title={
          <>
            Have a workflow that looks <em>like one of these?</em>
          </>
        }
      />
    </>
  );
}
