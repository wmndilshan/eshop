'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authApi, ForgotPasswordRequest, ResetPasswordRequest } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/otp-input';

type ForgotFormData = ForgotPasswordRequest;
type ResetFormData = Omit<ResetPasswordRequest, 'email' | 'otp'> & { confirmPassword: string };

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(0);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpExpiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<ForgotFormData>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    watch,
  } = useForm<ResetFormData>();

  const newPasswordValue = watch('newPassword', '');
  const hasUppercase = /[A-Z]/.test(newPasswordValue);
  const hasLowercase = /[a-z]/.test(newPasswordValue);
  const hasNumber = /\d/.test(newPasswordValue);
  const isLongEnough = newPasswordValue.length >= 8;

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data, variables) => {
      toast.success(data.message);
      setUserEmail(variables.email);
      setStep('otp');
      setOtp('');
      startOtpTimers();
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/login');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: () => authApi.forgotPassword({ email: userEmail }),
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

  const verifyForgotPasswordOtpMutation = useMutation({
    mutationFn: authApi.verifyForgotPasswordOtp,
    onSuccess: (data) => {
      toast.success(data.message);
      setStep('reset');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      setOtp('');
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

  const onSubmitEmail = (data: ForgotFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      verifyForgotPasswordOtpMutation.mutate({ email: userEmail, otp });
    } else {
      toast.error('Please enter a valid 4-digit code');
    }
  };

  const onSubmitReset = (data: ResetFormData) => {
    resetPasswordMutation.mutate({
      email: userEmail,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="space-y-6 font-sans my-auto py-4">
      {step === 'email' && (
        <>
          <div>
            <span className="badge badge-dark mb-2">Password Recovery</span>
            <h1 className="text-3xl font-extrabold text-[var(--eerie-black)] tracking-tight mb-1">
              Reset Password
            </h1>
            <p className="text-xs text-[var(--sonic-silver)]">
              Enter your registered email address to receive a 4-digit security code.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmitEmail(onSubmitEmail)}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@domain.com"
              error={emailErrors.email?.message}
              {...registerEmail('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-xs font-bold"
              isLoading={forgotPasswordMutation.isPending}
            >
              Send Recovery Code
            </Button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <div className="text-center space-y-5">
          <span className="badge badge-accent">Step 2 of 3</span>
          <h2 className="text-2xl font-bold text-[var(--eerie-black)]">Verify Recovery Code</h2>
          <p className="text-xs text-[var(--sonic-silver)]">
            Sent to <strong className="text-[var(--eerie-black)]">{userEmail}</strong>
          </p>

          <form onSubmit={handleOtpSubmit} className="space-y-5 max-w-sm mx-auto">
            <OtpInput value={otp} onChange={setOtp} />

            <p className="text-xs text-[var(--salmon-pink)] font-bold">
              Expires in {formatOtpExpiry(otpExpiryTimer)}
            </p>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-xs font-bold"
              disabled={otp.length !== 4}
              isLoading={verifyForgotPasswordOtpMutation.isPending}
            >
              Verify Code
            </Button>

            <div className="text-xs text-[var(--davys-gray)] pt-2">
              Didn&apos;t receive the code?{' '}
              {resendTimer > 0 ? (
                <span className="text-[var(--spanish-gray)]">Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => resendOtpMutation.mutate()}
                  className="text-[var(--salmon-pink)] font-bold hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {step === 'reset' && (
        <>
          <div>
            <span className="badge badge-dark mb-2">Final Step</span>
            <h2 className="text-2xl font-bold text-[var(--eerie-black)]">Set New Password</h2>
            <p className="text-xs text-[var(--sonic-silver)]">Choose a strong new password for your account.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmitReset(onSubmitReset)}>
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={resetErrors.newPassword?.message}
              {...registerReset('newPassword', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must contain uppercase, lowercase & number',
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={resetErrors.confirmPassword?.message}
              {...registerReset('confirmPassword', {
                required: 'Please confirm your new password',
                validate: (val) => val === watch('newPassword') || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-xs font-bold"
              isLoading={resetPasswordMutation.isPending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}

      <p className="text-center text-xs text-[var(--davys-gray)] pt-4">
        Remember your password?{' '}
        <Link href="/login" className="text-[var(--salmon-pink)] font-bold hover:underline">
          Return to Sign In
        </Link>
      </p>
    </div>
  );
}
