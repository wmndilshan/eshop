'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
}

interface ProductQuickViewProps {
  product: ProductDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductDetail, quantity: number, variant?: string) => void;
}

export function ProductQuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductQuickViewProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const variantStr = [selectedColor, selectedSize].filter(Boolean).join(' / ');
    onAddToCart(product, quantity, variantStr || undefined);
    toast.success(`Added ${quantity} × ${product.name} to bag!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_0.2s_ease-out] font-sans">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card Container */}
      <div className="relative bg-[var(--white)] border border-[var(--cultured)] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-[var(--cultured)] hover:bg-[var(--salmon-pink)] hover:text-white transition-colors flex items-center justify-center text-sm"
          aria-label="Close Quick View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Gallery Column */}
        <div className="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between">
          <div className="h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden bg-white border border-[var(--cultured)] mb-4 flex items-center justify-center">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIdx === idx ? 'border-[var(--salmon-pink)] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-dark uppercase text-[10px]">{product.category}</span>
              {product.inStock ? (
                <span className="badge badge-success text-[10px]">In Stock</span>
              ) : (
                <span className="badge badge-alert text-[10px]">Out of Stock</span>
              )}
            </div>

            <h2 className="text-xl font-bold text-[var(--eerie-black)] tracking-tight mb-2">
              {product.name}
            </h2>

            {/* SVG Rating Stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-bold text-[var(--eerie-black)]">{product.rating}</span>
              <span className="text-xs text-[var(--sonic-silver)]">({product.reviewsCount} reviews)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[var(--eerie-black)]">
                LKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[var(--spanish-gray)] line-through font-medium">
                  LKR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--davys-gray)] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Colors Variant Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <label className="block text-xs font-bold uppercase text-[var(--davys-gray)]">
                  Color: <span className="text-[var(--salmon-pink)]">{selectedColor || 'Select'}</span>
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        selectedColor === c
                          ? 'border-[var(--salmon-pink)] bg-slate-900 text-white'
                          : 'border-[var(--cultured)] text-[var(--eerie-black)] hover:border-[var(--salmon-pink)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Variant Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <label className="block text-xs font-bold uppercase text-[var(--davys-gray)]">
                  Size: <span className="text-[var(--salmon-pink)]">{selectedSize || 'Select'}</span>
                </label>
                <div className="flex gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                        selectedSize === s
                          ? 'border-[var(--salmon-pink)] bg-slate-900 text-white'
                          : 'border-[var(--cultured)] text-[var(--eerie-black)] hover:border-[var(--salmon-pink)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[var(--cultured)] space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-[var(--cultured)] rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-10 flex items-center justify-center font-bold text-sm hover:bg-[var(--cultured)] transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-[var(--eerie-black)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-10 flex items-center justify-center font-bold text-sm hover:bg-[var(--cultured)] transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <Button
                onClick={handleAddToCart}
                variant="primary"
                className="flex-1 py-3 text-xs flex items-center justify-center gap-2"
                disabled={!product.inStock}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Bag</span>
              </Button>

              {/* Wishlist toggle */}
              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist!');
                }}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-[var(--bittersweet)]'
                    : 'border-[var(--cultured)] text-[var(--spanish-gray)] hover:text-[var(--bittersweet)]'
                }`}
                aria-label="Toggle Wishlist"
              >
                <svg
                  className={`w-5 h-5 ${isWishlisted ? 'fill-[var(--bittersweet)] text-[var(--bittersweet)]' : 'fill-none stroke-currentColor'}`}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
