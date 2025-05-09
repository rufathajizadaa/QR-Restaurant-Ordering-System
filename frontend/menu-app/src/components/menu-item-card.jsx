"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function MenuItemCard({ item }) {
  const [quantity, setQuantity] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addToCart } = useCart()

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    } else if (e.target.value === "") {
      setQuantity(1)
    }
  }

  const handleAddToCart = () => {
    addToCart(item, quantity)
    setQuantity(1)
  }

  // Truncate description for card view
  const truncatedDescription =
    item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description

  return (
    <>
      <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm">
        <div className="flex p-3 gap-3">
          <div className="flex-1">
            <h3
              className="font-medium text-base cursor-pointer hover:text-primary"
              onClick={() => setIsDialogOpen(true)}
            >
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{truncatedDescription}</p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={70}
              height={70}
              className="rounded-md object-cover cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 border-t">
          <div className="font-medium">${item.price.toFixed(2)}</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none" onClick={handleDecrement}>
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-10 h-8 text-center bg-transparent border-x"
                min="1"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" onClick={handleAddToCart}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-48">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
            </div>
            <p className="text-sm">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="font-medium text-lg">${item.price.toFixed(2)}</div>
              <Button
                onClick={() => {
                  handleAddToCart()
                  setIsDialogOpen(false)
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
