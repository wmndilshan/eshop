'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Header({ cartCount = 0, onOpenCart }: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--z-raised)] bg-white/90 backdrop-blur-md border-b border-[var(--cultured)] shadow-xs font-sans">
      {/* Top Banner Announcement Ticker */}
      <div className="bg-[var(--eerie-black)] text-white text-[11px] py-2 text-center font-bold tracking-widest uppercase flex items-center justify-center gap-2">
        <span>CEYLON LUXURY COLLECTION</span>
        <span className="text-[var(--salmon-pink)]">•</span>
        <span>FREE EXPRESS SHIPPING OVER LKR 15,000</span>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-1.5 text-[var(--eerie-black)] hover:text-[var(--salmon-pink)] transition-colors">
          <span className="text-2xl font-black tracking-tight">ANON</span>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--salmon-pink)]" />
          <span className="text-xs font-bold text-[var(--sonic-silver)] uppercase tracking-widest hidden sm:inline">LUXURY</span>
        </Link>

        {/* Predictive Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block relative">
          <div className="relative">
            <input
              type="search"
              placeholder="Search spices, tea, handcrafted gems, or fashion..."
              className="field pl-10 pr-10 text-xs py-2.5 rounded-full bg-slate-50/80 border-[var(--cultured)] focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--spanish-gray)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Quick Search Floating Results */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[var(--cultured)] rounded-2xl shadow-xl p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
              <span className="text-[10px] font-bold text-[var(--spanish-gray)] uppercase tracking-wider block mb-2">
                Trending Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Organic Cinnamon', 'Coconut Shell Teacups', 'Silver Jewelry', 'Batik Silk', 'Ceylon Black Tea'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 bg-[var(--cultured)] hover:bg-[var(--salmon-pink)] hover:text-white rounded-full text-xs font-semibold text-[var(--onyx)] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-5 shrink-0">
          <Link
            href="/seller"
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[var(--salmon-pink)] hover:underline"
          >
            <span>Become a Seller</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/login"
            className="flex flex-col items-center gap-0.5 text-[var(--eerie-black)] hover:text-[var(--salmon-pink)] transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:text-[var(--salmon-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
          </Link>

          <button
            onClick={onOpenCart}
            className="relative flex flex-col items-center gap-0.5 text-[var(--eerie-black)] hover:text-[var(--salmon-pink)] transition-colors group focus:outline-none"
          >
            <svg className="w-5 h-5 group-hover:text-[var(--salmon-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 badge badge-accent text-[9px] px-1.5 py-0.5 font-bold rounded-full">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">Bag</span>
          </button>
        </div>
      </div>

      {/* Secondary Category Navigation */}
      <nav className="border-t border-[var(--cultured)] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center gap-8 overflow-x-auto py-2.5 text-xs font-semibold text-[var(--davys-gray)] scrollbar-hide">
            <li>
              <Link
                href="/"
                className={`py-1 transition-colors ${
                  pathname === '/'
                    ? 'text-[var(--eerie-black)] font-bold border-b-2 border-[var(--salmon-pink)]'
                    : 'hover:text-[var(--salmon-pink)]'
                }`}
              >
                Home
              </Link>
            </li>
            <li><Link href="#categories" className="hover:text-[var(--salmon-pink)] transition-colors py-1">Categories</Link></li>
            <li><Link href="#trending" className="hover:text-[var(--salmon-pink)] transition-colors py-1">Trending</Link></li>
            <li><Link href="#deals" className="hover:text-[var(--salmon-pink)] transition-colors py-1">Flash Deals</Link></li>
            <li><Link href="#testimonials" className="hover:text-[var(--salmon-pink)] transition-colors py-1">Reviews</Link></li>
            <li><Link href="/seller" className="text-[var(--salmon-pink)] hover:underline font-bold py-1">Seller Portal</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
