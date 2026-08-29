'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatLKR } from '@/lib/types';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  function handleCheckout() {
    onClose();
    if (!user) {
      toast.error('Please log in to checkout');
      router.push('/login?returnUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  }

  return (
    <>
      <div className={`overlay ${open ? 'active' : ''}`} onClick={onClose} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: 400,
          height: '100%',
          background: 'var(--white)',
          zIndex: 20,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid var(--cultured)' }}>
          <h3 style={{ fontSize: 'var(--fs-5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={20} /> Cart
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p className="text-muted">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', color: 'var(--cultured)' }} />
              <p style={{ fontSize: 'var(--fs-7)', color: 'var(--sonic-silver)', marginBottom: 16 }}>
                Your cart is empty
              </p>
              <Link href="/products" onClick={onClose} className="btn-primary btn-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--cultured)' }}
                >
                  <div
                    style={{ width: 70, height: 70, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--cultured)', flexShrink: 0 }}
                  >
                    {item.product?.images[0] && (
                      <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--fs-8)', fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product?.name}
                    </h4>
                    <p style={{ fontSize: 'var(--fs-9)', color: 'var(--salmon-pink)', fontWeight: 600, marginBottom: 8 }}>
                      {formatLKR(item.product?.price ?? 0)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: 24, height: 24, border: '1px solid var(--cultured)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 'var(--fs-8)', fontWeight: 500, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: 24, height: 24, border: '1px solid var(--cultured)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--bittersweet)' }}
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid var(--cultured)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--fs-7)', fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontSize: 'var(--fs-6)', fontWeight: 700, color: 'var(--salmon-pink)' }}>{formatLKR(cartTotal)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary btn-block">
              Checkout
            </button>
            <Link href="/cart" onClick={onClose} className="btn-outline btn-sm btn-block" style={{ marginTop: 8 }}>
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
