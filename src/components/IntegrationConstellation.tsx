"use client";

import { useState } from "react";
import Link from "next/link";
import type { ToolId } from "@/data/types";
import { tools } from "@/data/tools";
import { ORBIT } from "@/data/tools";
import { ToolIcon } from "./icons";

export type ToolUsage = Partial<Record<ToolId, { slug: string; title: string; role: string }[]>>;

/**
 * Integration constellation: the existing business tools I connect, around the process in the middle.
 * `usage` is computed on the server from project data, so nothing here is invented and the client bundle stays small.
 */
export function IntegrationConstellation({ usage }: { usage: ToolUsage }) {
  const [sel, setSel] = useState<ToolId | null>(null);
  const selected = sel ? usage[sel] ?? [] : [];
  const r = 40; // orbit radius, % of box

  return (
    <div className="const">
      <div className="const__map" aria-hidden={false}>
        <svg className="const__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <circle cx="50" cy="50" r={r} className="const__orbit" />
          {ORBIT.map((id, i) => {
            const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + r * Math.cos(a);
            const y = 50 + r * Math.sin(a);
            return <line key={id} x1="50" y1="50" x2={x} y2={y} className={sel === id ? "is-on" : ""} />;
          })}
        </svg>
        <div className="const__core">
          <span className="mono">n8n · glue</span>
          <strong>Your process</strong>
        </div>
        <ul role="list" className="const__orbit-list">
          {ORBIT.map((id, i) => {
            const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <li key={id} style={{ left: `${50 + r * Math.cos(a)}%`, top: `${50 + r * Math.sin(a)}%` }}>
                <button
                  type="button"
                  className="const__node"
                  aria-pressed={sel === id}
                  onClick={() => setSel(sel === id ? null : id)}
                  onMouseEnter={() => setSel(id)}
                >
                  <ToolIcon id={id} size={20} title="" />
                  <span className="const__name">{tools[id].name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="const__info" aria-live="polite">
        {sel ? (
          <>
            <p className="label">
              <ToolIcon id={sel} size={14} /> {tools[sel].name} · where I’ve used it
            </p>
            <ul role="list" className="const__uses">
              {selected.map(({ slug, title, role }) => (
                <li key={slug}>
                  <Link href={`/work/${slug}`}>{title}</Link>
                  <span className="muted">{role}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="label">Tools I connect</p>
            <p className="muted">
              Pick a tool to see which systems I used it in and what job it did there. The tools change from business to
              business. The middle stays the same: your actual process.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
