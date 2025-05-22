"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import OrderStatusBadge from "@/components/order-status-badge"

export default function OrderCard({ order, onStatusChange, availableActions = [] }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Order #{order.id}</div>
          <div className="text-sm text-muted-foreground">Table #{order.tableId}</div>
          <div className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</div>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {order.items.map((item, index) => (
            <li key={`${item.id || item.itemId}-${index}`} className="flex flex-col mb-2">
              <div className="flex justify-between text-sm">
                <span className="truncate pr-2 flex-1">
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              {/* Display removed ingredients in the same format as cart page */}
              {item.removedIngredients && item.removedIngredients.length > 0 && (
                <div className="text-xs text-red-500 ml-5 truncate">no {item.removedIngredients.join(", no ")}</div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t flex justify-between font-medium">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </CardContent>
      {availableActions.length > 0 && onStatusChange && (
        <CardFooter className="flex gap-2 justify-end flex-wrap">
          {availableActions.map((status) => (
            <Button
              key={status}
              onClick={() => {
                console.log(`Changing order ${order.id} status to ${status}`)
                onStatusChange(order.id, status)
              }}
              variant={status === "preparing" ? "default" : status === "ready" ? "secondary" : "outline"}
              size="sm"
            >
              {status === "preparing"
                ? "Start Preparing"
                : status === "ready"
                  ? "Mark Ready"
                  : status === "delivered"
                    ? "Mark Delivered"
                    : `Mark ${status}`}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
