import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { loginSeller } from '../lib/api/seller-auth';
import { handleApiError } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Loader2, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      await loginSeller({ email, password });
      queryClient.invalidateQueries();
      await refetch();
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      handleApiError(err);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--cultured)',
    }}>
      <div className="card" style={{ padding: 36, maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--eerie-black)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
          }}>
            <Store size={24} style={{ color: 'var(--white)' }} />
          </div>
          <h1 style={{ fontSize: 'var(--fs-3)', fontWeight: 700, color: 'var(--eerie-black)' }}>
            Seller Login
          </h1>
          <p style={{ color: 'var(--sonic-silver)', fontSize: 'var(--fs-7)', marginTop: 4 }}>
            Welcome back to your shop
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 'var(--fs-8)', color: 'var(--sonic-silver)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--salmon-pink)', fontWeight: 500, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
