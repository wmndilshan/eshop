'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { getDashboardStats } from '@/lib/api/seller-catalog';
import { formatLKR, formatDate, orderStatusBadge } from '@/lib/utils';
import { TrendingUp, ShoppingCart, Package, Star } from 'lucide-react';
import Link from 'next/link';

const CHART_COLORS = [
  'var(--salmon-pink)',
  'var(--ocean-green)',
  'var(--sandy-brown)',
  'var(--sonic-silver)',
  'var(--onyx)',
  'var(--eerie-black)',
];

function StatCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="stat-label">{label}</span>
        <Icon size={18} color={accent ? 'var(--salmon-pink)' : 'var(--sonic-silver)'} />
      </div>
      <div className="stat-value" style={accent ? { color: 'var(--salmon-pink)' } : {}}>
        {value}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 28, width: '80%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '40%' }} />
    </div>
  );
}

export default function OverviewView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats(),
    staleTime: 60_000,
  });

  const stats = data?.data;

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Overview</div>
      </div>

      <div className="page-content">
        {isError && (
          <div className="error-banner">
            Failed to load dashboard stats. Please refresh.
          </div>
        )}

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Revenue"
                value={formatLKR(stats?.revenue ?? 0)}
                sub="Completed orders"
                icon={TrendingUp}
                accent
              />
              <StatCard
                label="Total Orders"
                value={String(stats?.orderCount ?? 0)}
                sub={`${stats?.pendingOrders ?? 0} pending`}
                icon={ShoppingCart}
              />
              <StatCard
                label="Products Listed"
                value={String(stats?.listingCount ?? 0)}
                sub="Active listings"
                icon={Package}
              />
              <StatCard
                label="Avg. Rating"
                value={(stats?.averageRating ?? 0).toFixed(1)}
                sub="From reviews"
                icon={Star}
              />
            </>
          )}
        </div>

        {/* Charts row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}>
          {/* Revenue chart */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 'var(--fs-7)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 16 }}>
              Monthly Revenue (LKR)
            </div>
            {isLoading ? (
              <div className="skeleton" style={{ height: 180 }} />
            ) : (stats?.monthlySales?.length ?? 0) === 0 ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-desc">No sales data yet</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={stats!.monthlySales}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--sonic-silver)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--sonic-silver)' }} />
                  <Tooltip
                    formatter={(v: unknown) => [formatLKR(Number(v)), 'Revenue']}
                    contentStyle={{
                      background: 'var(--white)',
                      border: '1px solid var(--cultured)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--salmon-pink)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--salmon-pink)', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category pie */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 'var(--fs-7)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 16 }}>
              Products by Category
            </div>
            {isLoading ? (
              <div className="skeleton" style={{ height: 180 }} />
            ) : (stats?.categoryShare?.length ?? 0) === 0 ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-desc">No products yet</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={stats!.categoryShare}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    label={(entry: { category?: string; percent?: number }) =>
                      `${entry.category ?? ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    style={{ fontSize: 10 }}
                  >
                    {stats!.categoryShare.map((_: unknown, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--cultured)',
          }}>
            <div style={{ fontSize: 'var(--fs-7)', fontWeight: 600, color: 'var(--eerie-black)' }}>
              Recent Orders
            </div>
            <button
              onClick={() => onNavigate?.('orders')}
              style={{ fontSize: 'var(--fs-8)', color: 'var(--salmon-pink)', textDecoration: 'none', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View all →
            </button>
          </div>

          {isLoading ? (
            <div style={{ padding: 20 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />
              ))}
            </div>
          ) : (stats?.recentOrders?.length ?? 0) === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <div className="empty-title">No orders yet</div>
              <div className="empty-desc">Orders from customers will appear here.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats!.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <button
                          onClick={() => onNavigate?.(`orders/${order.id}`)}
                          style={{ color: 'var(--eerie-black)', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          #{order.orderNumber}
                        </button>
                      </td>
                      <td>{order.customerName}</td>
                      <td style={{ color: 'var(--salmon-pink)', fontWeight: 600 }}>
                        {formatLKR(order.total)}
                      </td>
                      <td style={{ color: 'var(--sonic-silver)' }}>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className={`badge ${orderStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
