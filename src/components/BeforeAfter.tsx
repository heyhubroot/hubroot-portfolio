"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ExceptionCase, FlowNode } from "@/data/types";
import { WorkflowDiagram } from "./WorkflowDiagram";
import { NodeGlyph } from "./icons";

/**
 * Before / After toggle: the manual process vs the automated system.
 * Implemented as an accessible tab pair (arrow keys switch tabs).
 */
export function BeforeAfter({
  before,
  flow,
  exceptions,
  manualTitle = "How it ran manually",
  systemTitle = "How the system runs it",
}: {
  before: string[];
  flow: FlowNode[];
  exceptions: ExceptionCase[];
  manualTitle?: string;
  systemTitle?: string;
}) {
  const [view, setView] = useState<"before" | "after">("before");
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const next = view === "before" ? "after" : "before";
      const target = e.key === "Home" ? "before" : e.key === "End" ? "after" : next;
      setView(target);
      tabs.current[target === "before" ? 0 : 1]?.focus();
    }
  };

  return (
    <div className="ba">
      <div className="ba__tabs" role="tablist" aria-label="Compare the manual process with the automated system" onKeyDown={onKey}>
        {(["before", "after"] as const).map((v, i) => (
          <button
            key={v}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-tab-${v}`}
            aria-selected={view === v}
            aria-controls={`${uid}-panel-${v}`}
            tabIndex={view === v ? 0 : -1}
            className="ba__tab"
            onClick={() => setView(v)}
          >
            <span className="mono">{v === "before" ? "Before" : "After"}</span>
            {v === "before" ? "Manual process" : "Automated system"}
          </button>
        ))}
        <span className="ba__indicator" data-view={view} aria-hidden="true" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "before" ? (
          <m.div
            key="before"
            role="tabpanel"
            id={`${uid}-panel-before`}
            aria-labelledby={`${uid}-tab-before`}
            className="ba__panel ba__panel--manual"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <p className="label">
              <NodeGlyph kind="actor" size={14} /> {manualTitle} · depends on whoever is free
            </p>
            <ol className="manual" role="list">
              {before.map((step, i) => (
                <li key={i} className="manual__step">
                  <span className="manual__n mono">{String(i + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                  <span className="manual__tag mono">by hand</span>
                </li>
              ))}
            </ol>
          </m.div>
        ) : (
          <m.div
            key="after"
            role="tabpanel"
            id={`${uid}-panel-after`}
            aria-labelledby={`${uid}-tab-after`}
            className="ba__panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <WorkflowDiagram flow={flow} exceptions={exceptions} title={systemTitle} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
