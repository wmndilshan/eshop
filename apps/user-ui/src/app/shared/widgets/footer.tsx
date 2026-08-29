'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to Anon VIP Club!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[var(--eerie-black)] text-white pt-16 pb-12 font-sans border-t border-[var(--cultured)]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Top VIP Newsletter Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:p-10 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="badge badge-accent mb-2">Exclusive VIP Benefits</span>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
              Join the Anon Heritage Club
            </h3>
            <p className="text-xs text-slate-300">
              Subscribe to receive private sale invitations, limited edition releases, and 10% off your first order.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto max-w-sm">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="field !bg-white/10 !text-white !border-white/20 placeholder:!text-slate-400 text-xs focus:!border-[var(--salmon-pink)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="accent" className="text-xs shrink-0">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Multi-Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
          {/* Brand Story */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1.5 text-white">
              <span className="text-2xl font-black tracking-tight">ANON</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--salmon-pink)]" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sri Lanka&apos;s premier luxury e-commerce platform. Connecting authentic artisanal spice gardens, craftsmen, and global fashion directly to your doorstep.
            </p>
            <div className="flex gap-4 text-xs text-slate-400 items-center">
              <a href="#" className="hover:text-[var(--salmon-pink)] transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.6 9h16.8M3.6 15h16.8" />
                </svg>
                <span>English (LK)</span>
              </a>
              <a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">LKR (Rs)</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Organic Ceylon Cinnamon</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Pure Ceylon Black Tea</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Handcrafted Coconut Crafts</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Batik Apparel & Silk</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Precious Ceylon Sapphires</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">
              Concierge Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Islandwide Express Shipping</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">30-Day Money Back Guarantee</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Authenticity Certificate</a></li>
              <li><a href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Vendor Support Hub</a></li>
            </ul>
          </div>

          {/* Accepted Payments & Trust */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">
              Secured Payments
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Encrypted end-to-end checkout with Stripe & Visa SSL protection.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300 font-bold">
              <span className="px-2.5 py-1 bg-white/10 rounded border border-white/10">VISA</span>
              <span className="px-2.5 py-1 bg-white/10 rounded border border-white/10">MasterCard</span>
              <span className="px-2.5 py-1 bg-white/10 rounded border border-white/10">Stripe</span>
              <span className="px-2.5 py-1 bg-white/10 rounded border border-white/10">Apple Pay</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Anon Marketplace Ltd. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
