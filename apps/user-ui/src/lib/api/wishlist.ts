import { supabase } from "@/lib/supabase"
import type { WishlistItem } from "@/lib/types"

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const { data } = await supabase
    .from("wishlists")
    .select("*, product:products(*, shop:shops(*))")
    .order("created_at", { ascending: false })
  return (data as WishlistItem[]) ?? []
}

export async function toggleWishlist(productId: string, isWishlisted: boolean): Promise<void> {
  if (isWishlisted) {
    await supabase
      .from("wishlists")
      .delete()
      .eq("product_id", productId)
  } else {
    await supabase
      .from("wishlists")
      .insert({ product_id: productId })
  }
}

export async function fetchWishlistProductIds(): Promise<Set<string>> {
  const { data } = await supabase
    .from("wishlists")
    .select("product_id")
  return new Set((data ?? []).map((d) => (d as { product_id: string }).product_id))
}
