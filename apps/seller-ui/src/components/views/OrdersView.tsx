'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders, type OrdersQuery } from '@/lib/api/seller-catalog';
import { formatLKR, formatDate, orderStatusBadge, ORDER_STATUSES } from '@/lib/utils';
import { Search, ShoppingCart } from 'lucide-react';

const LIMIT = 10;

export default function OrdersView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const query: OrdersQuery = {
    search: search || undefined,
    status: (status as OrdersQuery['status']) || undefined,
    page,
    limit: LIMIT,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', query],
    queryFn: () => getOrders(query),
    staleTime: 30_000,
  });

  const result = data?.data;
  const totalPages = result ? Math.ceil(result.total / result.limit) : 1;

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Orders</div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="filter-row">
          <div className="search-bar">
            <span className="search-icon"><Search size={16} /></span>
            <input
              className="field"
              placeholder="Search by order # or customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="field"
            style={{ width: 'auto', minWidth: 150 }}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All status</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
          </select>
        </div>

        {isError && (
          <div className="error-banner">Failed to load orders. Please refresh.</div>
        )}

        {/* Table */}
        <div className="card">
          {isLoading ? (
            <div style={{ padding: 20 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
              ))}
            </div>
          ) : !result || result.orders.length === 0 ? (
            <div className="empty-state">
              <ShoppingCart size={48} style={{ color: 'var(--cultured)' }} />
              <div className="empty-title">No orders yet</div>
              <div className="empty-desc">When customers place orders, they&apos;ll appear here.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <button
                          onClick={() => onNavigate?.(`orders/${o.id}`)}
                          style={{ color: 'var(--eerie-black)', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          #{o.orderNumber}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{o.customerName}</div>
                        <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)' }}>{o.customerEmail}</div>
                      </td>
                      <td style={{ color: 'var(--sonic-silver)' }}>
                        {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                      </td>
                      <td style={{ color: 'var(--salmon-pink)', fontWeight: 600 }}>{formatLKR(o.total)}</td>
                      <td style={{ color: 'var(--sonic-silver)' }}>{formatDate(o.createdAt)}</td>
                      <td>
                        <span className={`badge ${orderStatusBadge(o.status)}`}>{o.status}</span>
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
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
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
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
