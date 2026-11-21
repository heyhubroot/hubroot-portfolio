"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { navItems } from "@/config/nav";
import { ThemeToggle } from "./Theme";
import { ArrowIcon } from "./icons";

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect x="2" y="2" width="13" height="13" rx="4" fill="currentColor" opacity="0.28" />
      <rect x="17" y="17" width="13" height="13" rx="4" fill="currentColor" />
      <path d="M15 8.5h4.5a4 4 0 0 1 4 4V17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`site-header${open ? " is-open" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label={`${site.name}, home`}>
          <span className="brand__mark">
            <BrandMark />
          </span>
          <span className="brand__name">{site.name}</span>
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
          </ul>
          <Link href={site.primaryCta.href} className="btn btn--primary nav__cta-mobile">
            Start a project <ArrowIcon size={16} />
          </Link>
        </nav>

        <div className="site-header__tools">
          <ThemeToggle />
          <Link href={site.primaryCta.href} className="btn btn--primary btn--sm site-header__cta" aria-current={pathname === "/contact" ? "page" : undefined}>
            Start a project
          </Link>
          <button type="button" className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen((o) => !o)}>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="menu-btn__bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
