'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { formatLKR } from "@/lib/types"
import toast from "react-hot-toast"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function CartPage() {
  const { items, loading, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  function handleCheckout() {
    if (!user) {
      toast.error("Please log in to checkout")
      router.push("/login?returnUrl=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  const shippingTotal = items.length > 0 ? 250 : 0
  const grandTotal = cartTotal + shippingTotal

  const pageContent = () => {
    if (loading) {
      return (
        <div className="container" style={{ padding: 30 }}>
          <p className="text-muted">Loading cart...</p>
        </div>
      )
    }

    return (
      <div className="container" style={{ padding: "30px 15px 60px" }}>
        <h1 className="section-title">Shopping Cart</h1>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <ShoppingBag size={56} style={{ margin: "0 auto 16px", color: "var(--cultured)" }} />
            <p style={{ fontSize: "var(--fs-6)", color: "var(--sonic-silver)", marginBottom: 20 }}>Your cart is empty</p>
            <Link href="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 16, padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", alignItems: "center" }}>
                  <Link href={`/products/${item.product_id}`} style={{ width: 80, height: 80, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--cultured)", flexShrink: 0 }}>
                    {item.product?.images[0] && (
                      <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${item.product_id}`} style={{ fontWeight: 600, fontSize: "var(--fs-7)", display: "block", marginBottom: 4 }}>
                      {item.product?.name}
                    </Link>
                    {item.product?.shop && (
                      <p style={{ fontSize: "var(--fs-10)", color: "var(--sonic-silver)" }}>{item.product.shop.name}</p>
                    )}
                    <p style={{ fontSize: "var(--fs-8)", color: "var(--salmon-pink)", fontWeight: 600, marginTop: 4 }}>
                      {formatLKR(item.product?.price ?? 0)}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, border: "1px solid var(--cultured)", borderRadius: "var(--radius-sm)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, border: "1px solid var(--cultured)", borderRadius: "var(--radius-sm)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <p style={{ fontWeight: 700, fontSize: "var(--fs-7)" }}>{formatLKR((item.product?.price ?? 0) * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "var(--bittersweet)", fontSize: "var(--fs-9)", display: "flex", alignItems: "center", gap: 4, marginTop: 4, marginLeft: "auto" }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="btn-outline btn-sm" style={{ alignSelf: "flex-start" }}>
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div style={{ padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", height: "fit-content" }}>
              <h3 style={{ fontSize: "var(--fs-6)", fontWeight: 600, marginBottom: 16 }}>Order Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Subtotal</span>
                <span style={{ fontSize: "var(--fs-8)", fontWeight: 600 }}>{formatLKR(cartTotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Shipping</span>
                <span style={{ fontSize: "var(--fs-8)", fontWeight: 600 }}>{formatLKR(shippingTotal)}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--cultured)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "var(--fs-6)", fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: "var(--fs-5)", fontWeight: 700, color: "var(--salmon-pink)" }}>{formatLKR(grandTotal)}</span>
              </div>
              <button onClick={handleCheckout} className="btn-primary btn-block" style={{ marginTop: 16 }}>
                Checkout <ArrowRight size={16} />
              </button>
              <Link href="/products" className="btn-outline btn-sm btn-block" style={{ marginTop: 8 }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        <style>{`
          @media (min-width: 768px) {
            .container > div:last-child > div:has(.section-title) + div {
              grid-template-columns: 1fr 320px !important;
              align-items: start;
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
