"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
export function Words({ text, start = 0, step = 0.08, accent = false }: { text: string; start?: number; step?: number; accent?: boolean }) {
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
    </Tag>
  );
}
