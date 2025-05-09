"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderCard from "@/components/order-card"
import { useOrders } from "@/context/order-context"

export default function KitchenPage() {
  const { orders, updateOrderStatus, loading } = useOrders()
  const [activeTab, setActiveTab] = useState("pending")
  const [refreshing, setRefreshing] = useState(false)

  // Filter orders by status
  const filteredOrders = orders.filter((order) => order.status === activeTab)

  // Define available actions for each status
  const statusActions = {
    pending: ["preparing"],
    preparing: ["ready"],
    ready: [],
    delivered: [],
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    // Force a reload of the page to get fresh data
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
          <TabsTrigger value="preparing">In Preparation</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          {loading ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  availableActions={statusActions[activeTab]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h2 className="text-xl font-medium mb-2">No pending orders</h2>
              <p className="text-muted-foreground">New orders will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preparing" className="mt-0">
          {loading ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  availableActions={statusActions[activeTab]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h2 className="text-xl font-medium mb-2">No orders in preparation</h2>
              <p className="text-muted-foreground">Orders being prepared will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
