'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { sellerAuthApi, RegisterSellerRequest } from '@/lib/api/seller-auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/otp-input';

type FormData = RegisterSellerRequest & { confirmPassword?: string };

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function SellerRegisterPage() {
  const router = useRouter();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(0);
  
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpExpiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const formValues = watch();

  const registerMutation = useMutation({
    mutationFn: sellerAuthApi.register,
    onSuccess: (data) => {
      toast.success(data.message);
      setOtp('');
      setShowOtpForm(true);
      startOtpTimers();
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: sellerAuthApi.verifyOtp,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/login');
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
      setOtp('');
    },
  });

  // Re-trigger OTP activation mail sending
  const resendOtpMutation = useMutation({
    mutationFn: () => sellerAuthApi.register({ name: formValues.name, email: formValues.email, phone_number: formValues.phone_number, country: formValues.country }),
    onSuccess: (data) => {
      toast.success(data.message);
      setOtp('');
      startOtpTimers();
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
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

  const handleRegisterSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      verifyOtpMutation.mutate({
        email: formValues.email,
        otp,
        name: formValues.name,
        password: formValues.password,
        phone_number: formValues.phone_number,
        country: formValues.country,
      });
    } else {
      toast.error('Please enter a 4-digit code');
    }
  };

  if (showOtpForm) {
    return (
      <div className="border border-[var(--cultured)] p-8 rounded-xl shadow-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-[var(--cultured)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--eerie-black)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--eerie-black)] tracking-tight mb-2">Verify Your Account</h2>
          <p className="text-[var(--davys-gray)] text-sm">We&apos;ve sent a 4-digit verification code to</p>
          <p className="font-semibold text-[var(--eerie-black)] mt-1 text-sm">{formValues.email}</p>
        </div>

        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          <div>
            <OtpInput value={otp} onChange={setOtp} />
            <p className="text-center text-xs text-[var(--salmon-pink)] mt-4 flex items-center justify-center gap-1 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Code expires in {formatOtpExpiry(otpExpiryTimer)}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={verifyOtpMutation.isPending}
              disabled={otp.length !== 4}
            >
              Verify & Register
            </Button>

            <div className="text-center text-sm text-[var(--davys-gray)] mt-2">
              Didn&apos;t receive the code?
              {resendTimer > 0 ? (
                <p className="font-medium text-[var(--sonic-silver)] mt-1">Resend OTP in {resendTimer}s</p>
              ) : (
                <button
                  type="button"
                  onClick={() => resendOtpMutation.mutate()}
                  disabled={resendOtpMutation.isPending}
                  className="text-[var(--salmon-pink)] hover:underline font-semibold block mx-auto mt-1"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowOtpForm(false)}
              className="text-xs text-[var(--sonic-silver)] hover:text-[var(--salmon-pink)] font-semibold transition-colors mt-4 block mx-auto"
            >
              ← Edit Account Details
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--eerie-black)] tracking-tight mb-2">Create Seller Account</h1>
        <p className="text-[var(--sonic-silver)] text-sm">
          Already registered?{' '}
          <Link href="/login" className="text-[var(--salmon-pink)] font-semibold hover:underline transition-colors">
            Log in here
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(handleRegisterSubmit)}>
        <Input
          label="Full Name"
          type="text"
          placeholder="Ruwan Perera"
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
          })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="ruwan@store.lk"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: { value: EMAIL_REGEX, message: 'Invalid email address' },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="0771234567"
            error={errors.phone_number?.message}
            {...register('phone_number', {
              required: 'Phone number is required',
              pattern: { value: /^[0-9+ ]{9,14}$/, message: 'Invalid phone number' },
            })}
          />
          <Input
            label="Country"
            type="text"
            placeholder="Sri Lanka"
            defaultValue="Sri Lanka"
            error={errors.country?.message}
            {...register('country', {
              required: 'Country is required',
            })}
          />
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />

        <div className="flex items-start gap-2.5 pt-2">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 rounded border-[var(--cultured)] text-[var(--salmon-pink)] focus:ring-[var(--salmon-pink)] mt-0.5"
            required
          />
          <label htmlFor="terms" className="text-xs text-[var(--davys-gray)] leading-tight select-none">
            I agree to the{' '}
            <Link href="#" className="text-[var(--salmon-pink)] hover:underline font-semibold">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-[var(--salmon-pink)] hover:underline font-semibold">Privacy Policy</Link>
            {' '}to sell on LankaPremium.
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          isLoading={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Sending verification code…' : 'Register Seller'}
        </Button>
      </form>

      <footer className="mt-8 text-center">
        <p className="text-xs text-[var(--sonic-silver)]">
          © 2026 LankaPremium Seller Portal. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
