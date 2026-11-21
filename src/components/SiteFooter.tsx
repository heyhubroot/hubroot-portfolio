import Link from "next/link";
import { site } from "@/config/site";
import { MailIcon, XLogo, CalendarIcon, ArrowIcon } from "./icons";
import { navItems } from "@/config/nav";
import { BrandMark } from "./SiteHeader";

export function SiteFooter() {
  const { email, x, calendarUrl } = site.contact;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__lead">
            <Link href="/" className="brand brand--footer" aria-label={`${site.name}, home`}>
              <span className="brand__mark">
                <BrandMark />
              </span>
              <span className="brand__name">{site.name}</span>
            </Link>
            <p className="site-footer__title">
              Automation that holds up <em>on a bad day.</em>
            </p>
            <Link href={site.primaryCta.href} className="btn btn--light">
              Start with a short form <ArrowIcon size={16} />
            </Link>
          </div>

          <nav aria-label="Footer" className="site-footer__col">
            <p className="site-footer__k">Pages</p>
            <ul role="list">
              <li>
                <Link href="/">Home</Link>
              </li>
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="site-footer__col">
            <p className="site-footer__k">Direct</p>
            <ul role="list">
              <li>
                <a href={`mailto:${email}`}>
                  <MailIcon /> <span className="site-footer__email">{email}</span>
                </a>
              </li>
              <li>
                <a href={x.url} target="_blank" rel="noopener noreferrer">
                  <XLogo /> {x.handle}
                </a>
              </li>
              {calendarUrl && (
                <li>
                  <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                    <CalendarIcon /> Book a call
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>
            {site.title} · {site.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
