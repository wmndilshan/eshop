'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authApi, LoginRequest } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success(data.message);
      if (data.token) localStorage.setItem('auth-token', data.token);
      router.push('/');
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
    },
  });

  return (
    <div className="space-y-8 font-sans my-auto py-4">
      {/* Header */}
      <div>
        <span className="badge badge-dark mb-2">Customer Account</span>
        <h1 className="text-3xl font-extrabold text-[var(--eerie-black)] tracking-tight mb-1">
          Sign In to Anon
        </h1>
        <p className="text-xs text-[var(--sonic-silver)]">
          Manage your orders, save items to your wishlist, and track active deliveries.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@domain.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: { value: EMAIL_REGEX, message: 'Please enter a valid email address' },
          })}
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[var(--davys-gray)] uppercase tracking-wider text-[11px]">
              Password
            </span>
            <Link href="/forgot-password" className="text-[var(--salmon-pink)] hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[var(--davys-gray)] cursor-pointer select-none">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-[var(--cultured)] text-[var(--salmon-pink)] focus:ring-[var(--salmon-pink)] h-4 w-4"
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3.5 text-xs font-bold tracking-wider"
          isLoading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>

      {/* Social Sign-In Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--cultured)]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
          <span className="bg-slate-50 px-3 text-[var(--spanish-gray)] font-bold">Or Continue With</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="py-2.5 text-xs">
          Google
        </Button>
        <Button type="button" variant="outline" className="py-2.5 text-xs">
          GitHub
        </Button>
      </div>

      {/* Footer link */}
      <p className="text-center text-xs text-[var(--davys-gray)]">
        New to Anon?{' '}
        <Link href="/register" className="text-[var(--salmon-pink)] font-bold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
