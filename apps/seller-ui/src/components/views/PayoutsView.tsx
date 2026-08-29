'use client';

import { CreditCard, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PayoutsView() {
  const { seller } = useAuth();
  const hasStripe = !!seller?.stripeId;

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Payouts</div>
      </div>

      <div className="page-content">
        <div className="card" style={{ padding: 30, maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--cultured)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <CreditCard size={28} style={{ color: 'var(--sonic-silver)' }} />
            </div>

            {hasStripe ? (
              <>
                <div style={{ fontSize: 'var(--fs-4)', fontWeight: 600, color: 'var(--eerie-black)' }}>
                  Stripe Connected
                </div>
                <p style={{ color: 'var(--sonic-silver)', maxWidth: 360 }}>
                  Your Stripe account is connected. Payout details and transaction history will appear here.
                </p>
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={14} />
                  Stripe Dashboard
                </a>
              </>
            ) : (
              <>
                <div style={{ fontSize: 'var(--fs-4)', fontWeight: 600, color: 'var(--eerie-black)' }}>
                  Connect Stripe to Receive Payouts
                </div>
                <p style={{ color: 'var(--sonic-silver)', maxWidth: 360 }}>
                  Connect your Stripe account to start receiving payments from your customers.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
