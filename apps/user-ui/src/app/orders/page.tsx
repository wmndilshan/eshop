'use client';

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchOrders } from "@/lib/api/orders"
import { formatLKR, type Order } from "@/lib/types"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

const STATUS_COLORS: Record<string, string> = {
  pending: "badge-accent",
  paid: "badge-dark",
  shipped: "badge-dark",
  delivered: "badge-success",
  cancelled: "badge-alert",
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?returnUrl=/orders")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders().then(setOrders).finally(() => setLoading(false))
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
          <h1 className="section-title">My Orders</h1>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Package size={48} style={{ margin: "0 auto 16px", color: "var(--cultured)" }} />
              <p style={{ fontSize: "var(--fs-6)", color: "var(--sonic-silver)", marginBottom: 16 }}>No orders yet</p>
              <Link href="/products" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="card"
                  style={{ padding: 16, display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}
                >
                  <Package size={24} color="var(--salmon-pink)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--fs-8)", marginBottom: 4 }}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>
                      {order.shop?.name} • {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: "var(--fs-7)", color: "var(--salmon-pink)" }}>{formatLKR(order.total)}</div>
                    <span className={`badge ${STATUS_COLORS[order.status] ?? "badge-outline"}`} style={{ marginTop: 4 }}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronRight size={18} color="var(--spanish-gray)" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
