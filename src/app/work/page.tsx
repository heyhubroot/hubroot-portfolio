import type { Metadata } from "next";
import { sortedProjects } from "@/data/projects";
import { WorkArchive } from "@/components/WorkArchive";
import { CtaBlock } from "@/components/CtaBlock";

export const metadata: Metadata = {
  title: "Work",
  description: "Automation systems I’ve built, each with an honest status label, the full workflow, and what happens when things go wrong.",
};

export default function WorkPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="label">Work · case studies</p>
          <h1 className="display page-hero__title">
            The systems, <em>and the state they’re in.</em>
          </h1>
          <p className="lede">
            Some of these are running for clients. Some are completed builds. Some are prototypes and demos where I was
            testing an idea. Each one is labelled honestly, and each one shows the full workflow, including the failure
            paths and where a person steps in.
          </p>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <WorkArchive projects={sortedProjects} />
        </div>
      </section>
      <CtaBlock eyebrow="Got something similar?" title={<>Have a workflow that looks <em>like one of these?</em></>} />
    </>
  );
}
