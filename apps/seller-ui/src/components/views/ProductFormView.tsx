'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct, updateProduct, getProduct,
  type ProductPayload,
} from '@/lib/api/seller-catalog';
import { CATEGORIES, handleApiError } from '@/lib/utils';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductFormView({
  productId,
  onNavigate,
}: {
  productId?: string;
  onNavigate?: (tab: string) => void;
}) {
  const isEdit = !!productId;
  const queryClient = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId!),
    enabled: isEdit,
  });

  const product = existing?.data?.product;

  const [form, setForm] = useState<ProductPayload>({
    name: '',
    description: '',
    category: CATEGORIES[0],
    price: 0,
    stock: 0,
    images: [],
    status: 'active',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync form when product loads
  React.useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        category: product.category,
        price: product.price,
        stock: product.stock,
        images: product.images ?? [],
        status: product.status,
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: async (payload: ProductPayload) => {
      if (isEdit) {
        return updateProduct(productId!, payload);
      }
      return createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(isEdit ? 'Product updated' : 'Product created');
      onNavigate?.('products');
    },
    onError: (e) => {
      handleApiError(e);
      setSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (form.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    setSaving(true);
    mutation.mutate(form);
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setForm({ ...form, images: [...(form.images ?? []), imageUrl.trim()] });
    setImageUrl('');
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: (form.images ?? []).filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div className="topbar">
        <button className="btn-ghost" onClick={() => onNavigate?.('products')}>
          <ArrowLeft size={16} />
          Back to Products
        </button>
        <div className="topbar-title">{isEdit ? 'Edit Product' : 'New Product'}</div>
        <div />
      </div>

      <div className="page-content">
        <div className="card" style={{ padding: 24, maxWidth: 640 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Handmade Ceramic Mug"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Price (LKR) *</label>
                <input
                  className="field"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  className="field"
                  type="number"
                  min={0}
                  value={form.stock || ''}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your product..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ProductPayload['status'] })}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Product Images (URLs)</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  className="field"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                />
                <button type="button" className="btn-outline btn-sm" onClick={addImage}>
                  Add
                </button>
              </div>
              {(form.images ?? []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {(form.images ?? []).map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        style={{ width: 70, height: 70, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--cultured)' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{
                          position: 'absolute', top: -6, right: -6,
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'var(--bittersweet)', color: 'var(--white)',
                          border: 'none', cursor: 'pointer', fontSize: 12,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                ) : isEdit ? 'Save Changes' : 'Create Product'}
              </button>
              <button type="button" className="btn-outline" onClick={() => onNavigate?.('products')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
