"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManagerOrderCard from "@/components/manager-order-card"
import { useOrders } from "@/context/order-context"

export default function ManagerPage() {
  const { orders, loading } = useOrders()
  const [refreshing, setRefreshing] = useState(false)

  // Filter orders for table 3
  const tableOrders = orders.filter((order) => order.tableId === 3)

  // Count orders by status
  const orderCounts = {
    pending: tableOrders.filter((order) => order.status === "pending").length,
    preparing: tableOrders.filter((order) => order.status === "preparing").length,
    ready: tableOrders.filter((order) => order.status === "ready").length,
    delivered: tableOrders.filter((order) => order.status === "delivered").length,
  }

  // Calculate total revenue
  const totalRevenue = tableOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0)

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
          <h1 className="text-xl font-bold">Manager Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{orderCounts.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{orderCounts.preparing}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{orderCounts.ready}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{orderCounts.delivered}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-medium mb-4">Recent Orders</h2>

      {loading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-5 w-full mb-4">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-xs">
              Preparing
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs">
              Ready
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">
              Delivered
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-4">
            {tableOrders.length > 0 ? (
              tableOrders.map((order) => <ManagerOrderCard key={order.id} order={order} />)
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </TabsContent>

          {["pending", "preparing", "ready", "delivered"].map((status) => (
            <TabsContent key={status} value={status} className="mt-0 space-y-4">
              {tableOrders.filter((order) => order.status === status).length > 0 ? (
                tableOrders
                  .filter((order) => order.status === status)
                  .map((order) => <ManagerOrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">No {status} orders</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
