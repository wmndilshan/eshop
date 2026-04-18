'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, ForgotPasswordRequest, ResetPasswordRequest } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/otp-input';
import Link from 'next/link';

type ForgotFormData = ForgotPasswordRequest;
type ResetFormData = Omit<ResetPasswordRequest, 'email' | 'otp'> & { confirmPassword: string };

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

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

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data, variables) => {
      toast.success(data.message);
      setUserEmail(variables.email);
      setStep('otp');
      startResendTimer();
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
      startResendTimer();
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

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmitEmail = (data: ForgotFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyForgotPasswordOtpMutation.mutate({ email: userEmail, otp });
    } else {
      toast.error('Please enter a valid 6-digit OTP');
    }
  };

  const onSubmitReset = (data: ResetFormData) => {
    resetPasswordMutation.mutate({
      email: userEmail,
      newPassword: data.newPassword,
    });
  };

  if (step === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmitReset(onSubmitReset)}>
            <div className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={resetErrors.newPassword?.message}
                {...registerReset('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number',
                  },
                })}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={resetErrors.confirmPassword?.message}
                {...registerReset('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('newPassword') || 'Passwords do not match',
                })}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={resetPasswordMutation.isPending}
              >
                Reset Password
              </Button>

              <button
                type="button"
                onClick={() => setStep('otp')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a 6-digit code to <span className="font-medium">{userEmail}</span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <OtpInput value={otp} onChange={setOtp} />
            
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={otp.length !== 6}
              >
                Verify OTP
              </Button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => resendOtpMutation.mutate()}
                    disabled={resendOtpMutation.isPending}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to email
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you an OTP to reset your password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmitEmail(onSubmitEmail)}>
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            error={emailErrors.email?.message}
            {...registerEmail('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              isLoading={forgotPasswordMutation.isPending}
            >
              Send OTP
            </Button>

            <Link
              href="/login"
              className="text-center text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
