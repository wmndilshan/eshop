'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts, deleteProduct, updateProduct,
  type ProductsQuery, type Product,
} from '@/lib/api/seller-catalog';
import {
  CATEGORIES, formatLKR, handleApiError, productStatusBadge,
} from '@/lib/utils';
import { Search, Plus, Pencil, Trash2, Package, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const LIMIT = 10;

export default function ProductsView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const query: ProductsQuery = {
    search: search || undefined,
    category: category || undefined,
    status: (status as Product['status']) || undefined,
    page,
    limit: LIMIT,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', query],
    queryFn: () => getProducts(query),
    staleTime: 30_000,
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => updateProduct(id, { status: 'archived' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Product archived');
    },
    onError: (e) => handleApiError(e),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Product deleted');
      setConfirmDelete(null);
      setDeleting(false);
    },
    onError: (e) => {
      handleApiError(e);
      setDeleting(false);
    },
  });

  const result = data?.data;
  const totalPages = result ? Math.ceil(result.total / result.limit) : 1;

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    deleteMutation.mutate(confirmDelete.id);
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Products</div>
        <button className="btn-primary btn-sm" onClick={() => onNavigate?.('products/new')}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="filter-row">
          <div className="search-bar">
            <span className="search-icon"><Search size={16} /></span>
            <input
              className="field"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="field"
            style={{ width: 'auto', minWidth: 140 }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="field"
            style={{ width: 'auto', minWidth: 130 }}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {isError && (
          <div className="error-banner">Failed to load products. Please refresh.</div>
        )}

        {/* Table */}
        <div className="card">
          {isLoading ? (
            <div style={{ padding: 20 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
              ))}
            </div>
          ) : !result || result.products.length === 0 ? (
            <div className="empty-state">
              <Package size={48} style={{ color: 'var(--cultured)' }} />
              <div className="empty-title">No products yet</div>
              <div className="empty-desc">Add your first product to start selling.</div>
              <button className="btn-primary btn-sm" onClick={() => onNavigate?.('products/new')}>
                <Plus size={16} />
                Add Product
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {result.products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                              background: 'var(--cultured)', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Package size={18} style={{ color: 'var(--spanish-gray)' }} />
                            </div>
                          )}
                          <button
                            onClick={() => onNavigate?.(`products/${p.id}/edit`)}
                            style={{ color: 'var(--eerie-black)', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {p.name}
                          </button>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ color: 'var(--salmon-pink)', fontWeight: 600 }}>{formatLKR(p.price)}</td>
                      <td>
                        {p.stock <= 5 ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--bittersweet)', fontWeight: 600 }}>
                            <AlertTriangle size={14} />
                            {p.stock} left
                          </span>
                        ) : (
                          p.stock
                        )}
                      </td>
                      <td>
                        <span className={`badge ${productStatusBadge(p.status)}`}>{p.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn-ghost btn-icon"
                            onClick={() => onNavigate?.(`products/${p.id}/edit`)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          {p.status !== 'archived' && (
                            <button
                              className="btn-ghost btn-icon"
                              onClick={() => archiveMutation.mutate(p.id)}
                              title="Archive"
                              disabled={archiveMutation.isPending}
                            >
                              <Package size={15} />
                            </button>
                          )}
                          <button
                            className="btn-ghost btn-icon"
                            onClick={() => setConfirmDelete(p)}
                            title="Delete"
                            style={{ color: 'var(--bittersweet)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {result && result.total > LIMIT && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span style={{ color: 'var(--spanish-gray)', padding: '0 4px' }}>…</span>
                  )}
                  <button
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button
              className="page-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="modal-backdrop active" onClick={() => !deleting && setConfirmDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 'var(--fs-4)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 8 }}>
              Delete product?
            </h3>
            <p style={{ color: 'var(--sonic-silver)', marginBottom: 20 }}>
              Are you sure you want to delete &quot;{confirmDelete.name}&quot;? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn-outline"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ background: 'var(--bittersweet)' }}
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
