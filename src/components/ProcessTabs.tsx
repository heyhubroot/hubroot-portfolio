"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

type Step = { id: string; title: string; short: string; body: string; output: string };

const DWELL = 6000;

/**
 * Numbered stepper: 01 → 07. Auto-advances with a running progress bar until the visitor
 * interacts (click, tap, key, hover or focus), then it stays where they put it.
 * Off entirely under prefers-reduced-motion. Works as an ARIA tablist.
 */
export function ProcessTabs({ steps }: { steps: readonly Step[] }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = auto && !paused && inView && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((x) => (x + 1) % steps.length), DWELL);
    return () => clearTimeout(t);
  }, [running, i, steps.length]);

  // keep the active tab visible in the horizontally scrolling bar on phones
  useEffect(() => {
    const tab = tabs.current[i];
    const bar = tab?.parentElement;
    if (tab && bar && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }, [i, reduce]);

  const pick = (n: number, focus = false) => {
    setAuto(false);
    setI(n);
    if (focus) tabs.current[n]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: steps.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    pick((map[e.key] + steps.length) % steps.length, true);
  };

  const s = steps[i];
  return (
    <div
      ref={root}
      className="ptabs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="ptabs__bar" role="tablist" aria-label="How a build runs, step by step" onKeyDown={onKey}>
        {steps.map((st, n) => (
          <button
            key={st.id}
            ref={(el) => {
              tabs.current[n] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t${n}`}
            aria-selected={n === i}
            aria-controls={`${uid}-p`}
            tabIndex={n === i ? 0 : -1}
            className="ptabs__tab"
            onClick={() => pick(n)}
          >
            <span className="ptabs__n">{String(n + 1).padStart(2, "0")}</span>
            <span className="ptabs__short">{st.short}</span>
          </button>
        ))}
      </div>

      <div className="ptabs__panel window" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${i}`}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={s.id}
            className="ptabs__content"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="label label--accent">Step {String(i + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}</p>
            <h3 className="h3 ptabs__title">{s.title}</h3>
            <p className="ptabs__body">{s.body}</p>
            <p className="ptabs__out">
              <span className="ptabs__out-k">You get</span>
              <span>{s.output}</span>
            </p>
          </m.div>
        </AnimatePresence>
        <div className="ptabs__progress" aria-hidden="true">
          <span
            key={`${i}-${running}`}
            className={running ? "is-running" : ""}
            style={{ ["--dwell" as string]: `${DWELL}ms`, ["--frac" as string]: (i + 1) / steps.length }}
          />
        </div>
      </div>
    </div>
  );
}
