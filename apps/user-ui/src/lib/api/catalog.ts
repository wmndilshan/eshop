import { supabase } from "@/lib/supabase"
import type { Product, Shop, Category, ProductReview } from "@/lib/types"

export async function fetchProducts(params: {
  search?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
}): Promise<{ products: Product[]; total: number }> {
  const { search, category, sort, page = 1, limit = 12 } = params
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("products")
    .select("*, shop:shops(*)", { count: "exact" })
    .eq("status", "active")
    .range(from, to)

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }
  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "rating":
      query = query.order("rating", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data, count } = await query
  return {
    products: (data as Product[]) ?? [],
    total: count ?? 0,
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("status", "active")
    .order("rating", { ascending: false })
    .limit(limit)
  return (data as Product[]) ?? []
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("id", id)
    .maybeSingle()
  return (data as Product) ?? null
}

export async function fetchRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("status", "active")
    .eq("category", category)
    .neq("id", productId)
    .limit(limit)
  return (data as Product[]) ?? []
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
  return (data as Category[]) ?? []
}

export async function fetchCategoryProductCounts(): Promise<Record<string, number>> {
  const { data } = await supabase
    .from("products")
    .select("category")
    .eq("status", "active")
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const cat = (row as { category: string }).category
    counts[cat] = (counts[cat] ?? 0) + 1
  }
  return counts
}

export async function fetchShopById(id: string): Promise<Shop | null> {
  const { data } = await supabase
    .from("shops")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  return (data as Shop) ?? null
}

export async function fetchShopBySlug(slug: string): Promise<Shop | null> {
  const { data } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()
  return (data as Shop) ?? null
}

export async function fetchShopProducts(shopId: string): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("shop_id", shopId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
  return (data as Product[]) ?? []
}

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  const { data } = await supabase
    .from("product_reviews")
    .select("*, profile:profiles(full_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
  return (data as ProductReview[]) ?? []
}

export async function fetchShops(): Promise<Shop[]> {
  const { data } = await supabase
    .from("shops")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false })
  return (data as Shop[]) ?? []
}
