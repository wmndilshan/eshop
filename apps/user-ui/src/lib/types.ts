export type ProductStatus = "draft" | "active" | "archived"
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  created_at: string
}

export interface Shop {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string
  category: string
  logo_url: string | null
  banner_url: string | null
  rating: number
  rating_count: number
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  slug: string
  name: string
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  shop_id: string
  seller_id: string
  name: string
  slug: string | null
  description: string
  category: string
  category_id: string | null
  price: number
  original_price: number | null
  stock: number
  images: string[]
  status: ProductStatus
  rating: number
  rating_count: number
  created_at: string
  shop?: Shop
}

export interface ProductReview {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  profile?: Pick<Profile, "full_name" | "avatar_url">
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Address {
  id: string
  user_id: string
  label: string
  recipient_name: string
  line1: string
  line2: string | null
  city: string
  district: string | null
  postal_code: string | null
  phone: string
  is_default: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  shop_id: string
  status: OrderStatus
  total: number
  shipping_total: number
  address_snapshot: Record<string, unknown> | null
  created_at: string
  shop?: Shop
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  price: number
  quantity: number
  created_at: string
}

export interface ShopFollow {
  id: string
  user_id: string
  shop_id: string
  created_at: string
}

export const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  crafts: "Crafts",
  groceries: "Groceries",
  health: "Health & Beauty",
  home: "Home & Living",
  other: "Other",
}

export const CATEGORY_ICONS: Record<string, string> = {
  electronics: "tv",
  fashion: "shirt",
  crafts: "palette",
  groceries: "shopping-basket",
  health: "heart-pulse",
  home: "sofa",
  other: "tag",
}

export function formatLKR(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-LK", { maximumFractionDigits: 0 })
}
