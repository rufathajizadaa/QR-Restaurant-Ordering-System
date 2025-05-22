"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import OrderStatusBadge from "@/components/order-status-badge"

export default function TableAccountCard({ tableId, orders, total, onCloseTable }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCloseTable = () => {
    if (window.confirm(`Are you sure you want to close Table ${tableId}? This will mark all orders as completed.`)) {
      onCloseTable(tableId)
    }
  }

  // Count orders by status
  const orderCounts = {
    pending: orders.filter((order) => order.status === "pending").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    ready: orders.filter((order) => order.status === "ready").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Table {tableId}</h3>
            <div className="text-sm text-muted-foreground">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${total.toFixed(2)}</div>
            <Button variant="ghost" size="sm" onClick={handleToggle} className="px-2">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show Details
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4 text-center text-sm">
            <div className="bg-amber-50 p-2 rounded-md">
              <div className="font-medium text-amber-700 truncate">Pending</div>
              <div className="text-amber-700">{orderCounts.pending}</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-md">
              <div className="font-medium text-blue-700 truncate">Preparing</div>
              <div className="text-blue-700">{orderCounts.preparing}</div>
            </div>
            <div className="bg-green-50 p-2 rounded-md">
              <div className="font-medium text-green-700 truncate">Ready</div>
              <div className="text-green-700">{orderCounts.ready}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-md">
              <div className="font-medium text-purple-700 truncate">Delivered</div>
              <div className="text-purple-700">{orderCounts.delivered}</div>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium">Order #{order.id}</span>
                    <div className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <ul className="space-y-1 text-sm">
                  {order.items.map((item, index) => (
                    <li key={`${item.id || item.itemId}-${index}`} className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="truncate pr-2 flex-1">
                          {item.quantity} × {item.name}
                        </span>
                        <span className="whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {/* Display removed ingredients in the same format as cart page */}
                      {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <div className="text-xs text-red-500 ml-5 truncate">
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
            ))}
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-2">
        <Button className="w-full" onClick={handleCloseTable}>
          Close Table
        </Button>
      </CardFooter>
    </Card>
  )
}
