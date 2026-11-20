import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container notfound">
      <p className="label">404 · exception path</p>
      <h1 className="display h2">This page doesn’t exist.</h1>
      <p className="muted">Even good systems hit a dead end sometimes. This one hands you back to a person, sort of.</p>
      <p style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/" className="btn btn--primary">
          Go home
        </Link>
        <Link href="/work" className="btn btn--ghost">
          See the work
        </Link>
      </p>
    </section>
  );
}
