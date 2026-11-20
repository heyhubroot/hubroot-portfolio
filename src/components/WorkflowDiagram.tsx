"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import type { ExceptionCase, FlowNode } from "@/data/types";
import { tools } from "@/data/tools";
import { NodeGlyph, ToolIcon, nodeKindLabel } from "./icons";
import { HumanLoopBadge } from "./StatusBadge";

type Props = {
  flow: FlowNode[];
  exceptions?: ExceptionCase[];
  title?: string;
  /** start with failure paths visible */
  showFailures?: boolean;
  /** hide the walkthrough controls (e.g. tiny previews) */
  minimal?: boolean;
};

const STEP_MS = 1500;

/**
 * Reusable system diagram.
 * - Desktop: horizontal pipeline with failure branches hanging below the step they come off.
 * - Mobile (<900px): the same markup becomes a vertical step sequence (CSS only).
 * - Click/tap a node, use Prev/Next, arrow keys, or "Walk through" to step the flow.
 * - The <ol> is real text, so the diagram reads correctly without CSS or for screen readers.
 */
export function WorkflowDiagram({ flow, exceptions = [], title, showFailures = true, minimal = false }: Props) {
  const [active, setActive] = useState(0);
  const [failures, setFailures] = useState(showFailures);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const uid = useId();
  const trackRef = useRef<HTMLOListElement>(null);

  const byStep = useMemo(() => {
    const map: Record<string, ExceptionCase[]> = {};
    for (const e of exceptions) (map[e.at] ??= []).push(e);
    return map;
  }, [exceptions]);

  const go = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(flow.length - 1, i))),
    [flow.length],
  );

  // walkthrough: advance one node at a time, stop at the end
  useEffect(() => {
    if (!playing) return;
    if (active >= flow.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setActive((a) => a + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, active, flow.length]);

  // keep the active node in view on narrow/scrolling tracks
  useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!el || !trackRef.current) return;
    const track = trackRef.current;
    if (track.scrollWidth > track.clientWidth) {
      track.scrollTo({ left: el.offsetLeft - track.clientWidth / 2 + el.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }, [active, reduce]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setPlaying(false);
      go(active + 1);
      focusNode(active + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setPlaying(false);
      go(active - 1);
      focusNode(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
      focusNode(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(flow.length - 1);
      focusNode(flow.length - 1);
    }
  };
  const focusNode = (i: number) => {
    const idx = Math.max(0, Math.min(flow.length - 1, i));
    trackRef.current?.querySelector<HTMLButtonElement>(`[data-index="${idx}"] .node`)?.focus();
  };

  const node = flow[active];
  const nodeExceptions = byStep[node.id] ?? [];
  const humanCount = flow.filter((n) => n.kind === "human").length + exceptions.filter((e) => e.owner === "human").length;

  return (
    <figure className={`flow${failures ? " flow--failures" : ""}${minimal ? " flow--minimal" : ""}`} aria-labelledby={`${uid}-t`}>
      <div className="flow__bar">
        <p className="label" id={`${uid}-t`}>
          <span className="flow__dot" aria-hidden="true" />
          {title ?? "System view"} · {flow.length} steps
          {exceptions.length > 0 && <> · {exceptions.length} failure paths</>}
        </p>
        {!minimal && (
          <div className="flow__controls">
            {exceptions.length > 0 && (
              <button
                type="button"
                className="chip-toggle"
                aria-pressed={failures}
                onClick={() => setFailures((f) => !f)}
              >
                <NodeGlyph kind="exception" size={14} />
                {failures ? "Hide" : "Show"} what can fail
              </button>
            )}
            <div className="flow__stepper" role="group" aria-label="Step through the workflow">
              <button type="button" className="icon-btn" onClick={() => { setPlaying(false); go(active - 1); }} disabled={active === 0} aria-label="Previous step">
                ‹
              </button>
              <span className="mono flow__count" aria-live="polite">
                {String(active + 1).padStart(2, "0")} / {String(flow.length).padStart(2, "0")}
              </span>
              <button type="button" className="icon-btn" onClick={() => { setPlaying(false); go(active + 1); }} disabled={active === flow.length - 1} aria-label="Next step">
                ›
              </button>
            </div>
            <button
              type="button"
              className="chip-toggle"
              aria-pressed={playing}
              onClick={() => {
                if (playing) return setPlaying(false);
                if (active >= flow.length - 1) setActive(0);
                setPlaying(true);
              }}
            >
              {playing ? "Pause" : "Walk through"}
            </button>
          </div>
        )}
      </div>

      <div className="flow__legend" aria-hidden="true">
        <span><i className="lg lg--main" /> main path</span>
        {exceptions.length > 0 && <span><i className="lg lg--exc" /> failure path</span>}
        {humanCount > 0 && <span><i className="lg lg--human" /> person steps in</span>}
      </div>

      <m.ol
        ref={trackRef}
        className="flow__track"
        style={{ ["--n" as string]: flow.length }}
        role="list"
        onKeyDown={onKey}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {flow.map((n, i) => {
          const state = i === active ? "active" : i < active ? "done" : "next";
          const branch = byStep[n.id] ?? [];
          return (
            <m.li
              key={n.id}
              className="flow__step"
              data-index={i}
              data-state={state}
              data-kind={n.kind}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] } } }}
            >
              <button
                type="button"
                className={`node node--${n.kind}`}
                aria-current={i === active ? "step" : undefined}
                aria-controls={`${uid}-detail`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => {
                  setPlaying(false);
                  go(i);
                }}
              >
                <span className="node__top">
                  <span className="node__kind">
                    <NodeGlyph kind={n.kind} size={14} />
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="sr-only">{nodeKindLabel[n.kind]}:</span>
                  </span>
                  {n.tools && n.tools.length > 0 && (
                    <span className="node__tools" aria-hidden="true">
                      {n.tools.slice(0, 2).map((t) => (
                        <ToolIcon key={t} id={t} size={14} />
                      ))}
                    </span>
                  )}
                </span>
                <span className="node__label">{n.label}</span>
                <span className="node__type mono" aria-hidden="true">{nodeKindLabel[n.kind]}</span>
                {n.kind === "human" && <HumanLoopBadge compact />}
              </button>
              {i < flow.length - 1 && <span className="flow__connector" aria-hidden="true" />}

              {branch.length > 0 && (
                <ul className="flow__branch" role="list" aria-label={`What can fail at ${n.label}`}>
                  {branch.map((e) => (
                    <li key={e.id} className={`branch branch--${e.owner}`}>
                      <span className="branch__head">
                        <NodeGlyph kind="exception" size={13} />
                        <span className="mono">{e.owner === "human" ? `→ ${e.ownerLabel ?? "person"}` : "→ system handles"}</span>
                      </span>
                      <span className="branch__text">{e.trigger}</span>
                    </li>
                  ))}
                </ul>
              )}
            </m.li>
          );
        })}
      </m.ol>

      {!minimal && (
        <div className="flow__detail" id={`${uid}-detail`} aria-live="polite">
          <div className="flow__detail-main">
            <p className="label">
              <NodeGlyph kind={node.kind} size={14} /> Step {active + 1} · {nodeKindLabel[node.kind]}
            </p>
            <h4 className="h4">{node.label}</h4>
            <p className="flow__detail-text">{node.detail}</p>
            {node.tech && (
              <p className="flow__tech mono">
                <span className="muted">under the hood:</span> {node.tech}
              </p>
            )}
            {node.tools && node.tools.length > 0 && (
              <ul className="flow__tools" role="list">
                {node.tools.map((t) => (
                  <li key={t}>
                    <ToolIcon id={t} size={16} /> {tools[t].name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flow__detail-side">
            <p className="label">If this step goes wrong</p>
            {nodeExceptions.length === 0 ? (
              <p className="muted flow__none">No separate failure path at this step. It carries on to the next one.</p>
            ) : (
              <ul className="flow__exc-list" role="list">
                {nodeExceptions.map((e) => (
                  <li key={e.id}>
                    <p className="flow__exc-trigger">
                      <NodeGlyph kind="exception" size={14} /> {e.trigger}
                    </p>
                    <p className="flow__exc-resp">{e.response}</p>
                    {e.owner === "human" && <HumanLoopBadge label={`Handled by ${e.ownerLabel ?? "a person"}`} />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </figure>
  );
}
