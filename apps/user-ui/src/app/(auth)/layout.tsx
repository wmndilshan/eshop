export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/80 antialiased">
      <div className="auth-page-transition">{children}</div>
    </div>
  );
}
