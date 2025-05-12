"use client"

import { createContext, useContext, useState, useEffect } from "react"

const OrderContext = createContext(undefined)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch orders from the API on initial render
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          console.error("Failed to fetch orders")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const addOrder = async (order) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })

      if (response.ok) {
        const newOrder = await response.json()
        setOrders((prevOrders) => [...prevOrders, newOrder])
        return newOrder
      } else {
        console.error("Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? updatedOrder : order)))
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const markTableAsCompleted = async (tableId) => {
    try {
      const response = await fetch(`/api/orders/table/${tableId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const updatedOrders = await response.json()
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.tableId === tableId) {
              return { ...order, status: "completed" }
            }
            return order
          }),
        )
        return updatedOrders
      } else {
        console.error("Failed to mark table as completed")
      }
    } catch (error) {
      console.error("Error marking table as completed:", error)
    }
  }

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status)
  }

  const getOrdersByTable = (tableId) => {
    return orders.filter((order) => order.tableId === tableId)
  }

  const getActiveOrdersByTable = (tableId) => {
    return orders.filter((order) => order.tableId === tableId && order.status !== "completed")
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        addOrder,
        updateOrderStatus,
        markTableAsCompleted,
        getOrdersByStatus,
        getOrdersByTable,
        getActiveOrdersByTable,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
