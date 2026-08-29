import { useState } from "react"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer style={{ background: "var(--white)", borderTop: "1px solid var(--cultured)", marginTop: 60 }}>
      <div className="container" style={{ padding: "40px 15px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 30 }}>
          <div>
            <h3 style={{ fontSize: "var(--fs-5)", fontWeight: 700, marginBottom: 12 }}>
              e<span style={{ color: "var(--salmon-pink)" }}>Shop</span> Lanka
            </h3>
            <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)", marginBottom: 16, maxWidth: 300 }}>
              Your one-stop marketplace for Sri Lankan products. Shop from local vendors across the island.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>
                <Phone size={16} /> +94 11 234 5678
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>
                <Mail size={16} /> hello@eshop.lk
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>
                <MapPin size={16} /> Colombo, Sri Lanka
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "var(--fs-7)", fontWeight: 600, marginBottom: 12 }}>Shop</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a href="/products" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>All Products</a></li>
              <li><a href="/products?category=electronics" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Electronics</a></li>
              <li><a href="/products?category=fashion" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Fashion</a></li>
              <li><a href="/products?category=crafts" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Crafts</a></li>
              <li><a href="/products?category=groceries" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Groceries</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "var(--fs-7)", fontWeight: 600, marginBottom: 12 }}>Account</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a href="/account" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>My Account</a></li>
              <li><a href="/account/orders" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>My Orders</a></li>
              <li><a href="/account/wishlist" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Wishlist</a></li>
              <li><a href="/account/addresses" style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>Addresses</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "var(--fs-7)", fontWeight: 600, marginBottom: 12 }}>Newsletter</h4>
            <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)", marginBottom: 12 }}>
              Subscribe for deals and new arrivals
            </p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                style={{ fontSize: "var(--fs-8)", padding: "8px 12px" }}
                required
              />
              <button type="submit" className="btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--cultured)", marginTop: 30, paddingTop: 20, textAlign: "center" }}>
          <p style={{ fontSize: "var(--fs-9)", color: "var(--spanish-gray)" }}>
            © {new Date().getFullYear()} eShop Lanka. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 2fr 1fr 1fr 1.5fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
