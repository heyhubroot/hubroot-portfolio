"use client";

import { useMemo, useState } from "react";
import type { Project, ServiceId, StatusTier } from "@/data/types";
import { serviceShort } from "@/data/services";
import { ProjectCard } from "./ProjectCard";

const tierLabel: Record<StatusTier | "all", string> = {
  all: "All",
  live: "In real use",
  build: "Built workflows",
  prototype: "Prototypes & demos",
};

export function WorkArchive({ projects }: { projects: Project[] }) {
  const [area, setArea] = useState<ServiceId | "all">("all");
  const [tier, setTier] = useState<StatusTier | "all">("all");

  const areas = useMemo(() => {
    const set = new Set<ServiceId>();
    projects.forEach((p) => p.services.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [projects]);

  const list = projects.filter((p) => (area === "all" || p.services.includes(area)) && (tier === "all" || p.status.tier === tier));

  return (
    <div>
      <div className="filters">
        <div className="filters__group" role="group" aria-label="Filter by business area">
          <span className="label">Area</span>
          <button type="button" className="chip" aria-pressed={area === "all"} onClick={() => setArea("all")}>
            All
          </button>
          {areas.map((a) => (
            <button key={a} type="button" className="chip" aria-pressed={area === a} onClick={() => setArea(a)}>
              {serviceShort[a]}
            </button>
          ))}
        </div>
        <div className="filters__group" role="group" aria-label="Filter by status">
          <span className="label">Status</span>
          {(Object.keys(tierLabel) as (StatusTier | "all")[]).map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={tier === t} onClick={() => setTier(t)}>
              {t !== "all" && <span className={`status__mark status__mark--${t}`} aria-hidden="true" />}
              {tierLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <p className="mono muted filters__count" aria-live="polite">
        Showing {list.length} of {projects.length} systems
      </p>

      {list.length === 0 ? (
        <p className="muted">Nothing matches both filters. Try loosening one.</p>
      ) : (
        <ul role="list" className="pgrid">
          {list.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel={2} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
