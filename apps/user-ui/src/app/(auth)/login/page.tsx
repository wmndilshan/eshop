'use client';

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
    watch,
    formState: { errors },
  } = useForm<LoginRequest>();

  const emailValue = watch('email', '');
  const emailValid = EMAIL_REGEX.test(emailValue);

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
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="auth-card px-6 py-8 sm:px-8 sm:py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors mb-8">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="font-semibold text-blue-600">CeylonMarket</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in with your email and password.</p>

          <form className="space-y-4" onSubmit={handleSubmit((d) => loginMutation.mutate(d))}>
            <div className="space-y-1.5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                className="auth-input"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: EMAIL_REGEX, message: 'Invalid email' },
                })}
              />
              {emailValue && !errors.email && emailValid && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Valid email
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="auth-input"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                })}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 rounded-xl font-medium transition-all duration-200 hover:opacity-95 active:scale-[0.99]"
              isLoading={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
