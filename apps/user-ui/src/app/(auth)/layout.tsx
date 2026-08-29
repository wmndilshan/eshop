import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Left Column: Multi-Vendor eCommerce Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--eerie-black)] text-white overflow-hidden flex-col justify-between p-12">
        {/* Ambient Accent Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--salmon-pink)]/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-slate-800 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="text-2xl font-black tracking-tight">ANON</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--salmon-pink)]" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">MARKETPLACE</span>
          </Link>
        </div>

        {/* Hero Card Showcase */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <span className="badge badge-accent text-xs">Multi-Vendor Storefront</span>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            The Modern Marketplace for Curated Brands & Products.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Shop thousands of authenticated products across fashion, electronics, home decor, lifestyle, and artisan craft from verified sellers nationwide.
          </p>

          <div className="pt-4 flex items-center gap-6 border-t border-white/10 text-xs text-slate-300 font-medium">
            <div>
              <span className="block text-base font-bold text-white">100%</span>
              <span className="text-slate-400">Buyer Protection</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="block text-base font-bold text-white">Fast & Safe</span>
              <span className="text-slate-400">Encrypted Checkout</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="block text-base font-bold text-white">Verified</span>
              <span className="text-slate-400">Independent Sellers</span>
            </div>
          </div>
        </div>

        {/* Footer Citation */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between items-center">
          <span>© {new Date().getFullYear()} Anon Marketplace</span>
          <span>Terms & Privacy Guaranteed</span>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 max-w-xl mx-auto w-full">
        {/* Mobile Brand Link */}
        <div className="lg:hidden flex items-center justify-between pb-6 border-b border-[var(--cultured)] mb-6">
          <Link href="/" className="flex items-center gap-1.5 text-[var(--eerie-black)]">
            <span className="text-xl font-black tracking-tight">ANON</span>
            <span className="h-2 w-2 rounded-full bg-[var(--salmon-pink)]" />
          </Link>
          <Link href="/" className="text-xs font-semibold text-[var(--sonic-silver)] hover:text-[var(--salmon-pink)] transition-colors">
            Back to Marketplace →
          </Link>
        </div>

        {children}

        {/* Micro Footer */}
        <div className="text-center text-xs text-[var(--spanish-gray)] pt-8">
          Need support? Contact concierge at <a href="mailto:support@anon.lk" className="text-[var(--salmon-pink)] hover:underline font-medium">support@anon.lk</a>
        </div>
      </div>
    </div>
  );
}
