import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout() {
  const { seller, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--salmon-pink)' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!seller) return <Navigate to="/login" replace />;

  // Onboarding: no shop yet
  if (!seller.shop) return <Navigate to="/onboarding/shop" replace />;

  // Onboarding: no stripe
  if (!seller.stripeId) return <Navigate to="/onboarding/stripe" replace />;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
