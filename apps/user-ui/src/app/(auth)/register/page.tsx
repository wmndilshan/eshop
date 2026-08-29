'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authApi, RegisterRequest } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/otp-input';

type FormData = RegisterRequest & { confirmPassword?: string };

export default function RegisterPage() {
  const router = useRouter();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(0);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpExpiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const passwordValue = watch('password', '');
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const isLongEnough = passwordValue.length >= 8;
  const strength = [isLongEnough, hasUppercase && hasLowercase, hasNumber].filter(Boolean).length;

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data, variables) => {
      toast.success(data.message);
      setUserEmail(variables.email);
      setUserName(variables.name);
      setUserPassword(variables.password);
      setOtp('');
      setShowOtpForm(true);
      startOtpTimers();
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/login');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      setOtp('');
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: () => authApi.resendOtp(userEmail, userName),
    onSuccess: (data) => {
      toast.success(data.message);
      setOtp('');
      startOtpTimers();
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });

  const clearTimer = (timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startOtpTimers = () => {
    clearTimer(resendTimerRef);
    clearTimer(otpExpiryTimerRef);

    setResendTimer(60);
    setOtpExpiryTimer(299);

    resendTimerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearTimer(resendTimerRef);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    otpExpiryTimerRef.current = setInterval(() => {
      setOtpExpiryTimer((prev) => {
        if (prev <= 1) {
          clearTimer(otpExpiryTimerRef);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimer(resendTimerRef);
      clearTimer(otpExpiryTimerRef);
    };
  }, []);

  const formatOtpExpiry = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      verifyOtpMutation.mutate({
        email: userEmail,
        otp,
        name: userName,
        password: userPassword,
      });
    } else {
      toast.error('Please enter a valid 4-digit code');
    }
  };

  // Render OTP Modal Dialog if active
  if (showOtpForm) {
    return (
      <div className="space-y-6 font-sans my-auto py-4 text-center">
        <span className="badge badge-accent">Security Verification</span>
        <h2 className="text-2xl font-bold text-[var(--eerie-black)]">Verify Email Address</h2>
        <p className="text-xs text-[var(--sonic-silver)]">
          We sent a 4-digit verification code to <strong className="text-[var(--eerie-black)]">{userEmail}</strong>
        </p>

        <form onSubmit={handleOtpSubmit} className="space-y-6 max-w-sm mx-auto pt-2">
          <OtpInput value={otp} onChange={setOtp} />

          <p className="text-xs text-[var(--salmon-pink)] font-bold">
            Code expires in {formatOtpExpiry(otpExpiryTimer)}
          </p>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-xs font-bold"
            disabled={otp.length !== 4}
            isLoading={verifyOtpMutation.isPending}
          >
            Verify & Create Account
          </Button>

          <div className="text-xs text-[var(--davys-gray)] pt-2">
            Didn&apos;t receive code?{' '}
            {resendTimer > 0 ? (
              <span className="text-[var(--spanish-gray)]">Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={() => resendOtpMutation.mutate()}
                className="text-[var(--salmon-pink)] font-bold hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowOtpForm(false)}
            className="text-xs text-[var(--sonic-silver)] hover:text-[var(--salmon-pink)] font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto pt-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Edit Registration Details</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans my-auto py-4">
      {/* Title */}
      <div>
        <span className="badge badge-dark mb-2">Join Anon Marketplace</span>
        <h1 className="text-3xl font-extrabold text-[var(--eerie-black)] tracking-tight mb-1">
          Create Account
        </h1>
        <p className="text-xs text-[var(--sonic-silver)]">
          Join thousands of shoppers and discover top-rated global & local brands.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@domain.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email' },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must contain uppercase, lowercase & number' },
          })}
        />

        {/* Live Password Strength Meter */}
        {passwordValue && (
          <div className="space-y-1 bg-slate-100 p-2.5 rounded-lg border border-[var(--cultured)]">
            <div className="flex gap-1 h-1.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    i < strength ? 'bg-[var(--salmon-pink)]' : 'bg-[var(--cultured)]'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-[var(--sonic-silver)] font-medium">
              <span>Strength: <strong className="text-[var(--salmon-pink)]">{['Weak', 'Fair', 'Strong'][strength - 1] || 'Weak'}</strong></span>
              <span>8+ chars, upper/lower & digit</span>
            </div>
          </div>
        )}

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === watch('password') || 'Passwords do not match',
          })}
        />

        {/* Terms Opt-in Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            className="rounded border-[var(--cultured)] text-[var(--salmon-pink)] focus:ring-[var(--salmon-pink)] h-4 w-4 mt-0.5"
            required
          />
          <label htmlFor="terms" className="text-xs text-[var(--davys-gray)] leading-tight select-none">
            I agree to the{' '}
            <Link href="#" className="text-[var(--salmon-pink)] font-bold hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-[var(--salmon-pink)] font-bold hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3.5 text-xs font-bold tracking-wider"
          isLoading={registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      {/* Footer link */}
      <p className="text-center text-xs text-[var(--davys-gray)] pt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--salmon-pink)] font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
