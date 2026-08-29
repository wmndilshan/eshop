import { supabase } from "@/lib/supabase"
import type { Order } from "@/lib/types"

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await supabase
    .from("orders")
    .select("*, shop:shops(*), items:order_items(*)")
    .order("created_at", { ascending: false })
  return (data as Order[]) ?? []
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data } = await supabase
    .from("orders")
    .select("*, shop:shops(*), items:order_items(*)")
    .eq("id", id)
    .maybeSingle()
  return (data as Order) ?? null
}

export async function cancelOrder(orderId: string): Promise<void> {
  await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
}

export interface CheckoutPayload {
  items: { product: { id: string; name: string; images: string[]; price: number }; quantity: number }[]
  shopId: string
  addressId?: string
  address?: {
    recipient_name: string
    line1: string
    line2?: string
    city: string
    district?: string
    postal_code?: string
    phone: string
  }
  shippingTotal?: number
}

export async function placeOrder(payload: CheckoutPayload): Promise<Order | null> {
  const total = payload.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const shippingTotal = payload.shippingTotal ?? 250

  let addressSnapshot: Record<string, unknown> = {}
  if (payload.addressId) {
    const { data: addr } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", payload.addressId)
      .maybeSingle()
    if (addr) {
      const a = addr as Record<string, unknown>
      addressSnapshot = {
        recipient_name: a.recipient_name,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        district: a.district,
        postal_code: a.postal_code,
        phone: a.phone,
      }
    }
  } else if (payload.address) {
    addressSnapshot = payload.address
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      shop_id: payload.shopId,
      total: total + shippingTotal,
      shipping_total: shippingTotal,
      address_snapshot: addressSnapshot,
      status: "pending",
    })
    .select("*")
    .single()

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to create order")
  }

  const orderData = order as Order
  const orderItems = payload.items.map((item) => ({
    order_id: orderData.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.images[0] ?? null,
    price: item.product.price,
    quantity: item.quantity,
  }))

  await supabase.from("order_items").insert(orderItems)

  for (const item of payload.items) {
    await supabase.rpc("decrement_stock", {
      product_id: item.product.id,
      qty: item.quantity,
    }).then(() => {})
  }

  return orderData
}
