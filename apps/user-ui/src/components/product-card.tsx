'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatLKR } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { StarRating } from '@/components/star-rating';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [adding, setAdding] = useState(false);
  const wished = isWishlisted(product.id);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
    toast.success('Added to bag');
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id, wished);
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="card product-card" style={{ display: 'block' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '1', background: 'var(--cultured)', overflow: 'hidden' }}>
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ) : (
            <div
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--spanish-gray)', fontSize: 'var(--fs-6)' }}
            >
              No image
            </div>
          )}
        </div>
        {discount > 0 && (
          <span className="badge badge-accent" style={{ position: 'absolute', top: 8, left: 8 }}>
            -{discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          style={{ position: 'absolute', top: 8, right: 8, background: 'var(--white)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Heart size={16} fill={wished ? 'var(--salmon-pink)' : 'none'} color={wished ? 'var(--salmon-pink)' : 'var(--sonic-silver)'} />
        </button>
      </div>
      <div style={{ padding: '12px' }}>
        {product.shop && (
          <div style={{ fontSize: 'var(--fs-10)', color: 'var(--sonic-silver)', marginBottom: 4 }}>
            {product.shop.name}
          </div>
        )}
        <h3
          style={{ fontSize: 'var(--fs-7)', fontWeight: 600, lineHeight: 1.3, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <StarRating rating={product.rating} size="var(--fs-9)" />
          <span style={{ fontSize: 'var(--fs-10)', color: 'var(--sonic-silver)' }}>({product.rating_count})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 'var(--fs-6)', fontWeight: 700, color: 'var(--salmon-pink)' }}>
            {formatLKR(product.price)}
          </span>
          {product.original_price && (
            <span className="text-strike" style={{ fontSize: 'var(--fs-9)' }}>
              {formatLKR(product.original_price)}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          className="btn-primary btn-sm btn-block"
          style={{ width: '100%' }}
        >
          <ShoppingBag size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
        </button>
      </div>
    </Link>
  );
}
