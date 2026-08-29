'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { sellerAuthApi, LoginSellerRequest } from '@/lib/api/seller-auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function SellerLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginSellerRequest>();

  const emailValue = watch('email', '');
  const emailValid = EMAIL_REGEX.test(emailValue);

  const loginMutation = useMutation({
    mutationFn: sellerAuthApi.login,
    onSuccess: (data) => {
      toast.success(data.message);
      // Auth token cookies are handled automatically by httpOnly cookies (seller-access-token, seller-refresh-token)
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
    },
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--eerie-black)] tracking-tight mb-2">Seller Login</h1>
        <p className="text-[var(--sonic-silver)] text-sm">Enter your credentials to access the LankaPremium Seller Center.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit((d) => loginMutation.mutate(d))}>
        <div className="space-y-2">
          <Input
            label="Email Address"
            type="email"
            placeholder="seller@lankapremium.lk"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: EMAIL_REGEX, message: 'Invalid email address' },
            })}
          />
          {emailValue && !errors.email && emailValid && (
            <p className="text-xs text-[var(--ocean-green)] flex items-center gap-1 mt-1 font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Email address format is correct
            </p>
          )}
        </div>

        <div className="space-y-2">
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-[var(--cultured)] text-[var(--salmon-pink)] focus:ring-[var(--salmon-pink)]"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[var(--davys-gray)] select-none">
              Remember me
            </label>
          </div>
          <Link href="#" className="text-sm font-semibold text-[var(--onyx)] hover:text-[var(--salmon-pink)] transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--davys-gray)]">
        Don&apos;t have a seller account?{' '}
        <Link href="/register" className="font-semibold text-[var(--salmon-pink)] hover:underline transition-colors">
          Register now
        </Link>
      </p>

      <div className="mt-10 pt-6 border-t border-[var(--cultured)]">
        <div className="flex items-center justify-center gap-4 text-xs text-[var(--sonic-silver)]">
          <Link href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="#" className="hover:text-[var(--salmon-pink)] transition-colors">Contact Support</Link>
        </div>
      </div>
    </>
  );
}
