'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      {/* Primary bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 sm:gap-6 h-16">
        <Link href="/" className="shrink-0 text-xl font-bold text-blue-700 tracking-tight">
          <span className="font-extrabold">LANKA</span>
          <span className="font-normal">PREMIUM</span>
        </Link>

        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search for products, brands or vendors..."
              className="w-full h-10 pl-4 pr-11 rounded-full border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <Link href="/login" className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Account</span>
          </Link>
          <Link href="#" className="relative flex flex-col items-center gap-0.5 text-slate-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 right-1/2 translate-x-3 h-4 min-w-[1rem] px-1 flex items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">0</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Cart</span>
          </Link>
        </div>
      </div>

      {/* Secondary nav */}
      <nav className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <li>
              <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 whitespace-nowrap transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                Categories
              </button>
            </li>
            <li><Link href="/" className="block px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-[1px]">Home</Link></li>
            <li><Link href="#" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">New Arrivals</Link></li>
            <li><Link href="#" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Best Sellers</Link></li>
            <li><Link href="#" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Local Artisans</Link></li>
            <li><Link href="#" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Deals</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
