import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[var(--white)] font-sans">
      {/* Left Side: Brand Panel */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--eerie-black)] items-center justify-center">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center" 
          style={{
            backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAr5smipJJb9ffNMFo6M_SQIAeGzz62mY70pIB8URLDAqb2rDJKcPkk7uSeQd1LiqqrTy3a3GCCqCMh53k-dWWocm6q78FfWXmCSX2YGTDyr6TEB91eOPPiWhpCfVjMPUHeCfGzT0LiK-Iqw44IuWm7zWQbcSCsYzwW9XKDqytgtHEIuKh5NSrBkA0VUZyHbTGiq7sinehyo5ZiBbp2iKZ4QQSzxCmJ1Gl8uReTThB7k84uWwg6pq6a9yjiZpzUEccGPBhOgc1To2Q)'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--eerie-black)] via-[var(--eerie-black)]/90 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 px-12 xl:px-24 text-[var(--white)] max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--white)] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--eerie-black)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">LANKAPREMIUM <span className="text-[var(--salmon-pink)]">SELLER</span></span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
            Grow your business across Sri Lanka.
          </h1>

          <p className="text-base text-[var(--spanish-gray)] mb-10 leading-relaxed">
            Register as a seller to list your products, reach thousands of buyers, manage inventory, and process secure payouts directly to your local bank account.
          </p>

          <div className="space-y-6 mb-12">
            {[
              { icon: '🚀', text: '0% listing fees for the first 30 days' },
              { icon: '💳', text: 'Instant payouts via Stripe Connect' },
              { icon: '📊', text: 'Real-time sales & traffic analytics' },
              { icon: '🛡️', text: 'Dedicated seller protection' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--onyx)] flex items-center justify-center border border-[var(--cultured)]/10 text-md font-bold text-[var(--salmon-pink)]">
                  {item.icon}
                </div>
                <p className="font-semibold text-[var(--white)]/90 text-sm">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-[var(--onyx)] flex items-center justify-between">
            <p className="text-xs text-[var(--spanish-gray)]">Powered by LankaPremium Multi-Vendor Platform</p>
          </div>
        </div>
      </section>

      {/* Right Side: Form Container */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20">
        <div className="w-full max-w-md auth-page-transition">
          {/* Mobile Brand Name */}
          <div className="lg:hidden mb-10 flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-[var(--eerie-black)] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--white)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--eerie-black)]">LANKAPREMIUM <span className="text-[var(--salmon-pink)]">SELLER</span></span>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
