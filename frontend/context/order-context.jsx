"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const OrderContext = createContext(undefined)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch orders from the API on initial render
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/api/orders")
      if (response.status === 200) {
        setOrders(response.data)
      } else {
        console.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const addOrder = async (orderData) => {
    try {
      // Format the order data according to the expected structure
      const newOrder = {
        tableId: orderData.tableId,
        total: orderData.total,
        status: "pending",
        items: orderData.items.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          removedIngredients: item.removedIngredients,
        })),
      }

      const response = await axios.post("http://localhost:8080/api/orders", newOrder)

      if (response.status === 201 || response.status === 200) {
        // Refresh orders after adding a new one
        fetchOrders()
        return response.data
      } else {
        console.error("Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/orders/${orderId}`, { status })

      if (response.status === 200) {
        // Refresh orders after updating status
        fetchOrders()
        return response.data
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const markTableAsCompleted = async (tableId) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/orders/table/${tableId}/complete`)

      if (response.status === 200) {
        // Refresh orders after marking table as completed
        fetchOrders()
        return response.data
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

  const refreshOrders = () => {
    return fetchOrders()
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
        refreshOrders,
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
