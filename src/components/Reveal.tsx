"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

/**
 * One observer for the whole site. Any element with `data-reveal` rises into place the first
 * time it scrolls into view. CSS only hides elements when <html> has the `js` class, and a
 * failsafe animation reveals everything after 3s, so content is never lost if this doesn't run.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

/** Splits a headline into words that rise in one after another (AmpliQ-style). Text stays real text. */
export function Words({
  text,
  start = 0,
  step = 0.08,
  accent = false,
  after,
}: {
  text: string;
  start?: number;
  step?: number;
  accent?: boolean;
  /** extra inline content kept on the same line block (e.g. a rotating word) */
  after?: React.ReactNode;
}) {
  const words = text.split(" ");
  const Tag = accent ? "em" : "span";
  return (
    <Tag className="words">
      {words.map((w, i) => (
        <span key={i}>
          <span className="word">
            <span style={{ ["--d" as string]: `${start + i * step}s` }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
      {after && <> {after}</>}
    </Tag>
  );
}

/**
 * Rotating phrase. Every option sits in the same grid cell, so the slot is always as wide as the
 * longest one: no layout shift as it changes. Screen readers get one static sentence instead.
 * Under prefers-reduced-motion it shows the first option and never rotates.
 */
export function Rotator({ items, interval = 2600, delay = 3200, label }: { items: string[]; interval?: number; delay?: number; label: string }) {
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const start = setTimeout(() => setRunning(true), delay);
    return () => clearTimeout(start);
  }, [reduce, delay]);

  useEffect(() => {
    if (!running) return;
    const onVis = () => document.hidden && setRunning(false);
    document.addEventListener("visibilitychange", onVis);
    const t = setInterval(() => setI((x) => (x + 1) % items.length), interval);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [running, interval, items.length]);

  // resume when the tab becomes visible again
  useEffect(() => {
    if (reduce) return;
    const onVis = () => !document.hidden && setRunning(true);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [reduce]);

  return (
    <span className="rotator">
      <span className="sr-only">{label}</span>
      <span className="rotator__slot" aria-hidden="true">
        {items.map((w, n) => (
          <span key={w} className={`rotator__item${n === i ? " is-on" : ""}`}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
