// OrderCard.test.jsx
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import OrderCard from "./order-card"

// Mock the child components to isolate testing (optional)
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}))
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardFooter: ({ children }) => <footer>{children}</footer>,
  CardHeader: ({ children }) => <header>{children}</header>,
}))
jest.mock("@/components/order-status-badge", () => () => <div data-testid="status-badge" />)

describe("OrderCard component", () => {
  const mockOrder = {
    id: 123,
    tableId: 5,
    createdAt: "2025-05-22T10:30:00Z",
    status: "pending",
    items: [
      { id: 1, name: "Pizza", quantity: 2, price: 10.5, removedIngredients: ["Olives", "Onion"] },
      { id: 2, name: "Soda", quantity: 3, price: 2.0, removedIngredients: [] },
    ],
    total: 27.0,
  }

  it("renders order details correctly", () => {
    render(<OrderCard order={mockOrder} />)

    expect(screen.getByText("Order #123")).toBeInTheDocument()
    expect(screen.getByText("Table #5")).toBeInTheDocument()
    expect(screen.getByText(/May/)).toBeInTheDocument() // date formatted
    expect(screen.getByTestId("status-badge")).toBeInTheDocument()
  })

  it("renders order items with quantities, names, and prices", () => {
    render(<OrderCard order={mockOrder} />)

    expect(screen.getByText("2 × Pizza")).toBeInTheDocument()
    expect(screen.getByText("$21.00")).toBeInTheDocument() // 2 * 10.5
    expect(screen.getByText("3 × Soda")).toBeInTheDocument()
    expect(screen.getByText("$6.00")).toBeInTheDocument() // 3 * 2.0
  })

  it("shows removed ingredients if any", () => {
    render(<OrderCard order={mockOrder} />)

    expect(screen.getByText("No: Olives, Onion")).toBeInTheDocument()
  })

  it("does not show removed ingredients section if none", () => {
    const orderWithoutRemoved = {
      ...mockOrder,
      items: [{ id: 3, name: "Salad", quantity: 1, price: 5.0, removedIngredients: [] }],
      total: 5.0,
    }

    render(<OrderCard order={orderWithoutRemoved} />)
    expect(screen.queryByText(/No:/)).not.toBeInTheDocument()
  })

  it("shows total price", () => {
    render(<OrderCard order={mockOrder} />)
    expect(screen.getByText("Total:")).toBeInTheDocument()
    expect(screen.getByText("$27.00")).toBeInTheDocument()
  })

  it("renders action buttons and triggers onStatusChange on click", () => {
    const availableActions = ["preparing", "ready", "delivered"]
    const onStatusChange = jest.fn()

    render(<OrderCard order={mockOrder} availableActions={availableActions} onStatusChange={onStatusChange} />)

    const startPreparingBtn = screen.getByText("Start Preparing")
    const markReadyBtn = screen.getByText("Mark Ready")
    const markDeliveredBtn = screen.getByText("Mark Delivered")

    expect(startPreparingBtn).toBeInTheDocument()
    expect(markReadyBtn).toBeInTheDocument()
    expect(markDeliveredBtn).toBeInTheDocument()

    fireEvent.click(startPreparingBtn)
    expect(onStatusChange).toHaveBeenCalledWith(mockOrder.id, "preparing")

    fireEvent.click(markReadyBtn)
    expect(onStatusChange).toHaveBeenCalledWith(mockOrder.id, "ready")

    fireEvent.click(markDeliveredBtn)
    expect(onStatusChange).toHaveBeenCalledWith(mockOrder.id, "delivered")
  })

  it("does not render action buttons if availableActions is empty or onStatusChange is missing", () => {
    const { rerender } = render(<OrderCard order={mockOrder} availableActions={[]} onStatusChange={() => {}} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()

    rerender(<OrderCard order={mockOrder} availableActions={["preparing"]} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
