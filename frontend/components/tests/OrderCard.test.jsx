import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import OrderCard from '../order-card'

describe('OrderCard', () => {
  const order = {
    id: 9,
    tableId: 2,
    createdAt: '2025-05-21T10:00:00Z',
    status: 'pending',
    total: 30,
    items: [{ id: 1, name: 'Tea', price: 3, quantity: 2 }],
  }
  const onStatusChange = jest.fn()
  const actions = ['preparing', 'ready']

  test('shows order info and action buttons', () => {
    render(
      <OrderCard
        order={order}
        availableActions={actions}
        onStatusChange={onStatusChange}
      />
    )
    expect(screen.getByText(/Order #9/i)).toBeInTheDocument()
    expect(screen.getByText(/2 × Tea/i)).toBeInTheDocument()
    const prepareBtn = screen.getByRole('button', { name: /start preparing/i })
    fireEvent.click(prepareBtn)
    expect(onStatusChange).toHaveBeenCalledWith(9, 'preparing')
  })
})
