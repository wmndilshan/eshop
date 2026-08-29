import api from './client';

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shop?: Shop;
  stripeId?: string;
}

export interface Shop {
  id: string;
  name: string;
  bio?: string;
  category?: string;
  address?: string;
  website?: string;
  openingHours?: string;
  avatar?: string;
  ratings?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const loginSeller = (data: LoginPayload) =>
  api.post<{ seller: Seller }>('/api/login-seller', data);

export const registerSeller = (data: RegisterPayload) =>
  api.post('/api/seller-registration', data);

export const verifySeller = (data: { email: string; otp: string }) =>
  api.post('/api/verify-seller', data);

export const getLoggedInSeller = () =>
  api.get<{ seller: Seller }>('/api/logged-in-seller');

export const logoutSeller = () =>
  api.post('/api/logout-seller');

export const createShop = (data: Partial<Shop>) =>
  api.post('/api/create-shop', data);

export const createStripeLink = () =>
  api.post<{ url: string }>('/api/create-stripe-link');
