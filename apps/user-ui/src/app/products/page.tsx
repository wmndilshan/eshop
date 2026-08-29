'use client';

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { fetchProducts } from "@/lib/api/catalog"
import { CATEGORY_LABELS } from "@/lib/types"
import type { Product } from "@/lib/types"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
]

const PAGE_SIZE = 12

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? "all"
  const sort = searchParams.get("sort") ?? "newest"
  const page = parseInt(searchParams.get("page") ?? "1", 10)

  useEffect(() => {
    setLoading(true)
    fetchProducts({ search, category, sort, page, limit: PAGE_SIZE })
      .then(({ products, total }) => {
        setProducts(products)
        setTotal(total)
      })
      .finally(() => setLoading(false))
  }, [search, category, sort, page])

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString())
    if (value && value !== "all" && value !== "newest" && value !== "1") {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== "page") next.delete("page")
    router.push('?' + next.toString())
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="container" style={{ padding: "30px 15px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--fs-3)", fontWeight: 700 }}>
            {search ? `Results for "${search}"` : category !== "all" ? CATEGORY_LABELS[category] ?? "Products" : "All Products"}
          </h1>
          <p style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)", marginTop: 4 }}>
            {total} product{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="field"
            style={{ width: "auto", padding: "8px 12px", fontSize: "var(--fs-8)" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ marginBottom: 24, padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--fs-8)", fontWeight: 600, marginBottom: 12 }}>Category</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => updateParam("category", "all")}
              className="btn-sm"
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                border: category === "all" ? "1px solid var(--salmon-pink)" : "1px solid var(--cultured)",
                background: category === "all" ? "var(--salmon-pink)" : "var(--white)",
                color: category === "all" ? "var(--white)" : "var(--eerie-black)",
                fontSize: "var(--fs-9)",
              }}
            >
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
              <button
                key={slug}
                onClick={() => updateParam("category", slug)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: category === slug ? "1px solid var(--salmon-pink)" : "1px solid var(--cultured)",
                  background: category === slug ? "var(--salmon-pink)" : "var(--white)",
                  color: category === slug ? "var(--white)" : "var(--eerie-black)",
                  fontSize: "var(--fs-9)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 300, borderRadius: "var(--radius-md)" }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--sonic-silver)" }}>
          <p style={{ fontSize: "var(--fs-5)", marginBottom: 8 }}>No products found</p>
          <p style={{ fontSize: "var(--fs-8)" }}>Try a different search or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 30 }}>
          {page > 1 && (
            <button onClick={() => updateParam("page", String(page - 1))} className="btn-outline btn-sm">
              Previous
            </button>
          )}
          <span style={{ padding: "8px 14px", fontSize: "var(--fs-8)", fontWeight: 500 }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <button onClick={() => updateParam("page", String(page + 1))} className="btn-outline btn-sm">
              Next
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div className="container" style={{ padding: 30 }}><p>Loading...</p></div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
