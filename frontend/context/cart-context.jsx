"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (item, quantity, removedIngredients = [], removedIngredientIds = []) => {
    setItems((prevItems) => {
      // Check if this exact item with same customization exists
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.removedIngredients || []) === JSON.stringify(removedIngredients),
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        return prevItems.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + quantity } : i,
        )
      } else {
        // Add new item with customization
        return [
          ...prevItems,
          {
            ...item,
            quantity,
            removedIngredients: removedIngredients.length > 0 ? removedIngredients : undefined,
            removedIngredientIds: removedIngredientIds.length > 0 ? removedIngredientIds : undefined,
          },
        ]
      }
    })
  }

  const removeFromCart = (itemId, removedIngredients = []) => {
    setItems((prevItems) =>
      prevItems.filter((item) => {
        // If we're looking for an item with specific customizations
        if (removedIngredients && removedIngredients.length > 0) {
          return !(
            item.id === itemId && JSON.stringify(item.removedIngredients || []) === JSON.stringify(removedIngredients)
          )
        }
        // If we're looking for a default item (no customizations)
        if (removedIngredients.length === 0) {
          return !(item.id === itemId && (!item.removedIngredients || item.removedIngredients.length === 0))
        }
        return true
      }),
    )
  }

  const updateQuantity = (itemId, quantity, removedIngredients = []) => {
    if (quantity <= 0) {
      removeFromCart(itemId, removedIngredients)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        // Check if this is the item with the specific customization
        if (item.id === itemId) {
          // For items with customization
          if (removedIngredients && removedIngredients.length > 0) {
            // Only update if the customizations match exactly
            if (JSON.stringify(item.removedIngredients || []) === JSON.stringify(removedIngredients)) {
              return { ...item, quantity }
            }
          }
          // For default items (no customization)
          else if (!item.removedIngredients || item.removedIngredients.length === 0) {
            return { ...item, quantity }
          }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
