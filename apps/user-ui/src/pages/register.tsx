import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") ?? "/"
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Account created! You're now logged in.")
    router.push(returnUrl)
  }

  return (
    <div style={{ width: "100%", maxWidth: 400, background: "var(--white)", borderRadius: "var(--radius-md)", border: "1px solid var(--cultured)", padding: 30 }}>
      <h1 style={{ fontSize: "var(--fs-3)", fontWeight: 700, marginBottom: 6, textAlign: "center" }}>Create Account</h1>
      <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)", textAlign: "center", marginBottom: 24 }}>
        Join the marketplace
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label className="field-label">Full Name</label>
          <div style={{ position: "relative" }}>
            <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--spanish-gray)" }} />
            <input type="text" className="field" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ paddingLeft: 38 }} required />
          </div>
        </div>
        <div>
          <label className="field-label">Email</label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--spanish-gray)" }} />
            <input type="email" className="field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 38 }} required />
          </div>
        </div>
        <div>
          <label className="field-label">Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--spanish-gray)" }} />
            <input type={showPassword ? "text" : "password"} className="field" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 38, paddingRight: 38 }} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary btn-block">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p style={{ fontSize: "var(--fs-8)", color: "var(--sonic-silver)", textAlign: "center", marginTop: 16 }}>
        Already have an account? <Link href="/login" style={{ color: "var(--salmon-pink)", fontWeight: 500 }}>Log in</Link>
      </p>
    </div>
  )
}
