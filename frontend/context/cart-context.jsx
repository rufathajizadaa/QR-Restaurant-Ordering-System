"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [tableItems, setTableItems] = useState({})

  // Load cart from localStorage on initial render
  useEffect(() => {
    // Load all table carts from localStorage
    const loadAllTableCarts = () => {
      const tables = {}

      // Check for any localStorage keys that match our cart pattern
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("cart-table-")) {
          try {
            const tableId = Number.parseInt(key.replace("cart-table-", ""), 10)
            const tableCart = JSON.parse(localStorage.getItem(key) || "[]")
            tables[tableId] = tableCart
          } catch (error) {
            console.error(`Failed to parse cart for key ${key}:`, error)
          }
        }
      }

      setTableItems(tables)
    }

    loadAllTableCarts()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Save all table carts to localStorage
    Object.entries(tableItems).forEach(([tableId, items]) => {
      localStorage.setItem(`cart-table-${tableId}`, JSON.stringify(items))
    })
  }, [tableItems])

  const getTableCart = (tableId) => {
    return tableItems[tableId] || []
  }

  const addToCart = (item, quantity, removedIngredients = [], removedIngredientIds = [], tableId) => {
    if (!tableId) {
      console.error("Table ID is required to add items to cart")
      return
    }

    setTableItems((prevTableItems) => {
      const currentTableItems = prevTableItems[tableId] || []

      // Check if this exact item with same customization exists
      const existingItemIndex = currentTableItems.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.removedIngredients || []) === JSON.stringify(removedIngredients),
      )

      let updatedTableItems

      if (existingItemIndex >= 0) {
        // Update existing item
        updatedTableItems = currentTableItems.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + quantity } : i,
        )
      } else {
        // Add new item with customization
        updatedTableItems = [
          ...currentTableItems,
          {
            ...item,
            quantity,
            removedIngredients: removedIngredients.length > 0 ? removedIngredients : undefined,
            removedIngredientIds: removedIngredientIds.length > 0 ? removedIngredientIds : undefined,
          },
        ]
      }

      return {
        ...prevTableItems,
        [tableId]: updatedTableItems,
      }
    })
  }

  const removeFromCart = (itemId, removedIngredients = [], tableId) => {
    if (!tableId) {
      console.error("Table ID is required to remove items from cart")
      return
    }

    setTableItems((prevTableItems) => {
      const currentTableItems = prevTableItems[tableId] || []

      const updatedTableItems = currentTableItems.filter((item) => {
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
      })

      return {
        ...prevTableItems,
        [tableId]: updatedTableItems,
      }
    })
  }

  const updateQuantity = (itemId, quantity, removedIngredients = [], tableId) => {
    if (!tableId) {
      console.error("Table ID is required to update quantity")
      return
    }

    if (quantity <= 0) {
      removeFromCart(itemId, removedIngredients, tableId)
      return
    }

    setTableItems((prevTableItems) => {
      const currentTableItems = prevTableItems[tableId] || []

      const updatedTableItems = currentTableItems.map((item) => {
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
      })

      return {
        ...prevTableItems,
        [tableId]: updatedTableItems,
      }
    })
  }

  const clearCart = (tableId) => {
    if (!tableId) {
      console.error("Table ID is required to clear cart")
      return
    }

    setTableItems((prevTableItems) => ({
      ...prevTableItems,
      [tableId]: [],
    }))
  }

  const getTotalPrice = (tableId) => {
    if (!tableId) {
      return 0
    }

    const tableCart = tableItems[tableId] || []
    return tableCart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = (tableId) => {
    if (!tableId) {
      return 0
    }

    const tableCart = tableItems[tableId] || []
    return tableCart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items: tableItems,
        getTableCart,
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
