import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ borderBottom: 0 }}>
      <div className="container nf">
        <p className="eyebrow-pill">
          <span className="eyebrow-pill__dot" aria-hidden="true" style={{ background: "var(--exception)" }} />
          Exception path
        </p>
        <p className="nf__code" aria-hidden="true">
          404
        </p>
        <h1 className="display h2">This page doesn’t exist.</h1>
        <p className="lede">Even good systems hit a dead end sometimes. This one hands you back to a person, sort of.</p>
        <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn--primary">
            Go home
          </Link>
          <Link href="/work" className="btn btn--soft">
            See the work
          </Link>
        </p>
      </div>
    </section>
  );
}
