import api from './client';

// ─── Product ──────────────────────────────────────────────────────────────────

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  shopId: string;
  sellerId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  status?: ProductStatus;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductsQuery {
  search?: string;
  category?: string;
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export const getProducts = (params?: ProductsQuery) =>
  api.get<ProductsResponse>('/product/products', { params });

export const getProduct = (id: string) =>
  api.get<{ product: Product }>(`/product/products/${id}`);

export const createProduct = (data: ProductPayload) =>
  api.post<{ product: Product }>('/product/products', data);

export const updateProduct = (id: string, data: Partial<ProductPayload>) =>
  api.patch<{ product: Product }>(`/product/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/product/products/${id}`);

export const updateStock = (id: string, stock: number) =>
  api.patch(`/product/products/${id}/stock`, { stock });

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  cancelReason?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrdersQuery {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const getOrders = (params?: OrdersQuery) =>
  api.get<OrdersResponse>('/product/orders', { params });

export const getOrder = (id: string) =>
  api.get<{ order: Order }>(`/product/orders/${id}`);

export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
  cancelReason?: string
) =>
  api.patch(`/product/orders/${id}/status`, { status, cancelReason });

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  shopId: string;
  userId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export const getReviews = (params?: { page?: number; limit?: number }) =>
  api.get<ReviewsResponse>('/product/reviews', { params });

export const getReviewSummary = () =>
  api.get<ReviewSummary>('/product/reviews/summary');

// ─── Shop / Seller ────────────────────────────────────────────────────────────

export interface ShopUpdatePayload {
  name?: string;
  bio?: string;
  category?: string;
  address?: string;
  openingHours?: string;
  website?: string;
}

export const updateShop = (data: ShopUpdatePayload) =>
  api.patch('/product/shop', data);

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface CategoryShare {
  category: string;
  count: number;
}

export interface DashboardStats {
  revenue: number;
  orderCount: number;
  listingCount: number;
  averageRating: number;
  pendingOrders: number;
  monthlySales: MonthlySale[];
  categoryShare: CategoryShare[];
  recentOrders: Order[];
}

export const getDashboardStats = () =>
  api.get<DashboardStats>('/product/dashboard/stats');
