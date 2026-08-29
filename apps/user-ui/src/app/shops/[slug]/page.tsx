'use client';

import { useEffect, useState } from "react"
import Link from "next/link"
import { Store, Star, Heart, ChevronRight } from "lucide-react"
import { fetchShopById, fetchShopProducts } from "@/lib/api/catalog"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { ProductCard } from "@/components/product-card"
import type { Shop, Product } from "@/lib/types"
import toast from "react-hot-toast"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function ShopDetailPage({ params }: { params: { slug: string } }) {
  const id = params.slug
  const { user } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([fetchShopById(id), fetchShopProducts(id)]).then(([s, p]) => {
      setShop(s)
      setProducts(p)
    }).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (user && id) {
      supabase
        .from("shop_follows")
        .select("id")
        .eq("user_id", user.id)
        .eq("shop_id", id)
        .maybeSingle()
        .then(({ data }) => setFollowing(!!data))
    }
  }, [user, id])

  async function handleFollow() {
    if (!user || !shop) {
      toast.error("Please log in to follow shops")
      return
    }
    if (following) {
      await supabase.from("shop_follows").delete().eq("user_id", user.id).eq("shop_id", shop.id)
      setFollowing(false)
      toast.success("Unfollowed")
    } else {
      await supabase.from("shop_follows").insert({ user_id: user.id, shop_id: shop.id })
      setFollowing(true)
      toast.success("Following shop")
    }
  }

  const pageContent = () => {
    if (loading) {
      return (
        <div className="container" style={{ padding: "30px 15px" }}>
          <div className="skeleton" style={{ height: 150, borderRadius: "var(--radius-md)", marginBottom: 20 }} />
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 300, borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        </div>
      )
    }

    if (!shop) {
      return (
        <div className="container" style={{ padding: 60, textAlign: "center" }}>
          <h1 style={{ fontSize: "var(--fs-3)", marginBottom: 12 }}>Shop not found</h1>
          <Link href="/shops" className="btn-primary">Browse Shops</Link>
        </div>
      )
    }

    return (
      <div className="container" style={{ padding: "20px 15px 60px" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-9)", color: "var(--sonic-silver)", marginBottom: 20 }}>
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shops">Shops</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--eerie-black)" }}>{shop.name}</span>
        </nav>

        {/* Shop header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", marginBottom: 30, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--cultured)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Store size={28} color="var(--sonic-silver)" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: "var(--fs-3)", fontWeight: 700 }}>{shop.name}</h1>
            <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)", marginBottom: 8 }}>{shop.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} fill="var(--sandy-brown)" color="var(--sandy-brown)" />
                <span style={{ fontSize: "var(--fs-8)", fontWeight: 600 }}>{shop.rating}</span>
                <span style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>({shop.rating_count})</span>
              </div>
              <span className="badge badge-outline" style={{ textTransform: "capitalize" }}>{shop.category}</span>
              <span style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>{products.length} products</span>
            </div>
          </div>
          <button onClick={handleFollow} className={following ? "btn-outline btn-sm" : "btn-primary btn-sm"} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Heart size={14} fill={following ? "var(--salmon-pink)" : "none"} color={following ? "var(--salmon-pink)" : "var(--white)"} />
            {following ? "Following" : "Follow"}
          </button>
        </div>

        {/* Products */}
        <h2 className="section-title">Products</h2>
        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--sonic-silver)", padding: 40 }}>No products in this shop yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        {pageContent()}
      </main>
      <Footer />
    </div>
  )
}
