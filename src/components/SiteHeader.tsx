"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { navItems } from "@/config/nav";
import { ThemeToggle } from "./Theme";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${site.name}, home`}>
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="14.5" y="14.5" width="7" height="7" rx="1.5" fill="currentColor" />
              <path d="M9.5 6h5.5a3 3 0 0 1 3 3v5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="brand__name">{site.name}</span>
          <span className="brand__role mono">AI Automation Engineer</span>
        </Link>

        <nav aria-label="Main" className="nav" id="main-nav">
          <ul role="list" className="nav__list">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="nav__link" aria-current={isActive(n.href) ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="nav__cta-item">
              <Link href={site.primaryCta.href} className="btn btn--primary btn--sm" aria-current={pathname === "/contact" ? "page" : undefined}>
                Start a project
              </Link>
            </li>
          </ul>
        </nav>

        <div className="site-header__tools">
          <ThemeToggle />
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="menu-btn__bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
