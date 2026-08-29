'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getLoggedInSeller } from '@/lib/api/seller-auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

// Views from components/views (fully converted, proper imports)
import CreateShopView from '@/components/views/CreateShopView';
import ConnectStripeView from '@/components/views/ConnectStripeView';
import OverviewView from '@/components/views/OverviewView';
import ProductsView from '@/components/views/ProductsView';
import OrdersView from '@/components/views/OrdersView';
import OrderDetailView from '@/components/views/OrderDetailView';
import ReviewsView from '@/components/views/ReviewsView';
import SettingsView from '@/components/views/SettingsView';
import PayoutsView from '@/components/views/PayoutsView';
import ProductFormView from '@/components/views/ProductFormView';

export default function SellerDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Tab can be simple names or paths like 'orders/abc123' or 'products/abc123/edit' or 'products/new'
  const [currentTab, setCurrentTab] = useState('overview');

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['sellerProfile'],
    queryFn: async () => {
      const res = await getLoggedInSeller();
      return res.data;
    },
    retry: false,
  });

  // Redirect to login if api error occurs
  useEffect(() => {
    if (isError) {
      toast.error('Session expired. Please log in.');
      router.push('/login');
    }
  }, [isError, router]);

  const handleLogout = () => {
    // Clear cookies by setting past expiry date
    document.cookie = 'seller-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'seller-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    // Clear react-query cache
    queryClient.clear();

    toast.success('Successfully logged out of the portal');
    router.push('/login');
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50/50 animate-pulse font-sans">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-[var(--cultured)] h-full p-6 space-y-6">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-16 bg-slate-100 rounded" />
          <div className="space-y-3 pt-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col h-full">
          <div className="h-20 bg-white border-b border-[var(--cultured)] px-8 flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded-full w-10" />
          </div>
          <main className="flex-1 p-8 space-y-6">
            <div className="h-20 bg-slate-100 rounded" />
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-28 bg-slate-100 rounded" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Double check profileData exists
  if (!profileData?.seller) {
    return null;
  }

  const { seller } = profileData;

  // Onboarding Step 1: Create Shop if not exists
  if (!seller.shop) {
    return (
      <CreateShopView
        onSuccess={() => refetch()}
      />
    );
  }

  // Onboarding Step 2: Connect Stripe account if stripeId is missing
  if (!seller.stripeId) {
    return (
      <ConnectStripeView
        onSkip={() => refetch()}
      />
    );
  }

  // Determine which sub-view to show based on tab path
  const renderContent = () => {
    // Order detail: 'orders/<id>'
    const orderDetailMatch = currentTab.match(/^orders\/([^/]+)$/);
    if (orderDetailMatch) {
      return (
        <OrderDetailView
          orderId={orderDetailMatch[1]}
          onNavigate={setCurrentTab}
        />
      );
    }

    // Product form new: 'products/new'
    if (currentTab === 'products/new') {
      return <ProductFormView onNavigate={setCurrentTab} />;
    }

    // Product form edit: 'products/<id>/edit'
    const productEditMatch = currentTab.match(/^products\/([^/]+)\/edit$/);
    if (productEditMatch) {
      return (
        <ProductFormView
          productId={productEditMatch[1]}
          onNavigate={setCurrentTab}
        />
      );
    }

    // Main tabs
    switch (currentTab) {
      case 'overview':
        return <OverviewView onNavigate={setCurrentTab} />;
      case 'products':
        return <ProductsView onNavigate={setCurrentTab} />;
      case 'orders':
        return <OrdersView onNavigate={setCurrentTab} />;
      case 'reviews':
        return <ReviewsView />;
      case 'settings':
        return <SettingsView />;
      case 'payouts':
        return <PayoutsView />;
      default:
        return <OverviewView onNavigate={setCurrentTab} />;
    }
  };

  // Determine the top-level tab for sidebar highlighting
  const activeTopTab = currentTab.split('/')[0];

  return (
    <div className="flex bg-slate-50/50 min-h-screen text-[var(--davys-gray)]">
      <Sidebar
        currentTab={activeTopTab}
        setCurrentTab={setCurrentTab}
        shopName={seller.shop.name}
        shopCategory={seller.shop.category}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          sellerName={seller.name}
          sellerEmail={seller.email}
          currentTab={activeTopTab}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
