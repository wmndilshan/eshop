'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Star, Settings,
  CreditCard, LogOut, Menu,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/api/seller-catalog';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  shopName: string;
  shopCategory?: string;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { tab: 'overview', label: 'Overview', icon: LayoutDashboard },
  { tab: 'products', label: 'Products', icon: Package },
  { tab: 'orders', label: 'Orders', icon: ShoppingCart, hasBadge: true },
  { tab: 'reviews', label: 'Reviews', icon: Star },
  { tab: 'settings', label: 'Settings', icon: Settings },
  { tab: 'payouts', label: 'Payouts', icon: CreditCard },
];

export function Sidebar({ currentTab, setCurrentTab, shopName, onLogout }: SidebarProps) {
  const { seller } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: ordersData } = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: () => getOrders({ status: 'pending', limit: 1 }),
    staleTime: 60_000,
  });
  const pendingCount = ordersData?.data?.total ?? 0;

  const initials = seller?.name
    ? seller.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle btn-ghost btn-icon"
        onClick={() => setOpen(true)}
        style={{ position: 'fixed', top: 12, left: 12, zIndex: 30 }}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${open ? 'active' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span>sell<em>hub</em></span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ tab, label, icon: Icon, hasBadge }) => (
            <button
              key={tab}
              className={currentTab === tab || currentTab.startsWith(`${tab}/`) ? 'active' : ''}
              onClick={() => handleNavClick(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <Icon size={18} />
              {label}
              {hasBadge && !!pendingCount && (
                <span className="sidebar-badge">{pendingCount > 99 ? '99+' : pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div className="seller-avatar">{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 'var(--fs-8)', fontWeight: 600, color: 'var(--eerie-black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {seller?.name ?? 'Seller'}
              </div>
              <div style={{ fontSize: 'var(--fs-10)', color: 'var(--sonic-silver)' }}>
                {shopName}
              </div>
            </div>
          </div>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
