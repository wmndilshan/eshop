'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStripeLink } from '@/lib/api/seller-auth';
import { handleApiError } from '@/lib/utils';
import { CreditCard, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConnectStripeView({ onSkip }: { onSkip?: () => void }) {
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState(false);

  const mutation = useMutation({
    mutationFn: () => createStripeLink(),
    onSuccess: (res: { data: { url?: string } }) => {
      const url = res.data.url;
      if (url) {
        queryClient.invalidateQueries();
        window.location.href = url;
      } else {
        toast.error('Could not get Stripe link');
        setConnecting(false);
      }
    },
    onError: (e) => {
      handleApiError(e);
      setConnecting(false);
    },
  });

  const handleConnect = () => {
    setConnecting(true);
    mutation.mutate();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--cultured)',
    }}>
      <div className="card" style={{ padding: 36, maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: 'var(--eerie-black)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <CreditCard size={24} style={{ color: 'var(--white)' }} />
        </div>
        <h1 style={{ fontSize: 'var(--fs-3)', fontWeight: 700, color: 'var(--eerie-black)', marginBottom: 6 }}>
          Connect Stripe
        </h1>
        <p style={{ color: 'var(--sonic-silver)', fontSize: 'var(--fs-7)', marginBottom: 24, lineHeight: 1.5 }}>
          Connect your Stripe account to accept payments and receive payouts from your sales.
        </p>

        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Connecting...</>
          ) : (
            <><Zap size={16} /> Connect with Stripe</>
          )}
        </button>

        {onSkip && (
          <button
            className="btn-ghost"
            style={{ width: '100%', marginTop: 8 }}
            onClick={onSkip}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
