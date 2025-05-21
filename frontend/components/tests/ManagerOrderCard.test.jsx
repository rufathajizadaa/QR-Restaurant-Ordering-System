import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ManagerOrderCard from '../manager-order-card'

describe('ManagerOrderCard', () => {
  const order = {
    id: 123,
    tableId: 5,
    createdAt: '2025-05-21T14:30:00Z',
    status: 'preparing',
    total: 42.99,
    items: [
      { id: 1, name: 'Burger', price: 10, quantity: 2 },
      { id: 2, name: 'Fries', price: 5, quantity: 1, removedIngredients: ['salt'] },
    ],
  }

  test('renders header and hides details by default', () => {
    render(<ManagerOrderCard order={order} />)
    expect(screen.getByText(/order #123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Order Items:/i)).toBeNull()
  })

  test('toggles details on button click', () => {
    render(<ManagerOrderCard order={order} />)
    const toggle = screen.getByRole('button', { name: /view details/i })
    fireEvent.click(toggle)
    expect(screen.getByText(/Order Items:/i)).toBeInTheDocument()
    expect(screen.getByText(/2 × Burger/i)).toBeInTheDocument()
    expect(screen.getByText(/No: salt/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /hide details/i }))
    expect(screen.queryByText(/Order Items:/i)).toBeNull()
  })
})
