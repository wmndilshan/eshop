import Link from 'next/link';
import Header from './shared/widgets/header';
import { Button } from '@/components/ui/button';

const TOP_BAR_BG = 'bg-[#1e3a5f]';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top info bar */}
      <div className={`w-full ${TOP_BAR_BG} text-white text-xs sm:text-sm py-2`}>
        <div className="max-w-7xl mx-auto px-4 text-center font-medium tracking-wide">
          FREE ISLANDWIDE DELIVERY ON ORDERS ABOVE RS. 10,000
        </div>
      </div>

      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[420px] sm:min-h-[500px] flex items-center bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200/90 via-slate-100/80 to-blue-100/60" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%239C92AC%27 fill-opacity=%270.08%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1.5 rounded-md bg-slate-200/80 text-blue-800 text-xs font-semibold tracking-wide mb-4">
                NEW SEASON 2024
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-3">
                Elevate Your Lifestyle{' '}
                <span className="text-blue-700">Premium Goods.</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-lg">
                Discover curated collections from Sri Lanka&apos;s most trusted vendors. Quality craftsmanship meets modern aesthetics.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-lg px-6 py-2.5 font-medium h-auto">
                  <Link href="/login">Shop Collection</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-lg px-6 py-2.5 font-medium h-auto border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Link href="#">View Lookbook</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'truck', title: 'Free Islandwide Delivery', desc: 'On all orders over Rs. 10,000' },
              { icon: 'check', title: 'Verified Local Sellers', desc: '100% authentic curated products' },
              { icon: 'lock', title: 'Secure Payments', desc: 'SSL encrypted checkout process' },
              { icon: 'headset', title: 'Local Support', desc: '24/7 support for our customers' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="shrink-0 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  {icon === 'truck' && <TruckIcon />}
                  {icon === 'check' && <CheckIcon />}
                  {icon === 'lock' && <LockIcon />}
                  {icon === 'headset' && <HeadsetIcon />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-0.5">{title}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop by Category */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 text-sm mt-0.5">Explore our wide range of premium collections</p>
            </div>
            <Link href="#" className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1 w-fit">
              View All <span className="text-base">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Artisans', 'Groceries'].map((name) => (
              <Link key={name} href="#" className="group block rounded-xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/80 border border-slate-100 group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-center text-sm font-medium text-slate-700 py-3">{name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Trending Products</h2>
            <div className="flex items-center gap-2">
              <button type="button" className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors" aria-label="Previous">‹</button>
              <button type="button" className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors" aria-label="Next">›</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard badge="HOT" badgeRed title="Luxe Series Smart Watch" price="Rs. 18,500.00" rating={42} />
            <ProductCard badge="10% OFF" title="Hifi Wireless Headphones" price="Rs. 42,000.00" originalPrice="Rs. 46,500" rating={128} />
            <ProductCard badge="HOT" badgeRed title="Nitro Performance Runners" price="Rs. 12,900.00" rating={85} />
            <ProductCard badge="NEW" title="Azure Velvet Collection" price="Rs. 7,450.00" rating={12} />
          </div>
        </section>

        {/* Newsletter */}
        <section className={`${TOP_BAR_BG} py-12 sm:py-14`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join the Premium Club</h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8">
              Get exclusive access to private sales, new collections, and limited edition drops directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 sm:rounded-lg overflow-hidden max-w-md mx-auto shadow-lg">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-12 px-4 text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
              />
              <button
                type="submit"
                className="h-12 px-6 font-semibold text-white bg-blue-800 hover:bg-blue-900 transition-colors rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none"
              >
                SUBSCRIBE
              </button>
            </form>
            <p className="text-white/80 text-xs mt-4">
              By subscribing you agree to our <Link href="#" className="text-blue-300 hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-300 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              <div>
                <p className="text-xl font-bold"><span className="font-extrabold">LANKA</span><span className="font-normal">PREMIUM</span></p>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  Sri Lanka&apos;s leading multi-vendor marketplace for premium goods. We connect local craftsmanship with modern lifestyle needs.
                </p>
                <div className="flex gap-3 mt-4">
                  {['facebook', 'instagram', 'twitter'].map((s) => (
                    <a key={s} href="#" className="h-9 w-9 rounded border border-slate-500 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-colors" aria-label={s}>
                      <span className="text-sm font-bold">{s[0].toUpperCase()}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {['About Us', 'Become a Vendor', 'Careers', 'Affiliate Program', 'Press & Media'].map((l) => (
                    <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Customer Service</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {['Order Tracking', 'Returns & Refunds', 'Delivery Information', 'FAQs', 'Contact Support'].map((l) => (
                    <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Our Location</h4>
                <div className="h-24 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 text-xs mb-3">COLOMBO</div>
                <p className="text-slate-300 text-sm">123 Galle Road, Colombo 03, Sri Lanka</p>
              </div>
            </div>
            <div className="border-t border-slate-600 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
              <p>© 2024 LankaPremium Marketplace. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2l2 2h4a2 2 0 012 2v5a2 2 0 01-2 2H10a2 2 0 01-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17h2a2 2 0 002-2v-5l-4-4M6 17V7a2 2 0 012-2h2l2 2h4a2 2 0 012 2v10" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ProductCard({
  badge,
  badgeRed,
  title,
  price,
  originalPrice,
  rating,
}: {
  badge?: string;
  badgeRed?: boolean;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
}) {
  return (
    <Link href="#" className="group block rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="h-20 w-20 rounded-full bg-white/90 border border-slate-100 group-hover:scale-105 transition-transform" />
        {badge && (
          <span className={`absolute top-3 left-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${badgeRed ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-amber-500 text-xs mb-1">★★★★★ ({rating})</p>
        <p className="font-medium text-slate-900 text-sm line-clamp-2 mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-blue-700">{price}</span>
          {originalPrice && <span className="text-xs text-slate-400 line-through">{originalPrice}</span>}
        </div>
      </div>
    </Link>
  );
}
