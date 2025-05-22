"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import axios from "axios"
import { ShoppingCart, ChevronLeft, Clock, RefreshCw, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import MenuItemCard from "@/components/menu-item-card"
import OrderStatusBadge from "@/components/order-status-badge"
import { useCart } from "@/context/cart-context"
import { useOrders } from "@/context/order-context"
import { useParams } from "next/navigation"
import LoginDialog from "@/components/login-dialog"

export default function MenuPage() {
  // Use the useParams hook to get the tableId
  const params = useParams()
  const tableId = Number.parseInt(params.tableId, 10)

  const { getTotalItems } = useCart()
  const { orders, loading: ordersLoading, refreshOrders } = useOrders()
  const [activeCategory, setActiveCategory] = useState("")
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const categoryRefs = useRef({})

  // Fetch menu items from the API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        // Use the API route we'll create to avoid CORS issues
        const response = await axios.get("/api/menu")
        console.log("API response:", response.data)

        setMenuItems(response.data)

        // Extract unique categories from the fetched menu items
        const uniqueCategories = [...new Set(response.data.map((item) => item.category))]
        setCategories(uniqueCategories)

        // Set the first category as active if no active category is set
        if (!activeCategory && uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0])
        }

        setError(null)
      } catch (err) {
        console.error("Failed to fetch menu items:", err)
        setError("Failed to load menu items. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [activeCategory])

  // Filter active orders for the current table (exclude completed orders)
  const tableOrders = orders.filter((order) => order.tableId === tableId && order.status !== "completed")

  const scrollToCategory = (category) => {
    setActiveCategory(category)
    if (categoryRefs.current[category]) {
      setTimeout(() => {
        categoryRefs.current[category]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      }, 100)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshOrders()
    } catch (error) {
      console.error("Error refreshing orders:", error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="mobile-container pb-20">
      {/* Restaurant name centered at the top */}
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold">McDonald's</h1>
      </div>

      {/* Table ID and action buttons in a separate row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-lg font-medium">Table {tableId}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLoginOpen(true)}>
            <UserCircle className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-2">
                <Clock className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle>Your Orders</SheetTitle>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {ordersLoading ? (
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
                          <li key={`${item.id || item.itemId}-${index}`} className="flex flex-col mb-1">
                            <div className="flex justify-between">
                              <span>
                                {item.quantity} × {item.name}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {item.removedIngredients && item.removedIngredients.length > 0 && (
                              <div className="text-xs text-red-500 ml-5">
                                no {item.removedIngredients.join(", no ")}
                              </div>
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
          <Link href={`/cart/${tableId}`}>
            <Button className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {getTotalItems(tableId) > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {getTotalItems(tableId)}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Show loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading menu items...</p>
        </div>
      )}

      {/* Show error state */}
      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Show menu when loaded */}
      {!loading && !error && (
        <>
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
                      <MenuItemCard key={item.id} item={item} tableId={tableId} />
                    ))}
                </div>
                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}
