'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Package, Heart, MapPin, LogOut, ShoppingBag } from "lucide-react"
import Header from "@/app/shared/widgets/header"
import Footer from "@/app/shared/widgets/footer"

export default function AccountPage() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?returnUrl=/account")
    }
  }, [user, loading, router])

  if (loading) {
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

  const tiles = [
    { to: "/orders", icon: Package, label: "My Orders", sub: "Track and manage orders" },
    { to: "/wishlist", icon: Heart, label: "Wishlist", sub: "Saved products" },
    { to: "/addresses", icon: MapPin, label: "Addresses", sub: "Manage shipping addresses" },
    { to: "/products", icon: ShoppingBag, label: "Continue Shopping", sub: "Browse products" },
  ]

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: "30px 15px 60px" }}>
          <h1 className="section-title">My Account</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--salmon-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--white)", fontWeight: 700, fontSize: "var(--fs-4)" }}>
              {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: "var(--fs-5)", fontWeight: 700 }}>{profile?.full_name || "User"}</h2>
              <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>{user.email}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {tiles.map((tile) => (
              <Link key={tile.to} href={tile.to} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
                <tile.icon size={28} color="var(--salmon-pink)" />
                <div>
                  <h3 style={{ fontSize: "var(--fs-7)", fontWeight: 600 }}>{tile.label}</h3>
                  <p style={{ fontSize: "var(--fs-9)", color: "var(--sonic-silver)" }}>{tile.sub}</p>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={signOut}
            className="btn-outline"
            style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, color: "var(--bittersweet)", borderColor: "var(--bittersweet)" }}
          >
            <LogOut size={16} /> Logout
          </button>
          <style>{`@media (min-width: 768px) { .container > div:nth-child(2):has(.card) { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
        </div>
      </main>
      <Footer />
    </div>
  )
}
