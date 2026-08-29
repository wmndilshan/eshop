'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShop, type ShopUpdatePayload } from '@/lib/api/seller-catalog';
import { CATEGORIES, handleApiError } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsView() {
  const { seller, refetch } = useAuth();
  const queryClient = useQueryClient();

  const shop = seller?.shop;

  const [form, setForm] = useState<ShopUpdatePayload>({
    name: '',
    bio: '',
    category: CATEGORIES[0],
    address: '',
    openingHours: '',
    website: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shop) {
      setForm({
        name: shop.name ?? '',
        bio: shop.bio ?? '',
        category: shop.category ?? CATEGORIES[0],
        address: shop.address ?? '',
        openingHours: shop.openingHours ?? '',
        website: shop.website ?? '',
      });
    }
  }, [shop]);

  const mutation = useMutation({
    mutationFn: (payload: ShopUpdatePayload) => updateShop(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      refetch();
      toast.success('Shop settings saved');
      setSaving(false);
    },
    onError: (e) => {
      handleApiError(e);
      setSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Shop name is required');
      return;
    }
    setSaving(true);
    mutation.mutate(form);
  };

  const handleDiscard = () => {
    if (shop) {
      setForm({
        name: shop.name ?? '',
        bio: shop.bio ?? '',
        category: shop.category ?? CATEGORIES[0],
        address: shop.address ?? '',
        openingHours: shop.openingHours ?? '',
        website: shop.website ?? '',
      });
    }
    toast('Changes discarded', { icon: '↺' });
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Settings</div>
      </div>

      <div className="page-content">
        <div className="card" style={{ padding: 24, maxWidth: 640 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Shop Name *</label>
              <input
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="My Shop"
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

            <div className="form-group">
              <label className="form-label">Opening Hours</label>
              <input
                className="field"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                placeholder="e.g. Mon-Fri 9AM-6PM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                className="field"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://myshop.com"
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
              <button type="button" className="btn-outline" onClick={handleDiscard} disabled={saving}>
                <RotateCcw size={16} /> Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
