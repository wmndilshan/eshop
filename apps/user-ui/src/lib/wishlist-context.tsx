import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

interface WishlistContextValue {
  ids: Set<string>
  isWishlisted: (productId: string) => boolean
  toggle: (productId: string, current: boolean) => void
  loading: boolean
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) {
      setIds(new Set())
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)
    setIds(new Set((data ?? []).map((d) => (d as { product_id: string }).product_id)))
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids])

  const toggle = useCallback(
    (productId: string, current: boolean) => {
      if (!user) return
      if (current) {
        supabase.from("wishlists").delete().eq("product_id", productId).eq("user_id", user.id)
        setIds((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      } else {
        supabase.from("wishlists").insert({ product_id: productId, user_id: user.id })
        setIds((prev) => new Set(prev).add(productId))
      }
    },
    [user]
  )

  return (
    <WishlistContext.Provider value={{ ids, isWishlisted, toggle, loading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
