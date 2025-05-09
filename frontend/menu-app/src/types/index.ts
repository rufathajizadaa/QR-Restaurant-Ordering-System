export interface MenuItem {
  id: number
  name: string
  description: string
  category: string
  price: number
  image: string
}

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered"

export interface OrderItem {
  itemId: number
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  tableId: number
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
  total: number
}
