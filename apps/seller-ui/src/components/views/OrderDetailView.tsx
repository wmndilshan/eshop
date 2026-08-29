'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrder, updateOrderStatus,
  type OrderStatus,
} from '@/lib/api/seller-catalog';
import { formatLKR, formatDate, orderStatusBadge, handleApiError } from '@/lib/utils';
import { ArrowLeft, Check, Clock, Truck, Package, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_FLOW: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed'];
const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  completed: Check,
  cancelled: XCircle,
};

export default function OrderDetailView({
  orderId,
  onNavigate,
}: {
  orderId: string;
  onNavigate?: (tab: string) => void;
}) {
  const queryClient = useQueryClient();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { status: OrderStatus; cancelReason?: string }) =>
      updateOrderStatus(orderId, vars.status, vars.cancelReason),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(`Order marked as ${vars.status}`);
      setShowCancel(false);
      setCancelReason('');
    },
    onError: (e) => handleApiError(e),
  });

  const order = data?.data?.order;

  if (isLoading) {
    return (
      <div>
        <div className="topbar"><div className="topbar-title">Order Details</div></div>
        <div className="page-content">
          <div className="skeleton" style={{ height: 300 }} />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div>
        <div className="topbar"><div className="topbar-title">Order Details</div></div>
        <div className="page-content">
          <div className="error-banner">Failed to load order. It may not exist.</div>
          <button className="btn-outline" onClick={() => onNavigate?.('orders')}>
            <ArrowLeft size={16} /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : null;

  const canAdvance = order.status !== 'completed' && order.status !== 'cancelled';

  return (
    <div>
      <div className="topbar">
        <button className="btn-ghost" onClick={() => onNavigate?.('orders')}>
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <div className="topbar-title">Order #{order.orderNumber}</div>
        <span className={`badge ${orderStatusBadge(order.status)}`}>{order.status}</span>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {/* Order info */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 'var(--fs-7)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 16 }}>
              Customer Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Name</div>
                <div style={{ fontWeight: 500, color: 'var(--eerie-black)' }}>{order.customerName}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</div>
                <div style={{ fontWeight: 500, color: 'var(--eerie-black)' }}>{order.customerEmail}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Order Date</div>
                <div style={{ fontWeight: 500, color: 'var(--eerie-black)' }}>{formatDate(order.createdAt)}</div>
              </div>
              {order.address && (
                <div>
                  <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Shipping Address</div>
                  <div style={{ fontWeight: 500, color: 'var(--eerie-black)' }}>{order.address}</div>
                </div>
              )}
              {order.cancelReason && (
                <div>
                  <div style={{ fontSize: 'var(--fs-9)', color: 'var(--bittersweet)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cancel Reason</div>
                  <div style={{ fontWeight: 500, color: 'var(--bittersweet)' }}>{order.cancelReason}</div>
                </div>
              )}
            </div>
          </div>

          {/* Status timeline */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 'var(--fs-7)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 16 }}>
              Order Timeline
            </div>
            <div className="status-timeline">
              {STATUS_FLOW.map((s, idx) => {
                const Icon = STATUS_ICONS[s];
                const done = idx < currentIdx || order.status === 'completed';
                const current = idx === currentIdx;
                return (
                  <div key={s} className="status-step">
                    <div className={`step-dot ${done ? 'done' : current ? 'current' : ''}`}>
                      <Icon size={14} />
                    </div>
                    <div className="step-info">
                      <div className="step-label" style={{ textTransform: 'capitalize' }}>{s}</div>
                      <div className="step-desc">
                        {done ? 'Completed' : current ? 'Current status' : 'Pending'}
                      </div>
                    </div>
                  </div>
                );
              })}
              {order.status === 'cancelled' && (
                <div className="status-step">
                  <div className="step-dot" style={{ background: 'var(--bittersweet)', borderColor: 'var(--bittersweet)', color: 'var(--white)' }}>
                    <XCircle size={14} />
                  </div>
                  <div className="step-info">
                    <div className="step-label" style={{ color: 'var(--bittersweet)' }}>Cancelled</div>
                    {order.cancelReason && <div className="step-desc">{order.cancelReason}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {canAdvance && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                {nextStatus && (
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => statusMutation.mutate({ status: nextStatus })}
                    disabled={statusMutation.isPending}
                  >
                    {statusMutation.isPending ? (
                      <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
                    ) : (
                      <>Mark as {nextStatus}</>
                    )}
                  </button>
                )}
                <button
                  className="btn-outline btn-sm"
                  style={{ borderColor: 'var(--bittersweet)', color: 'var(--bittersweet)' }}
                  onClick={() => setShowCancel(true)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--cultured)',
            fontSize: 'var(--fs-7)',
            fontWeight: 600,
            color: 'var(--eerie-black)',
          }}>
            Order Items
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500, color: 'var(--eerie-black)' }}>{item.productName}</td>
                    <td>{formatLKR(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td style={{ color: 'var(--salmon-pink)', fontWeight: 600 }}>
                      {formatLKR(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600, color: 'var(--eerie-black)', borderTop: '2px solid var(--cultured)' }}>
                    Total
                  </td>
                  <td style={{ color: 'var(--salmon-pink)', fontWeight: 700, fontSize: 'var(--fs-6)', borderTop: '2px solid var(--cultured)' }}>
                    {formatLKR(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel dialog */}
      {showCancel && (
        <div className="modal-backdrop active" onClick={() => !statusMutation.isPending && setShowCancel(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 'var(--fs-4)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 8 }}>
              Cancel this order?
            </h3>
            <p style={{ color: 'var(--sonic-silver)', marginBottom: 16 }}>
              Please provide a reason for cancelling order #{order.orderNumber}.
            </p>
            <textarea
              className="field"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
              style={{ marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn-outline"
                onClick={() => setShowCancel(false)}
                disabled={statusMutation.isPending}
              >
                Keep Order
              </button>
              <button
                className="btn-primary"
                style={{ background: 'var(--bittersweet)' }}
                onClick={() => statusMutation.mutate({ status: 'cancelled', cancelReason })}
                disabled={statusMutation.isPending}
              >
                {statusMutation.isPending ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
