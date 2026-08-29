import { Link } from "next/link"

export function NotFoundPage() {
  return (
    <div className="container" style={{ padding: "80px 15px", textAlign: "center" }}>
      <h1 style={{ fontSize: "var(--fs-1)", fontWeight: 700, marginBottom: 12 }}>404</h1>
      <p style={{ fontSize: "var(--fs-6)", color: "var(--sonic-silver)", marginBottom: 24 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  )
}
