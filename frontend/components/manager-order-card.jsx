"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import OrderStatusBadge from "@/components/order-status-badge"

export default function ManagerOrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false)

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
        <div className="flex flex-col items-end gap-1">
          <OrderStatusBadge status={order.status} />
          <div className="font-medium">${order.total.toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              View Details
            </>
          )}
        </Button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="text-sm font-medium mb-2">Order Items:</h4>
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
