"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function MenuItemCard({ item, tableId }) {
  const [quantity, setQuantity] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [includedIngredients, setIncludedIngredients] = useState([])
  const { addToCart } = useCart()

  // Process ingredients to handle both string arrays and object arrays
  const processedIngredients = Array.isArray(item.ingredients)
    ? item.ingredients.map((ing) => (typeof ing === "object" && ing !== null ? ing : { id: ing, name: ing }))
    : []

  // Initialize included ingredients when dialog opens
  useEffect(() => {
    if (isDialogOpen && processedIngredients.length > 0) {
      // Store the IDs of included ingredients
      setIncludedIngredients(processedIngredients.map((ing) => ing.id))
    }
  }, [isDialogOpen, processedIngredients])

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

  // This is for adding directly from the menu page (without customization)
  const handleAddToCart = () => {
    // When adding directly, explicitly use an empty array for removedIngredients
    addToCart(item, quantity, [], [], tableId)
    setQuantity(1)
  }

  // This is for adding from the dialog with customization
  const handleAddToCartWithCustomization = () => {
    // Calculate removed ingredients (those that were in original ingredients but not in includedIngredients)
    const removedIngredientIds = processedIngredients
      .filter((ing) => !includedIngredients.includes(ing.id))
      .map((ing) => ing.id)

    // Get the names of removed ingredients for display
    const removedIngredientNames = processedIngredients
      .filter((ing) => !includedIngredients.includes(ing.id))
      .map((ing) => ing.name)

    // Add the item to cart with customization info
    // We store both the IDs (for backend) and names (for display)
    addToCart(item, quantity, removedIngredientNames, removedIngredientIds, tableId)
    setQuantity(1)
    setIsDialogOpen(false)
  }

  const handleIngredientToggle = (ingredientId, isChecked) => {
    if (isChecked) {
      // Add ingredient ID to included list
      setIncludedIngredients((prev) => [...prev, ingredientId])
    } else {
      // Remove ingredient ID from included list
      setIncludedIngredients((prev) => prev.filter((id) => id !== ingredientId))
    }
  }

  // Ensure we have a valid image URL or use a placeholder
  const imageUrl = item.image || "/placeholder.svg?height=100&width=100"

  // Truncate description for card view
  const truncatedDescription =
    item.description && item.description.length > 60
      ? `${item.description.substring(0, 60)}...`
      : item.description || "No description available"

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
              src={imageUrl || "/placeholder.svg"}
              alt={item.name}
              width={70}
              height={70}
              className="rounded-md object-cover cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 border-t">
          <div className="font-medium">${(item.price || 0).toFixed(2)}</div>
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
              <Image src={imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
            </div>
            <p className="text-sm">{item.description || "No description available"}</p>

            {/* Ingredients section */}
            {processedIngredients.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium">Ingredients</h3>
                  <p className="text-sm text-muted-foreground">Uncheck to remove an ingredient</p>
                  <div className="grid grid-cols-1 gap-2">
                    {processedIngredients.map((ingredient) => (
                      <div key={ingredient.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ingredient-${ingredient.id}`}
                          checked={includedIngredients.includes(ingredient.id)}
                          onCheckedChange={(checked) => handleIngredientToggle(ingredient.id, checked)}
                        />
                        <Label htmlFor={`ingredient-${ingredient.id}`} className="text-sm">
                          {ingredient.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div className="flex items-center justify-between">
              <div className="font-medium text-lg">${(item.price || 0).toFixed(2)}</div>
              <Button onClick={handleAddToCartWithCustomization}>Add to Cart</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
