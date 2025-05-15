"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingCart, ChevronLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import MenuItemCard from "@/components/menu-item-card"
import OrderStatusBadge from "@/components/order-status-badge"
import { useCart } from "@/context/cart-context"
import { useOrders } from "@/context/order-context"
import { menuItems, getCategories } from "@/data/menu-items"

export default function MenuPage() {
  const { getTotalItems } = useCart()
  const { orders, loading } = useOrders()
  const [activeCategory, setActiveCategory] = useState("")
  const categories = getCategories()
  const categoryRefs = useRef({})

  // Set the first category as active on initial load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0])
    }
  }, [categories, activeCategory])

  // Filter table 3 orders
  const tableOrders = orders.filter((order) => order.tableId === 3)

  const scrollToCategory = (category) => {
    setActiveCategory(category)
    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className="mobile-container pb-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">McDonald's - Table 3</h1>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Clock className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Your Orders</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : tableOrders.length > 0 ? (
                  tableOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Order #{order.id}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <ul className="space-y-1 text-sm">
                        {order.items.map((item, index) => (
                          <li key={`${item.itemId}-${index}`} className="flex flex-col mb-1">
                            <div className="flex justify-between">
                              <span>
                                {item.quantity} × {item.name}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {item.removedIngredients && item.removedIngredients.length > 0 && (
                              <div className="text-xs text-red-500 ml-5">No: {item.removedIngredients.join(", ")}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No orders yet</div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/cart">
            <Button className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="category-nav overflow-x-auto whitespace-nowrap py-2 sticky top-0 bg-background z-10">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "ghost"}
            className="mr-2"
            onClick={() => scrollToCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mt-4 space-y-8">
        {categories.map((category) => (
          <div key={category} ref={(el) => (categoryRefs.current[category] = el)} id={category}>
            <h2 className="text-xl font-bold mb-3">{category}</h2>
            <div className="space-y-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
            <Separator className="mt-6" />
          </div>
        ))}
      </div>
    </div>
  )
}
