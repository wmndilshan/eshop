'use client';

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ShoppingBag, ChevronRight, Store } from "lucide-react"
import { fetchProductById, fetchRelatedProducts, fetchProductReviews } from "@/lib/api/catalog"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { formatLKR, type Product, type ProductReview } from "@/lib/types"
import { StarRating } from "@/components/star-rating"
import { ProductCard } from "@/components/product-card"
import toast from "react-hot-toast"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  const router = useRouter()
  const { addToCart } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      fetchProductById(id),
      fetchRelatedProducts(id, "active", 4),
      fetchProductReviews(id),
    ]).then(([p, r, rev]) => {
      setProduct(p)
      if (p) setRelated(r)
      setReviews(rev)
    }).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts(product.id, product.category, 4).then(setRelated)
    }
  }, [product])

  async function handleAdd() {
    if (!product) return
    if (product.stock === 0) {
      toast.error("Out of stock")
      return
    }
    setAdding(true)
    await addToCart(product.id, qty)
    setAdding(false)
    toast.success("Added to bag")
  }

  async function handleBuyNow() {
    if (!product) return
    await addToCart(product.id, qty)
    router.push("/cart")
  }

  function handleWishlist() {
    if (!product || !user) {
      toast.error("Please log in to use wishlist")
      return
    }
    toggle(product.id, isWishlisted(product.id))
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!product || !user) return
    setSubmittingReview(true)
    const { error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: product.id,
        user_id: user.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      })
    setSubmittingReview(false)
    if (error) {
      if (error.code === "23505") {
        toast.error("You already reviewed this product")
      } else {
        toast.error("Failed to submit review")
      }
      return
    }
    toast.success("Review submitted")
    setReviewForm({ rating: 5, comment: "" })
    fetchProductReviews(product.id).then(setReviews)
  }

  const pageContent = () => {
    if (loading) {
      return (
        <div className="container" style={{ padding: "30px 15px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <div className="skeleton" style={{ height: 300, borderRadius: "var(--radius-md)" }} />
            <div className="skeleton" style={{ height: 40, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 120, borderRadius: "var(--radius-sm)" }} />
          </div>
        </div>
      )
    }

    if (!product) {
      return (
        <div className="container" style={{ padding: "60px 15px", textAlign: "center" }}>
          <h1 style={{ fontSize: "var(--fs-3)", marginBottom: 12 }}>Product not found</h1>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      )
    }

    const wished = isWishlisted(product.id)
    const discount = product.original_price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

    return (
      <div className="container" style={{ padding: "20px 15px 60px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-9)", color: "var(--sonic-silver)", marginBottom: 20, flexWrap: "wrap" }}>
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products">Products</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--eerie-black)" }}>{product.name}</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 30 }}>
          {/* Gallery */}
          <div>
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--cultured)", marginBottom: 12, background: "var(--cultured)" }}>
              <img
                src={product.images[activeImage] ?? product.images[0]}
                alt={product.name}
                style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
              />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: i === activeImage ? "2px solid var(--salmon-pink)" : "1px solid var(--cultured)",
                      flexShrink: 0,
                      background: "var(--cultured)",
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.shop && (
              <Link href={`/shops/${product.shop.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--fs-8)", color: "var(--sonic-silver)", marginBottom: 8 }}>
                <Store size={14} /> {product.shop.name}
              </Link>
            )}
            <h1 style={{ fontSize: "var(--fs-2)", fontWeight: 700, marginBottom: 12 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <StarRating rating={product.rating} />
              <span style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>
                {product.rating} ({product.rating_count} reviews)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: "var(--fs-2)", fontWeight: 700, color: "var(--salmon-pink)" }}>
                {formatLKR(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-strike" style={{ fontSize: "var(--fs-6)" }}>{formatLKR(product.original_price)}</span>
                  <span className="badge badge-accent">-{discount}%</span>
                </>
              )}
            </div>
            <p style={{ fontSize: "var(--fs-7)", color: "var(--davys-gray)", lineHeight: 1.7, marginBottom: 20 }}>
              {product.description}
            </p>
            <div style={{ marginBottom: 20 }}>
              {product.stock > 0 ? (
                <span className="badge badge-success">In Stock ({product.stock} available)</span>
              ) : (
                <span className="badge badge-alert">Out of Stock</span>
              )}
            </div>

            {/* Quantity + Actions */}
            {product.stock > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "var(--fs-8)", fontWeight: 500 }}>Qty:</span>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ width: 32, height: 32, border: "1px solid var(--cultured)", borderRadius: "var(--radius-sm)", background: "var(--white)", fontSize: "var(--fs-7)" }}
                  >−</button>
                  <span style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    style={{ width: 32, height: 32, border: "1px solid var(--cultured)", borderRadius: "var(--radius-sm)", background: "var(--white)", fontSize: "var(--fs-7)" }}
                  >+</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={handleAdd} disabled={adding || product.stock === 0} className="btn-primary" style={{ minWidth: 140 }}>
                <ShoppingBag size={16} /> {adding ? "Adding..." : "Add to Bag"}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn-accent" style={{ minWidth: 120 }}>
                Buy Now
              </button>
              <button onClick={handleWishlist} className="btn-outline" style={{ padding: "10px 14px" }}>
                <Heart size={18} fill={wished ? "var(--salmon-pink)" : "none"} color={wished ? "var(--salmon-pink)" : "var(--eerie-black)"} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section style={{ marginTop: 40 }}>
          <h2 className="section-title">Reviews ({reviews.length})</h2>
          {user && (
            <form onSubmit={submitReview} style={{ marginBottom: 24, padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)" }}>
              <h3 style={{ fontSize: "var(--fs-7)", fontWeight: 600, marginBottom: 12 }}>Write a Review</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <label style={{ fontSize: "var(--fs-8)", fontWeight: 500 }}>Rating:</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value, 10) })}
                  className="field"
                  style={{ width: "auto" }}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} stars</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="field"
                style={{ minHeight: 80, marginBottom: 12 }}
              />
              <button type="submit" disabled={submittingReview} className="btn-primary btn-sm">
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
          {!user && (
            <div style={{ marginBottom: 24, padding: 16, background: "var(--cultured)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
              <Link href="/login" style={{ color: "var(--salmon-pink)", fontWeight: 500 }}>Log in</Link> to write a review
            </div>
          )}
          {reviews.length === 0 ? (
            <p style={{ color: "var(--sonic-silver)", fontSize: "var(--fs-8)" }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{ padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: "var(--fs-8)" }}>
                      {rev.profile?.full_name || "Anonymous"}
                    </span>
                    <StarRating rating={rev.rating} size="var(--fs-9)" />
                  </div>
                  <p style={{ fontSize: "var(--fs-8)", color: "var(--davys-gray)" }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 className="section-title">Related Products</h2>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <style>{`
          @media (min-width: 768px) {
            .container > div:nth-child(2) > div:first-child {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
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
