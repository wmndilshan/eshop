'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShop } from '@/lib/api/seller-auth';
import { CATEGORIES, handleApiError } from '@/lib/utils';
import { Store, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateShopView({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    name: string; bio: string; category: string; address: string;
  }>({
    name: '',
    bio: '',
    category: CATEGORIES[0],
    address: '',
  });
  const [saving, setSaving] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: typeof form) => createShop(payload),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success('Shop created!');
      onSuccess?.();
    },
    onError: (e) => {
      handleApiError(e);
      setSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Shop name is required');
      return;
    }
    setSaving(true);
    mutation.mutate(form);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--cultured)',
    }}>
      <div className="card" style={{ padding: 36, maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--eerie-black)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Store size={24} style={{ color: 'var(--white)' }} />
          </div>
          <h1 style={{ fontSize: 'var(--fs-3)', fontWeight: 700, color: 'var(--eerie-black)', marginBottom: 6 }}>
            Create Your Shop
          </h1>
          <p style={{ color: 'var(--sonic-silver)', fontSize: 'var(--fs-7)' }}>
            Set up your shop to start listing products.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Shop Name *</label>
            <input
              className="field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Handmade Crafts Co."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="field"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell customers about your shop..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              className="field"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Shop address"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={saving}>
            {saving ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</>
            ) : 'Create Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}
