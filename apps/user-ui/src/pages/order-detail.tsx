import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchOrderById, cancelOrder } from "@/lib/api/orders"
import { formatLKR, type Order } from "@/lib/types"
import toast from "react-hot-toast"

export function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const orderId = Array.isArray(id) ? id[0] : id

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId).then(setOrder).finally(() => setLoading(false))
    }
  }, [orderId])

  async function handleCancel() {
    if (!order) return
    await cancelOrder(order.id)
    toast.success("Order cancelled")
    setOrder({ ...order, status: "cancelled" })
  }

  if (authLoading) return <div className="container" style={{ padding: 30 }}><p className="text-muted">Loading...</p></div>
  if (!user) {
    router.push("/login")
    return null
  }

  if (loading) {
    return <div className="container" style={{ padding: 30 }}><p className="text-muted">Loading order...</p></div>
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: 60, textAlign: "center" }}>
        <p style={{ marginBottom: 16 }}>Order not found</p>
        <Link href="/account/orders" className="btn-primary">Back to Orders</Link>
      </div>
    )
  }

  const addr = order.address_snapshot as Record<string, string> | null

  return (
    <div className="container" style={{ padding: "20px 15px 60px" }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-9)", color: "var(--sonic-silver)", marginBottom: 20 }}>
        <Link href="/account">Account</Link>
        <ChevronRight size={12} />
        <Link href="/account/orders">Orders</Link>
        <ChevronRight size={12} />
        <span style={{ color: "var(--eerie-black)" }}>#{order.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--fs-3)", fontWeight: 700 }}>Order Details</h1>
          <p style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>
            Placed on {new Date(order.created_at).toLocaleDateString("en-LK", { dateStyle: "medium" })}
          </p>
        </div>
        <span className={`badge ${order.status === "delivered" ? "badge-success" : order.status === "cancelled" ? "badge-alert" : "badge-accent"}`} style={{ fontSize: "var(--fs-9)" }}>
          {order.status}
        </span>
      </div>

      {order.shop && (
        <div style={{ padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
          <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)", marginBottom: 4 }}>Shop</div>
          <Link href={`/shops/${order.shop.id}`} style={{ fontWeight: 600 }}>{order.shop.name}</Link>
        </div>
      )}

      {addr && (
        <div style={{ padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
          <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)", marginBottom: 4 }}>Shipping Address</div>
          <div style={{ fontSize: "var(--fs-8)" }}>{addr.recipient_name}</div>
          <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>{addr.line1}, {addr.city}</div>
          <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>{addr.phone}</div>
        </div>
      )}

      {/* Items */}
      <h3 style={{ fontSize: "var(--fs-6)", fontWeight: 600, marginBottom: 12 }}>Items</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {(order.items ?? []).map((item) => (
          <div key={item.id} style={{ display: "flex", gap: 12, padding: 12, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--cultured)", flexShrink: 0 }}>
              {item.product_image && <img src={item.product_image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "var(--fs-8)" }}>{item.product_name}</div>
              <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>Qty: {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: "var(--fs-8)", color: "var(--salmon-pink)" }}>
              {formatLKR(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Subtotal</span>
          <span style={{ fontWeight: 600 }}>{formatLKR(order.total - order.shipping_total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Shipping</span>
          <span style={{ fontWeight: 600 }}>{formatLKR(order.shipping_total)}</span>
        </div>
        <div style={{ borderTop: "1px solid var(--cultured)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: "var(--fs-6)" }}>Total</span>
          <span style={{ fontWeight: 700, fontSize: "var(--fs-5)", color: "var(--salmon-pink)" }}>{formatLKR(order.total)}</span>
        </div>
      </div>

      {order.status === "pending" && (
        <button onClick={handleCancel} className="btn-outline" style={{ marginTop: 16, color: "var(--bittersweet)", borderColor: "var(--bittersweet)" }}>
          Cancel Order
        </button>
      )}
    </div>
  )
}
