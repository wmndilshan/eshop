import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSeller, verifySeller } from '../lib/api/seller-auth';
import { handleApiError } from '../lib/utils';
import { Store, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error('All fields are required');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await registerSeller(form);
      toast.success('Verification code sent to your email');
      setStep('otp');
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Enter the verification code');
      return;
    }
    setLoading(true);
    try {
      await verifySeller({ email: form.email, otp });
      toast.success('Account verified! Please log in.');
      router.push('/login');
    } catch (err) {
      handleApiError(err);
    } finally {
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
            {step === 'details' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p style={{ color: 'var(--sonic-silver)', fontSize: 'var(--fs-7)', marginTop: 4 }}>
            {step === 'details'
              ? 'Start selling in minutes'
              : `Enter the code sent to ${form.email}`}
          </p>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleDetailsSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input
                className="field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+94 77 123 4567"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</>
              ) : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <input
                className="field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                style={{ textAlign: 'center', fontSize: 'var(--fs-4)', letterSpacing: 4 }}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</>
              ) : 'Verify'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => setStep('details')}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 'var(--fs-8)', color: 'var(--sonic-silver)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--salmon-pink)', fontWeight: 500, textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
