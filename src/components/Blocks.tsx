import type { Decision, ProjectMedia } from "@/data/types";
import Image from "next/image";

/**
 * Section heading.
 * split (default): eyebrow + title on the left, intro on the right, bottoms aligned.
 * center: centred stack, used on the deep showcase bands.
 */
export function SectionHead({
  index,
  label,
  title,
  intro,
  id,
  align = "split",
}: {
  index?: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  align?: "split" | "center";
}) {
  return (
    <header className={`section-head${align === "center" ? " section-head--center" : ""}`} data-reveal>
      <div>
        {align === "center" ? (
          <p className="eyebrow-pill eyebrow-pill--glass">
            {index && <span className="eyebrow-pill__n">{index}</span>}
            {label}
          </p>
        ) : (
          <p className="label label--accent">
            {index && <span className="label__n">{index}</span>}
            {label}
          </p>
        )}
        <h2 className="display h2 section-head__title" id={id}>
          {title}
        </h2>
        {align === "center" && intro && <p className="section-head__intro">{intro}</p>}
      </div>
      {align === "split" && intro && <p className="section-head__intro">{intro}</p>}
    </header>
  );
}

/** Inner-page opener on the aurora wash: eyebrow pill, title left, lede (and optional aside) right. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero__grid">
        <div className="page-hero__main">
          <p className="eyebrow-pill">
            <span className="eyebrow-pill__dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="display page-hero__title">{title}</h1>
        </div>
        {(lede || children) && (
          <div className="page-hero__side">
            {lede && <p className="lede">{lede}</p>}
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/** App-window frame (AmpliQ's product-shot container), used to present live components. */
export function Window({ title, meta, children, className = "" }: { title?: React.ReactNode; meta?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`window ${className}`}>
      <div className="window__bar">
        <span className="window__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {title && <span className="window__addr">{title}</span>}
        {meta && <span className="window__meta">{meta}</span>}
      </div>
      <div className="window__body">{children}</div>
    </div>
  );
}

/** Native <details> accordion: zero JS, keyboard accessible by default. */
export function Accordion({ items, className = "" }: { items: { q: string; a: React.ReactNode }[]; className?: string }) {
  return (
    <div className={`acc ${className}`}>
      {items.map((it, i) => (
        <details key={i} className="acc__item">
          <summary className="acc__sum">
            <span className="acc__n">{String(i + 1).padStart(2, "0")}</span>
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
            <span className="acc__n">D{String(i + 1).padStart(2, "0")}</span>
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
