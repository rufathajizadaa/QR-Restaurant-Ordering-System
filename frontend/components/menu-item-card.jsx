"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function MenuItemCard({ item, tableId }) {
  const [quantity, setQuantity] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const [includedIngredients, setIncludedIngredients] = useState([])
  const { addToCart } = useCart()

  // Check if the item has ingredients and is customizable
  const isCustomizable = item.ingredients && item.ingredients.length > 0

  // Process ingredients to handle both string arrays and object arrays
  const processedIngredients = isCustomizable
    ? item.ingredients.map((ing) => {
        // Handle both formats: string or {id, name} object
        if (typeof ing === "string") {
          return { id: ing, name: ing }
        } else if (typeof ing === "object" && ing !== null) {
          return ing
        }
        return { id: ing, name: ing }
      })
    : []

  // Initialize included ingredients when component mounts or item changes
  useEffect(() => {
    if (processedIngredients.length > 0) {
      // By default, include all ingredients
      setIncludedIngredients(processedIngredients.map((ing) => ing.id))
    }
  }, [item])

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

  const handleIngredientToggle = (ingredientId, isChecked) => {
    if (isChecked) {
      // Add ingredient ID to included list
      setIncludedIngredients((prev) => [...prev, ingredientId])
    } else {
      // Remove ingredient ID from included list
      setIncludedIngredients((prev) => prev.filter((id) => id !== ingredientId))
    }
  }

  // Handle adding to cart with current customization state
  const handleAddToCart = () => {
    // If not expanded or no ingredients, add as default
    if (!isExpanded || !isCustomizable) {
      addToCart(item, quantity, [], [], tableId)
    } else {
      // Calculate removed ingredients (those that were in original ingredients but not in includedIngredients)
      const removedIngredientIds = processedIngredients
        .filter((ing) => !includedIngredients.includes(ing.id))
        .map((ing) => ing.id)

      // Get the names of removed ingredients for display
      const removedIngredientNames = processedIngredients
        .filter((ing) => !includedIngredients.includes(ing.id))
        .map((ing) => ing.name)

      // Add the item to cart with customization info
      addToCart(item, quantity, removedIngredientNames, removedIngredientIds, tableId)
    }

    // Reset quantity after adding to cart
    setQuantity(1)
    // Keep expansion state as is
  }

  // Ensure we have a valid image URL or use a placeholder
  const imageUrl = item.image || item.imageUrl || "/placeholder.svg?height=100&width=100"

  // Truncate description for card view
  const truncatedDescription =
    item.description && item.description.length > 60
      ? `${item.description.substring(0, 60)}...`
      : item.description || "No description available"

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm">
      <div className="flex p-3 gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-base">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{truncatedDescription}</p>

          {/* Customization toggle for items with ingredients */}
          {isCustomizable && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-xs text-muted-foreground hover:text-primary flex items-center"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                {isExpanded ? "Hide customization" : "Customize ingredients"}
              </Button>
            </div>
          )}

          {/* Expanded customization section with checkboxes */}
          {isExpanded && isCustomizable && (
            <div className="mt-2 pl-2 border-l-2 border-muted">
              <p className="text-xs text-muted-foreground mb-1">Uncheck to remove ingredients:</p>
              <div className="space-y-1">
                {processedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ingredient-${item.id}-${ingredient.id}`}
                      checked={includedIngredients.includes(ingredient.id)}
                      onCheckedChange={(checked) => handleIngredientToggle(ingredient.id, checked)}
                    />
                    <Label htmlFor={`ingredient-${item.id}-${ingredient.id}`} className="text-xs cursor-pointer">
                      {ingredient.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={item.name}
            width={70}
            height={70}
            className="rounded-md object-cover"
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
  )
}
