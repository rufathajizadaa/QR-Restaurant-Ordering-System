"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import CartItem from "@/components/cart-item"
import { useCart } from "@/context/cart-context"
import { useOrders } from "@/context/order-context"
import { useRouter } from "next/navigation"

export default function CartPage({ params }) {
  const tableId = Number.parseInt(params.tableId, 10)
  const { getTableCart, getTotalPrice, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cartItems = getTableCart(tableId)

  // Update the handlePlaceOrder function to ensure proper order data format
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create order from cart items with the correct format
      await addOrder({
        tableId: tableId,
        total: getTotalPrice(tableId),
        items: cartItems.map((item) => ({
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          removedIngredients: item.removedIngredients,
        })),
      })

      // Clear cart
      clearCart(tableId)

      // Show success message
      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to the kitchen.",
      })

      // Redirect to menu
      router.push(`/menu/${tableId}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mobile-container pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href={`/menu/${tableId}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Your Cart - Table {tableId}</h1>
        </div>
        {cartItems.length > 0 && (
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => clearCart(tableId)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="space-y-1 mb-4">
            {cartItems.map((item, index) => (
              <CartItem key={`${item.id}-${index}`} item={item} />
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getTotalPrice(tableId).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>${getTotalPrice(tableId).toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full mt-6" size="lg" onClick={handlePlaceOrder} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items from the menu to get started</p>
          <Link href={`/menu/${tableId}`}>
            <Button>Browse Menu</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
