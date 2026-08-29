import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Package, Heart, MapPin, LogOut, ShoppingBag } from "lucide-react"

export function AccountPage() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="container" style={{ padding: 30 }}><p className="text-muted">Loading...</p></div>
  }

  if (!user) {
    router.push("/login?returnUrl=/account")
    return null
  }

  const tiles = [
    { href: "/account/orders", icon: Package, label: "My Orders", sub: "Track and manage orders" },
    { href: "/account/wishlist", icon: Heart, label: "Wishlist", sub: "Saved products" },
    { href: "/account/addresses", icon: MapPin, label: "Addresses", sub: "Manage shipping addresses" },
    { href: "/products", icon: ShoppingBag, label: "Continue Shopping", sub: "Browse products" },
  ]

  return (
    <div className="container" style={{ padding: 30 }}>
      <h1 style={{ fontSize: "var(--fs-2)", fontWeight: 700, marginBottom: 24 }}>My Account</h1>
      <div className="card" style={{ padding: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--eerie-black)", color: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--fs-3)", fontWeight: 700 }}>
          {profile?.full_name?.charAt(0).toUpperCase() || (user.email?.charAt(0).toUpperCase() || "U")}
        </div>
        <div>
          <h2 style={{ fontSize: "var(--fs-6)", fontWeight: 600 }}>{profile?.full_name || "User"}</h2>
          <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>{user.email || ""}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
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
  )
}
