import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import type { CartItem, Product } from "@/lib/types"

interface CartContextValue {
  items: CartItem[]
  loading: boolean
  cartCount: number
  cartTotal: number
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const GUEST_CART_KEY = "anon_guest_cart"

interface GuestItem {
  product_id: string
  quantity: number
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadCart = useCallback(async () => {
    if (user) {
      setLoading(true)
      const { data } = await supabase
        .from("cart_items")
        .select("*, product:products(*, shop:shops(*))")
        .eq("user_id", user.id)
      setItems((data as CartItem[]) ?? [])
      setLoading(false)
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestItem[] = stored ? JSON.parse(stored) : []
      if (guestItems.length > 0) {
        setLoading(true)
        const productIds = guestItems.map((g) => g.product_id)
        const { data: products } = await supabase
          .from("products")
          .select("*, shop:shops(*)")
          .in("id", productIds)
          .eq("status", "active")
        const productMap = new Map<string, Product>(
          (products as Product[] | null)?.map((p) => [p.id, p]) ?? []
        )
        const cartItems: CartItem[] = guestItems
          .map((g): CartItem | null => {
            const product = productMap.get(g.product_id)
            if (!product) return null
            return {
              id: g.product_id,
              user_id: "",
              product_id: g.product_id,
              quantity: g.quantity,
              created_at: "",
              product,
            }
          })
          .filter((x): x is CartItem => x !== null)
        setItems(cartItems)
        setLoading(false)
      } else {
        setItems([])
      }
    }
  }, [user])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  async function mergeGuestCart() {
    const stored = localStorage.getItem(GUEST_CART_KEY)
    if (!stored || !user) return
    const guestItems: GuestItem[] = JSON.parse(stored)
    for (const g of guestItems) {
      await supabase
        .from("cart_items")
        .upsert(
          { user_id: user.id, product_id: g.product_id, quantity: g.quantity },
          { onConflict: "user_id,product_id" }
        )
    }
    localStorage.removeItem(GUEST_CART_KEY)
  }

  useEffect(() => {
    if (user) {
      mergeGuestCart().then(() => loadCart())
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function addToCart(productId: string, quantity = 1) {
    if (user) {
      const existing = items.find((i) => i.product_id === productId)
      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id)
      } else {
        await supabase
          .from("cart_items")
          .insert({ user_id: user.id, product_id: productId, quantity })
      }
      await loadCart()
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestItem[] = stored ? JSON.parse(stored) : []
      const existing = guestItems.find((g) => g.product_id === productId)
      if (existing) {
        existing.quantity += quantity
      } else {
        guestItems.push({ product_id: productId, quantity })
      }
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems))
      await loadCart()
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return
    if (user) {
      await supabase.from("cart_items").update({ quantity }).eq("id", itemId)
      await loadCart()
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestItem[] = stored ? JSON.parse(stored) : []
      const item = guestItems.find((g) => g.product_id === itemId)
      if (item) {
        item.quantity = quantity
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems))
        await loadCart()
      }
    }
  }

  async function removeFromCart(itemId: string) {
    if (user) {
      await supabase.from("cart_items").delete().eq("id", itemId)
      await loadCart()
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestItem[] = stored ? JSON.parse(stored) : []
      const filtered = guestItems.filter((g) => g.product_id !== itemId)
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(filtered))
      await loadCart()
    }
  }

  async function clearCart() {
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id)
    } else {
      localStorage.removeItem(GUEST_CART_KEY)
    }
    setItems([])
  }

  async function refreshCart() {
    await loadCart()
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = items.reduce(
    (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
