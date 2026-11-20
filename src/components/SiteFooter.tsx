import Link from "next/link";
import { site } from "@/config/site";
import { MailIcon, XLogo, CalendarIcon } from "./icons";
import { navItems } from "@/config/nav";

export function SiteFooter() {
  const { email, x, calendarUrl } = site.contact;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div>
            <p className="display site-footer__title">
              Tell me what you’re <em>trying to automate.</em>
            </p>
            <Link href={site.primaryCta.href} className="btn btn--primary">
              Start with a short form
            </Link>
          </div>
          <div className="site-footer__contact">
            <p className="label">Direct</p>
            <ul role="list" className="contact-list">
              <li>
                <a href={`mailto:${email}`}>
                  <MailIcon /> {email}
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
          <nav aria-label="Footer" className="site-footer__nav">
            <p className="label">Pages</p>
            <ul role="list">
              <li><Link href="/">Home</Link></li>
              {navItems.map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="site-footer__bottom mono">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{site.title} · {site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
