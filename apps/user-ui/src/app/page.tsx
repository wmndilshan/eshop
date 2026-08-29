'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, ShieldCheck, Headphones } from 'lucide-react';
import Header from './shared/widgets/header';
import Footer from './shared/widgets/footer';
import { ProductCard } from '@/components/product-card';
import { CartDrawer } from '@/components/cart-drawer';
import { useCart } from '@/lib/cart-context';
import { fetchFeaturedProducts, fetchCategories, fetchCategoryProductCounts } from '@/lib/api/catalog';
import type { Product, Category } from '@/lib/types';

export default function HomePage() {
  const { items, cartCount } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFeaturedProducts(8), fetchCategories(), fetchCategoryProductCounts()])
      .then(([p, c, cnt]) => {
        setProducts(p);
        setCategories(c);
        setCounts(cnt);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main>
        {/* Hero */}
        <section style={{ background: 'var(--eerie-black)', color: 'var(--white)', overflow: 'hidden' }}>
          <div className="container" style={{ padding: '60px 15px', display: 'grid', gridTemplateColumns: '1fr', gap: 30, alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 'var(--fs-1)', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
                Shop Local.<br />Support Sri Lankan Vendors.
              </h1>
              <p style={{ fontSize: 'var(--fs-6)', color: 'hsl(0,0%,80%)', marginBottom: 24, maxWidth: 480 }}>
                Discover unique products from artisans, tech sellers, fashion houses, and grocers across the island. One marketplace, endless choice.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/products" className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBag size={16} /> Start Shopping
                </Link>
                <Link href="/shops" className="btn-outline" style={{ borderColor: 'hsl(0,0%,40%)', color: 'var(--white)' }}>
                  Browse Shops
                </Link>
              </div>
            </div>
            <div id="hero-image" style={{ display: 'none' }}>
              <img
                src="https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Shopping"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover', maxHeight: 400 }}
              />
            </div>
          </div>
        </section>

        {/* Value props */}
        <section style={{ borderBottom: '1px solid var(--cultured)' }}>
          <div className="container" style={{ padding: '20px 15px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { icon: Truck, label: 'Islandwide Delivery', sub: 'All over Sri Lanka' },
              { icon: ShieldCheck, label: 'Secure Shopping', sub: 'Protected payments' },
              { icon: Headphones, label: '24/7 Support', sub: 'Always here to help' },
              { icon: ShoppingBag, label: 'Local Vendors', sub: 'Support local business' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <v.icon size={24} color="var(--salmon-pink)" />
                <div>
                  <div style={{ fontSize: 'var(--fs-8)', fontWeight: 600 }}>{v.label}</div>
                  <div style={{ fontSize: 'var(--fs-10)', color: 'var(--sonic-silver)' }}>{v.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container" style={{ padding: '40px 15px' }}>
          <h2 className="section-title">Shop by Category</h2>
          {loading ? (
            <div className="category-grid">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="card"
                  style={{ padding: '16px 8px', textAlign: 'center', display: 'block' }}
                >
                  <div style={{ fontSize: 'var(--fs-8)', fontWeight: 600, color: 'var(--eerie-black)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: 'var(--fs-10)', color: 'var(--sonic-silver)', marginTop: 4 }}>
                    {counts[cat.slug] ?? 0} items
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section className="container" style={{ padding: '0 15px 60px' }}>
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--sonic-silver)' }}>
              <p style={{ fontSize: 'var(--fs-6)' }}>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link href="/products" className="btn-outline">
              View All Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer open={isCartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @media (min-width: 768px) {
          #hero-image { display: block !important; }
        }
        @media (min-width: 480px) {
          .container:has(#hero-image) { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
