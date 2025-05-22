"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ManagerOrderCard from "@/components/manager-order-card"
import { useOrders } from "@/context/order-context"

export default function ManagerPage() {
  const { orders, loading, refreshOrders } = useOrders()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTable, setSelectedTable] = useState("all")
  const [includeCompleted, setIncludeCompleted] = useState(false)

  // Filter orders based on selected table and completion status
  const filteredOrders = orders.filter((order) => {
    // Filter by table if not "all"
    const tableMatch = selectedTable === "all" || order.tableId === Number.parseInt(selectedTable, 10)
    // Filter by completion status
    const statusMatch = includeCompleted || order.status !== "completed"
    return tableMatch && statusMatch
  })

  // Count orders by status
  const orderCounts = {
    pending: filteredOrders.filter((order) => order.status === "pending").length,
    preparing: filteredOrders.filter((order) => order.status === "preparing").length,
    ready: filteredOrders.filter((order) => order.status === "ready").length,
    delivered: filteredOrders.filter((order) => order.status === "delivered").length,
    completed: filteredOrders.filter((order) => order.status === "completed").length,
  }

  // Calculate total revenue from delivered and completed orders
  const totalRevenue = filteredOrders
    .filter((order) => order.status === "delivered" || order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0)

  // Get unique table IDs
  const tableIds = [...new Set(orders.map((order) => order.tableId))].sort((a, b) => a - b)

  // Handle refresh
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
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tables</SelectItem>
              {tableIds.map((id) => (
                <SelectItem key={id} value={id.toString()}>
                  Table {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={includeCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => setIncludeCompleted(!includeCompleted)}
            className="whitespace-nowrap"
          >
            {includeCompleted ? "Hide Completed" : "Show Completed"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <div className="text-xs text-muted-foreground">
              {selectedTable === "all" ? "All tables" : `Table ${selectedTable}`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">From delivered/completed orders</div>
          </CardContent>
        </Card>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        {includeCompleted && (
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{orderCounts.completed}</div>
            </CardContent>
          </Card>
        )}
      </div>

      <h2 className="text-lg font-medium mb-4">
        {selectedTable === "all" ? "All Orders" : `Orders for Table ${selectedTable}`}
      </h2>

      {loading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-6 w-full mb-4 overflow-x-auto">
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
            {includeCompleted && (
              <TabsTrigger value="completed" className="text-xs">
                Completed
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => <ManagerOrderCard key={order.id} order={order} />)
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </TabsContent>

          {["pending", "preparing", "ready", "delivered", "completed"].map((status) => {
            // Skip the completed tab if includeCompleted is false
            if (status === "completed" && !includeCompleted) return null

            return (
              <TabsContent key={status} value={status} className="mt-0 space-y-4">
                {filteredOrders.filter((order) => order.status === status).length > 0 ? (
                  filteredOrders
                    .filter((order) => order.status === status)
                    .map((order) => <ManagerOrderCard key={order.id} order={order} />)
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No {status} orders</p>
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
