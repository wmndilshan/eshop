'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, LogOut, Package, MapPin } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { CATEGORY_LABELS } from '@/lib/types';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { cartCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  }

  async function handleLogout() {
    await signOut();
    setAccountOpen(false);
    router.push('/');
  }

  const categories = Object.entries(CATEGORY_LABELS);

  return (
    <header style={{ borderBottom: '1px solid var(--cultured)', background: 'var(--white)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ padding: '0 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" style={{ fontSize: 'var(--fs-3)', fontWeight: 700, color: 'var(--eerie-black)', whiteSpace: 'nowrap' }}>
            e<span style={{ color: 'var(--salmon-pink)' }}>Shop</span>
          </Link>

          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500, display: 'none' }} className="search-desktop">
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="field" style={{ paddingLeft: 40 }} />
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--spanish-gray)' }} />
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/wishlist" aria-label="Wishlist" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Heart size={22} />
            </Link>

            <button onClick={onCartClick} aria-label="Cart" style={{ position: 'relative', background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--salmon-pink)', color: 'var(--white)', fontSize: 10, fontWeight: 600, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </button>

            <div ref={accountRef} style={{ position: 'relative' }}>
              {user ? (
                <>
                  <button onClick={() => setAccountOpen(!accountOpen)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={22} />
                    <ChevronDown size={14} />
                  </button>
                  {accountOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--white)', border: '1px solid var(--cultured)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 200, padding: 8, zIndex: 100 }}>
                      <div style={{ padding: '8px 12px', fontSize: 'var(--fs-8)', color: 'var(--sonic-silver)', borderBottom: '1px solid var(--cultured)', marginBottom: 4 }}>
                        Hi, {profile?.full_name || user.email}
                      </div>
                      <Link href="/account" onClick={() => setAccountOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-7)' }}><User size={16} /> My Account</Link>
                      <Link href="/orders" onClick={() => setAccountOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-7)' }}><Package size={16} /> Orders</Link>
                      <Link href="/wishlist" onClick={() => setAccountOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-7)' }}><Heart size={16} /> Wishlist</Link>
                      <Link href="/addresses" onClick={() => setAccountOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-7)' }}><MapPin size={16} /> Addresses</Link>
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-7)', background: 'none', border: 'none', width: '100%', textAlign: 'left', color: 'var(--bittersweet)' }}><LogOut size={16} /> Logout</button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" aria-label="Login" style={{ display: 'flex', alignItems: 'center' }}>
                  <User size={22} />
                </Link>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} style={{ paddingBottom: 12, display: 'block' }} className="search-mobile">
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="field" style={{ paddingLeft: 40 }} />
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--spanish-gray)' }} />
          </div>
        </form>

        <nav style={{ display: 'none', borderTop: '1px solid var(--cultured)', padding: '10px 0' }} className="nav-desktop">
          <ul style={{ display: 'flex', gap: 24, listStyle: 'none' }}>
            <li><Link href="/products" style={{ fontSize: 'var(--fs-8)', fontWeight: 500 }}>All Products</Link></li>
            {categories.map(([slug, label]) => (
              <li key={slug}><Link href={`/products?category=${slug}`} style={{ fontSize: 'var(--fs-8)', fontWeight: 500 }}>{label}</Link></li>
            ))}
            <li><Link href="/shops" style={{ fontSize: 'var(--fs-8)', fontWeight: 500 }}>Shops</Link></li>
          </ul>
        </nav>

        {mobileMenuOpen && (
          <nav style={{ paddingBottom: 16, borderTop: '1px solid var(--cultured)', paddingTop: 12 }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--fs-7)', fontWeight: 500 }}>All Products</Link></li>
              {categories.map(([slug, label]) => (
                <li key={slug}><Link href={`/products?category=${slug}`} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--fs-7)', fontWeight: 500 }}>{label}</Link></li>
              ))}
              <li><Link href="/shops" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--fs-7)', fontWeight: 500 }}>Shops</Link></li>
            </ul>
          </nav>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .search-desktop { display: block !important; }
          .search-mobile { display: none !important; }
          .nav-desktop { display: block !important; }
        }
        @media (max-width: 767px) {
          .search-desktop { display: none !important; }
        }
      `}</style>
    </header>
  );
}
