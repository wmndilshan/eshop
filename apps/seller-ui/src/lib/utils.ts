import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const ae = err as AxiosError<{ message?: string; error?: string }>;
    const msg =
      ae.response?.data?.message ??
      ae.response?.data?.error ??
      ae.message ??
      'Something went wrong';
    toast.error(msg);
    return msg;
  }
  const msg = err instanceof Error ? err.message : 'Something went wrong';
  toast.error(msg);
  return msg;
}

export const CATEGORIES = [
  'electronics',
  'fashion',
  'crafts',
  'groceries',
  'health',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export function formatLKR(amount: number): string {
  return `LKR ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'completed',
  'cancelled',
] as const;

export type StatusColor =
  | 'badge-muted'
  | 'badge-warning'
  | 'badge-accent'
  | 'badge-success'
  | 'badge-alert';

export function orderStatusBadge(status: string): StatusColor {
  const map: Record<string, StatusColor> = {
    pending: 'badge-muted',
    processing: 'badge-warning',
    shipped: 'badge-accent',
    completed: 'badge-success',
    cancelled: 'badge-alert',
  };
  return map[status] ?? 'badge-muted';
}

export function productStatusBadge(status: string): StatusColor {
  const map: Record<string, StatusColor> = {
    active: 'badge-success',
    draft: 'badge-muted',
    archived: 'badge-alert',
  };
  return map[status] ?? 'badge-muted';
}
