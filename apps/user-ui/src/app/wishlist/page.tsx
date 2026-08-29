'use client';

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?returnUrl=/wishlist")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      supabase
        .from("wishlists")
        .select("product:products(*, shop:shops(*))")
        .eq("user_id", user.id)
        .then(({ data }) => {
          const items = (data ?? []) as unknown as { product: Product }[]
          setProducts(items.map((i) => i.product).filter(Boolean))
          setLoading(false)
        })
    }
  }, [user])

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <div className="container" style={{ padding: 30 }}><p className="text-muted">Loading...</p></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: "30px 15px 60px" }}>
          <h1 className="section-title">My Wishlist</h1>
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 300, borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Heart size={48} style={{ margin: "0 auto 16px", color: "var(--cultured)" }} />
              <p style={{ fontSize: "var(--fs-6)", color: "var(--sonic-silver)", marginBottom: 16 }}>Your wishlist is empty</p>
              <Link href="/products" className="btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
