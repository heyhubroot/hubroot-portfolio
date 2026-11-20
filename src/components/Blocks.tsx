import type { Decision, ProjectMedia } from "@/data/types";
import Image from "next/image";

/** Section heading: mono index + display title + optional intro. Asymmetric on desktop. */
export function SectionHead({
  index,
  label,
  title,
  intro,
  id,
}: {
  index?: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
}) {
  return (
    <header className="section-head">
      <div className="section-head__meta">
        <p className="label">
          {index && <span className="label--accent">{index}</span>} {label}
        </p>
      </div>
      <div>
        <h2 className="display h2 section-head__title" id={id}>
          {title}
        </h2>
        {intro && <p className="section-head__intro">{intro}</p>}
      </div>
    </header>
  );
}

/** Native <details> accordion: zero JS, keyboard accessible by default. */
export function Accordion({ items, className = "" }: { items: { q: string; a: React.ReactNode }[]; className?: string }) {
  return (
    <div className={`acc ${className}`}>
      {items.map((it, i) => (
        <details key={i} className="acc__item">
          <summary className="acc__sum">
            <span className="mono acc__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="acc__q">{it.q}</span>
            <span className="acc__icon" aria-hidden="true" />
          </summary>
          <div className="acc__body">{typeof it.a === "string" ? <p>{it.a}</p> : it.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Decision log: expandable notes on why a design choice was made. */
export function DecisionLog({ decisions }: { decisions: Decision[] }) {
  return (
    <div className="acc acc--log">
      {decisions.map((d, i) => (
        <details key={i} className="acc__item" open={i === 0}>
          <summary className="acc__sum">
            <span className="mono acc__n">D-{String(i + 1).padStart(2, "0")}</span>
            <span className="acc__q">{d.title}</span>
            <span className="acc__icon" aria-hidden="true" />
          </summary>
          <div className="acc__body">
            <p>{d.body}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** Supporting evidence. Every item must say what it proves. Videos never autoplay. */
export function MediaEvidence({ media }: { media: ProjectMedia[] }) {
  return (
    <div className="media-grid">
      {media.map((m) => (
        <figure key={m.src} className="media">
          {m.type === "image" ? (
            <Image src={m.src} alt={m.alt} width={m.width ?? 1600} height={m.height ?? 1000} sizes="(min-width: 900px) 50vw, 100vw" loading="lazy" />
          ) : (
            <video controls preload="none" poster={m.poster} aria-label={m.alt}>
              <source src={m.src} />
            </video>
          )}
          <figcaption>
            <span className="label">What this shows</span> {m.proves}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Subtle system motif for the hero: a small blueprint of a flow with one branch to a person. */
export function HeroMotif() {
  return (
    <figure className="motif" aria-label="Diagram: a message comes in, gets sorted, booked and confirmed. Anything unclear branches off to a person.">
      <svg viewBox="0 0 420 300" className="motif__svg" aria-hidden="true">
        <defs>
          <pattern id="mgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" className="motif__grid" />
          </pattern>
        </defs>
        <rect width="420" height="300" fill="url(#mgrid)" />
        <path id="mpath" d="M40 80 H150 H270 H380" className="motif__line" />
        <path d="M150 96 V190 H270" className="motif__line motif__line--branch" />
        <circle r="4" className="motif__token">
          <animateMotion dur="6s" repeatCount="indefinite" path="M40 80 H380" />
        </circle>
        {[
          { x: 40, l: "INPUT", t: "message in" },
          { x: 150, l: "AI", t: "understand" },
          { x: 270, l: "INTEGRATION", t: "book slot" },
          { x: 380, l: "NOTIFY", t: "confirm" },
        ].map((n) => (
          <g key={n.x} transform={`translate(${n.x} 80)`}>
            <rect x="-34" y="-16" width="68" height="32" rx="5" className="motif__node" />
            <text y="4" textAnchor="middle" className="motif__t">{n.t}</text>
            <text y="-24" textAnchor="middle" className="motif__l">{n.l}</text>
          </g>
        ))}
        <g transform="translate(270 190)">
          <rect x="-46" y="-16" width="92" height="32" rx="5" className="motif__node motif__node--human" />
          <text y="4" textAnchor="middle" className="motif__t">a person</text>
          <text y="34" textAnchor="middle" className="motif__l motif__l--human">HUMAN HANDOFF</text>
        </g>
        <g transform="translate(150 150)">
          <path d="M-6 -2 L0 -12 L6 -2 Z" className="motif__warn" />
          <text x="12" y="-3" className="motif__l motif__l--exc">UNCLEAR?</text>
        </g>
      </svg>
      <figcaption className="motif__cap mono">
        fig. 01: the main path, plus where it hands over
      </figcaption>
    </figure>
  );
}
