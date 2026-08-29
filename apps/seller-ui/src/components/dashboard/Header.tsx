'use client';

import React from 'react';

interface HeaderProps {
  sellerName: string;
  sellerEmail: string;
  currentTab: string;
}

export function Header({ sellerName, sellerEmail, currentTab }: HeaderProps) {
  const tabTitles: Record<string, string> = {
    overview: 'Overview Dashboard',
    products: 'Manage Products',
    orders: 'Orders',
    reviews: 'Customer Reviews & Feedback',
    settings: 'Shop Configuration',
    payouts: 'Payouts',
  };

  const breadcrumbs: Record<string, string[]> = {
    overview: ['Seller Center', 'Dashboard', 'Overview'],
    products: ['Seller Center', 'Dashboard', 'Products'],
    orders: ['Seller Center', 'Dashboard', 'Orders'],
    reviews: ['Seller Center', 'Customer Support', 'Reviews'],
    settings: ['Seller Center', 'Configuration', 'Settings'],
    payouts: ['Seller Center', 'Finance', 'Payouts'],
  };

  const pathList = breadcrumbs[currentTab] || ['Seller Center', 'Dashboard'];

  return (
    <header className="h-20 bg-[var(--white)] border-b border-[var(--cultured)] px-8 flex items-center justify-between font-sans">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-[var(--sonic-silver)] font-semibold">
          {pathList.map((path, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-[var(--spanish-gray)]">/</span>}
              <span className={idx === pathList.length - 1 ? 'text-[var(--salmon-pink)] font-bold' : ''}>
                {path}
              </span>
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-xl font-bold text-[var(--eerie-black)] tracking-tight">
          {tabTitles[currentTab] || 'Dashboard'}
        </h2>
      </div>

      {/* Seller Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-[var(--eerie-black)]">{sellerName}</p>
          <p className="text-xs text-[var(--sonic-silver)]">{sellerEmail}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-[var(--eerie-black)] text-[var(--white)] flex items-center justify-center font-bold text-sm border-2 border-[var(--cultured)] shadow-sm">
          {sellerName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
