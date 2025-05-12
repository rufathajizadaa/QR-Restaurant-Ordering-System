export interface MenuItem {
  id: number
  name: string
  description: string
  category: string
  price: number
  image: string
  ingredients?: string[]
}

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered"

export interface OrderItem {
  itemId: number
  name: string
  quantity: number
  price: number
  removedIngredients?: string[]
}

export interface Order {
  id: number
  tableId: number
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
  total: number
}
