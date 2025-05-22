"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useParams } from "next/navigation"

export default function CartItem({ item }) {
  const params = useParams()
  const tableId = Number.parseInt(params.tableId, 10)
  const { updateQuantity, removeFromCart } = useCart()

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1, item.removedIngredients || [], tableId)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, item.removedIngredients || [], tableId)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id, item.removedIngredients || [], tableId)
  }

  // Ensure we have a valid image URL or use a placeholder
  const imageUrl = item.image || item.imageUrl || "/placeholder.svg?height=60&width=60"

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      <div className="flex-shrink-0">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={item.name}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base truncate">{item.name}</h3>
        {item.removedIngredients && item.removedIngredients.length > 0 && (
          <p className="text-xs text-red-500">no {item.removedIngredients.join(", no ")}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none" onClick={handleDecrement}>
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 flex items-center justify-center">{item.quantity}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handleRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
