"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ExceptionCase, FlowNode } from "@/data/types";
import { NodeGlyph } from "./icons";
import { HumanLoopBadge } from "./StatusBadge";

/** Pick a failure scenario, see where it happens, what the system does and who steps in. */
export function ExceptionExplorer({ exceptions, flow }: { exceptions: ExceptionCase[]; flow: FlowNode[] }) {
  const [sel, setSel] = useState(0);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (exceptions.length === 0) return null;

  const e = exceptions[sel];
  const stepIndex = flow.findIndex((n) => n.id === e.at);
  const step = flow[stepIndex];

  const onKey = (ev: React.KeyboardEvent) => {
    let next = sel;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") next = (sel + 1) % exceptions.length;
    else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") next = (sel - 1 + exceptions.length) % exceptions.length;
    else if (ev.key === "Home") next = 0;
    else if (ev.key === "End") next = exceptions.length - 1;
    else return;
    ev.preventDefault();
    setSel(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="xx">
      <div className="xx__list" role="tablist" aria-orientation="vertical" aria-label="Failure scenarios" onKeyDown={onKey}>
        {exceptions.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-t-${i}`}
            aria-selected={i === sel}
            aria-controls={`${uid}-p`}
            tabIndex={i === sel ? 0 : -1}
            className="xx__item"
            onClick={() => setSel(i)}
          >
            <NodeGlyph kind="exception" size={15} />
            <span>{x.trigger}</span>
            {x.owner === "human" && <HumanLoopBadge compact />}
          </button>
        ))}
      </div>

      <div className="xx__panel" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t-${sel}`}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={e.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            <dl className="xx__dl">
              <div>
                <dt className="label">Where it happens</dt>
                <dd>
                  {step ? (
                    <>
                      <span className="mono xx__step">Step {String(stepIndex + 1).padStart(2, "0")}</span> {step.label}
                    </>
                  ) : (
                    "During the flow"
                  )}
                </dd>
              </div>
              <div>
                <dt className="label">What goes wrong</dt>
                <dd>{e.trigger}</dd>
              </div>
              <div>
                <dt className="label">What the system does</dt>
                <dd>{e.response}</dd>
              </div>
              <div>
                <dt className="label">Who handles it</dt>
                <dd>
                  {e.owner === "human" ? (
                    <HumanLoopBadge label={`A person: ${e.ownerLabel ?? "team member"}`} />
                  ) : (
                    <span className="sys-handles">
                      <NodeGlyph kind="monitoring" size={14} /> The system handles it on its own
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
