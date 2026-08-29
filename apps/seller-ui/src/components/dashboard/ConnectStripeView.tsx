import React from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerAuthApi } from '@/lib/api/seller-auth';
import { handleApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';

interface ConnectStripeProps {
  sellerId: string;
  shopName: string;
}

export function ConnectStripeView({ sellerId, shopName }: ConnectStripeProps) {
  const createStripeLinkMutation = useMutation({
    mutationFn: () => sellerAuthApi.createStripeLink({ sellerId }),
    onSuccess: (data) => {
      if (data.url) {
        toast.loading('Redirecting to Stripe Connect onboarding...', { duration: 3000 });
        window.location.href = data.url;
      } else {
        toast.error('Unable to retrieve Stripe onboarding link');
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
    },
  });

  return (
    <div className="min-h-screen bg-[var(--white)] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[500px] w-full border border-[var(--cultured)] p-8 rounded-xl shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
            💳
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[var(--eerie-black)] tracking-tight mb-3">
          Configure Shop Payouts
        </h2>
        <p className="text-sm font-semibold text-[var(--eerie-black)] mb-2">
          Store: <span className="text-[var(--salmon-pink)]">{shopName}</span>
        </p>
        <p className="text-sm text-[var(--sonic-silver)] leading-relaxed mb-8">
          To receive secure payouts, LankaPremium partners with Stripe. Connect your store with Stripe to enable card payments at checkouts and receive funds directly to your local bank account.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => createStripeLinkMutation.mutate()}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            isLoading={createStripeLinkMutation.isPending}
          >
            Connect Stripe Account
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>

          <p className="text-xs text-[var(--spanish-gray)]">
            You will be redirected securely to Stripe to set up your business details.
          </p>
        </div>
      </div>
    </div>
  );
}
