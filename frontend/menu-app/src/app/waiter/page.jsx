"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderCard from "@/components/order-card"
import { useOrders } from "@/context/order-context"

export default function WaiterPage() {
  const { orders, updateOrderStatus, loading } = useOrders()
  const [refreshing, setRefreshing] = useState(false)

  // Filter ready orders
  const readyOrders = orders.filter((order) => order.status === "ready")

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    // Force a reload of the page to get fresh data
    window.location.reload()
  }

  return (
    <div className="mobile-container pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Waiter Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <h2 className="text-lg font-medium mb-4">Ready for Delivery</h2>

      {loading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : readyOrders.length > 0 ? (
        <div className="space-y-4">
          {readyOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={updateOrderStatus}
              availableActions={["delivered"]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No orders ready for delivery</h2>
          <p className="text-muted-foreground">Ready orders will appear here</p>
        </div>
      )}
    </div>
  )
}
