'use client';

import { useEffect, useState } from "react"
import Link from "next/link"
import { Store, Star } from "lucide-react"
import { fetchShops } from "@/lib/api/catalog"
import type { Shop } from "@/lib/types"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShops().then(setShops).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: "30px 15px 60px" }}>
          <h1 className="section-title">All Shops</h1>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 120, borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
          ) : shops.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--sonic-silver)", padding: 40 }}>No shops available yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {shops.map((shop) => (
                <Link key={shop.id} href={`/shops/${shop.id}`} className="card" style={{ padding: 20, display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--cultured)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Store size={22} color="var(--sonic-silver)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "var(--fs-7)", fontWeight: 600 }}>{shop.name}</h3>
                      <span style={{ fontSize: "var(--fs-10)", color: "var(--sonic-silver)", textTransform: "capitalize" }}>{shop.category}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {shop.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                    <Star size={14} fill="var(--sandy-brown)" color="var(--sandy-brown)" />
                    <span style={{ fontSize: "var(--fs-9)", fontWeight: 600 }}>{shop.rating}</span>
                    <span style={{ fontSize: "var(--fs-10)", color: "var(--sonic-silver)" }}>({shop.rating_count} reviews)</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <style>{`@media (min-width: 768px) { .container > div:nth-child(2) { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
        </div>
      </main>
      <Footer />
    </div>
  )
}
