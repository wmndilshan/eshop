'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 15000;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const grandTotal = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CEYLON20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      toast.success('Promo code CEYLON20 applied! 20% OFF');
    } else if (promoCode.trim() !== '') {
      toast.error('Invalid promo code. Try "CEYLON20"');
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-[var(--white)] z-[var(--z-panel)]
          shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out font-sans
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--cultured)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[var(--eerie-black)] tracking-tight">Shopping Bag</h3>
            <span className="badge badge-accent font-bold rounded-full px-2.5 py-0.5 text-xs">
              {items.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[var(--cultured)] hover:bg-[var(--salmon-pink)] hover:text-white transition-colors flex items-center justify-center font-bold text-sm"
            aria-label="Close Bag"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-[var(--cultured)]">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            {remainingForFreeShipping > 0 ? (
              <span className="text-[var(--davys-gray)]">
                Add <strong className="text-[var(--salmon-pink)]">LKR {remainingForFreeShipping.toLocaleString()}</strong> more for FREE Shipping
              </span>
            ) : (
              <span className="text-[var(--ocean-green)] font-bold flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--ocean-green)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Congratulations! You unlocked FREE Express Delivery</span>
              </span>
            )}
            <span className="text-[var(--sonic-silver)]">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--cultured)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--salmon-pink)] to-[var(--ocean-green)] transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--sonic-silver)] space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-[var(--spanish-gray)]">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-[var(--eerie-black)] text-base mb-1">Your bag is empty</h4>
                <p className="text-xs">Explore our curated Ceylon catalog and add items.</p>
              </div>
              <Button onClick={onClose} variant="primary" className="mt-2 text-xs">
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-[var(--cultured)] last:border-0">
                <div className="w-20 h-20 rounded-lg bg-[var(--cultured)] overflow-hidden flex-shrink-0 border border-[var(--cultured)]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-[var(--eerie-black)] line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[var(--spanish-gray)] hover:text-[var(--bittersweet)] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {item.variant && (
                      <span className="text-xs text-[var(--sonic-silver)] capitalize">{item.variant}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-sm text-[var(--eerie-black)]">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </span>

                    <div className="flex items-center border border-[var(--cultured)] rounded-lg overflow-hidden bg-[var(--white)]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[var(--cultured)] text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[var(--eerie-black)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[var(--cultured)] text-xs font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--cultured)] bg-slate-50/50 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. CEYLON20)"
                className="field text-xs !py-2 uppercase"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button type="submit" variant="outline" className="text-xs !py-2 !px-3">
                Apply
              </Button>
            </form>

            <div className="space-y-2 text-xs text-[var(--davys-gray)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[var(--eerie-black)]">LKR {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--ocean-green)] font-semibold">
                  <span>Discount (20%)</span>
                  <span>- LKR {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[var(--eerie-black)]">
                  {remainingForFreeShipping === 0 ? 'FREE' : 'LKR 450'}
                </span>
              </div>
              <div className="pt-2 border-t border-[var(--cultured)] flex justify-between text-sm font-bold text-[var(--eerie-black)]">
                <span>Grand Total</span>
                <span className="text-[var(--salmon-pink)]">LKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={() => toast.success('Proceeding to Checkout flow...')}
              variant="primary"
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              <span>Proceed to Checkout</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
