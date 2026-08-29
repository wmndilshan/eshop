'use client';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { placeOrder } from "@/lib/api/orders"
import { formatLKR, type Address } from "@/lib/types"
import toast from "react-hot-toast"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: "Home", recipient_name: "", line1: "", city: "", phone: "" })

  useEffect(() => {
    if (!user) {
      router.push("/login?returnUrl=/checkout")
      return
    }
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        const addrs = (data as Address[]) ?? []
        setAddresses(addrs)
        if (addrs.length > 0) setSelectedAddressId(addrs[0].id)
        setLoading(false)
      })
  }, [user, router])

  async function handlePlaceOrder() {
    if (!user || items.length === 0) return
    if (!selectedAddressId && !showNewAddress) {
      toast.error("Please select or add an address")
      return
    }
    if (showNewAddress && (!newAddr.recipient_name || !newAddr.line1 || !newAddr.city || !newAddr.phone)) {
      toast.error("Please fill in all address fields")
      return
    }

    setPlacing(true)
    try {
      let addressId = selectedAddressId
      if (showNewAddress) {
        const { data, error } = await supabase
          .from("addresses")
          .insert({ ...newAddr, user_id: user.id })
          .select("*")
          .single()
        if (error || !data) throw new Error("Failed to create address")
        addressId = (data as Address).id
      }

      const shopId = items[0]?.product?.shop_id
      if (!shopId) throw new Error("No shop found for items")

      const order = await placeOrder({
        items: items.map((i) => ({
          product: {
            id: i.product_id,
            name: i.product?.name ?? "",
            images: i.product?.images ?? [],
            price: i.product?.price ?? 0,
          },
          quantity: i.quantity,
        })),
        shopId,
        addressId,
        shippingTotal: 250,
      })

      await clearCart()
      toast.success("Order placed successfully!")
      router.push(`/account/orders/${order?.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <div className="container" style={{ padding: 30 }}><p className="text-muted">Loading checkout...</p></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <div className="container" style={{ padding: 60, textAlign: "center" }}>
            <p style={{ fontSize: "var(--fs-5)", marginBottom: 16 }}>Your cart is empty</p>
            <Link href="/products" className="btn-primary">Start Shopping</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const shippingTotal = 250
  const grandTotal = cartTotal + shippingTotal

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: "30px 15px 60px" }}>
          <h1 className="section-title">Checkout</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {/* Address section */}
            <div>
              <h3 style={{ fontSize: "var(--fs-6)", fontWeight: 600, marginBottom: 16 }}>Shipping Address</h3>
              {addresses.length > 0 && !showNewAddress && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: 16,
                        border: selectedAddressId === addr.id ? "2px solid var(--salmon-pink)" : "1px solid var(--cultured)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        alignItems: "flex-start",
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: 4, accentColor: "var(--salmon-pink)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "var(--fs-8)" }}>{addr.recipient_name} <span className="badge badge-outline" style={{ marginLeft: 4 }}>{addr.label}</span></div>
                        <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>{addr.line1}, {addr.city}</div>
                        <div style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>{addr.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showNewAddress ? (
                <div style={{ padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
                  <h4 style={{ fontSize: "var(--fs-7)", fontWeight: 600, marginBottom: 12 }}>New Address</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="field-label">Label</label>
                      <input className="field" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Recipient Name</label>
                      <input className="field" value={newAddr.recipient_name} onChange={(e) => setNewAddr({ ...newAddr, recipient_name: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label className="field-label">Address Line</label>
                      <input className="field" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">City</label>
                      <input className="field" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Phone</label>
                      <input className="field" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => setShowNewAddress(false)} className="btn-outline btn-sm">Cancel</button>
                    {addresses.length > 0 && (
                      <button onClick={() => setShowNewAddress(false)} className="btn-primary btn-sm">Use This Address</button>
                    )}
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowNewAddress(true)} className="btn-outline btn-sm">
                  + Add New Address
                </button>
              )}

              {/* Payment info */}
              <div style={{ marginTop: 24, padding: 16, background: "var(--cultured)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>
                  <CheckCircle2 size={18} color="var(--ocean-green)" />
                  Cash on Delivery available. Pay when you receive your order.
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", height: "fit-content" }}>
              <h3 style={{ fontSize: "var(--fs-6)", fontWeight: 600, marginBottom: 16 }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 10, fontSize: "var(--fs-9)" }}>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product?.name}</span>
                    <span style={{ color: "var(--sonic-silver)" }}>×{item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{formatLKR((item.product?.price ?? 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
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
              <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary btn-block" style={{ marginTop: 16 }}>
                {placing ? "Placing Order..." : "Place Order"} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <style>{`
            @media (min-width: 768px) {
              .container > div:has(.section-title) > div:last-child {
                grid-template-columns: 1fr 320px !important;
                align-items: start;
              }
            }
          `}</style>
        </div>
      </main>
      <Footer />
    </div>
  )
}
