import axios, { AxiosError } from 'axios';

const AUTH_SERVICE_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:6001')
    : (process.env.AUTH_SERVICE_URL || 'http://localhost:6001');

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/** Axios instance for auth-service; use for all auth API calls (register, login, etc.) */
export const authClient = axios.create({
  baseURL: AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      statusCode: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
  }
  
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
}
