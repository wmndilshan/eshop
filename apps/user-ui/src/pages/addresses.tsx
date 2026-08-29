import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import type { Address } from "@/lib/types"
import toast from "react-hot-toast"

export function AddressesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: "Home", recipient_name: "", line1: "", line2: "", city: "", district: "", postal_code: "", phone: "" })

  useEffect(() => {
    if (user) {
      supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .then(({ data }) => {
          setAddresses((data as Address[]) ?? [])
          setLoading(false)
        })
    }
  }, [user])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...form, user_id: user.id })
      .select("*")
      .single()
    if (error) {
      toast.error("Failed to add address")
      return
    }
    setAddresses([...addresses, data as Address])
    setForm({ label: "Home", recipient_name: "", line1: "", line2: "", city: "", district: "", postal_code: "", phone: "" })
    setShowForm(false)
    toast.success("Address added")
  }

  async function handleDelete(id: string) {
    await supabase.from("addresses").delete().eq("id", id)
    setAddresses(addresses.filter((a) => a.id !== id))
    toast.success("Address removed")
  }

  async function handleSetDefault(id: string) {
    if (!user) return
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
    await supabase.from("addresses").update({ is_default: true }).eq("id", id)
    setAddresses(addresses.map((a) => ({ ...a, is_default: a.id === id })))
  }

  if (authLoading) return <div className="container" style={{ padding: 30 }}><p className="text-muted">Loading...</p></div>
  if (!user) {
    router.push("/login?returnUrl=/account/addresses")
    return null
  }

  return (
    <div className="container" style={{ padding: "30px 15px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ padding: 20, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="field-label">Label</label>
              <select className="field" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}>
                <option>Home</option><option>Work</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="field-label">Recipient Name</label>
              <input className="field" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="field-label">Address Line 1</label>
              <input className="field" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">City</label>
              <input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">District</label>
              <input className="field" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Postal Code</label>
              <input className="field" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn-primary btn-sm">Save Address</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <MapPin size={48} style={{ margin: "0 auto 16px", color: "var(--cultured)" }} />
          <p style={{ fontSize: "var(--fs-6)", color: "var(--sonic-silver)", marginBottom: 16 }}>No saved addresses</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Address</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {addresses.map((addr) => (
            <div key={addr.id} style={{ padding: 16, border: "1px solid var(--cultured)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: "var(--fs-7)" }}>{addr.recipient_name}</span>
                    <span className="badge badge-outline">{addr.label}</span>
                    {addr.is_default && <span className="badge badge-accent">Default</span>}
                  </div>
                  <div style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</div>
                  <div style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>{addr.city}{addr.district ? `, ${addr.district}` : ""}{addr.postal_code ? ` ${addr.postal_code}` : ""}</div>
                  <div style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)" }}>{addr.phone}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefault(addr.id)} className="btn-outline btn-sm">Set Default</button>
                  )}
                  <button onClick={() => handleDelete(addr.id)} style={{ background: "none", border: "none", color: "var(--bittersweet)" }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
