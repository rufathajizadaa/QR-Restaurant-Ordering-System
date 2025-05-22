import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TableAccountCard from '../table-account-card'

describe('TableAccountCard', () => {
  const orders = [
    { id: 1, createdAt: '2025-05-21T09:00:00Z', status: 'pending', items: [], total: 0 },
    { id: 2, createdAt: '2025-05-21T09:05:00Z', status: 'ready', items: [], total: 0 },
  ]
  const onClose = jest.fn()

  beforeAll(() => {
    window.confirm = jest.fn(() => true)
  })

  it('shows summary and toggles details', () => {
    render(
      <TableAccountCard
        tableId={7}
        orders={orders}
        total={0}
        onCloseTable={onClose}
      />
    )
    expect(screen.getByText(/Table 7/i)).toBeInTheDocument()
    expect(screen.getByText(/2 orders/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /show details/i }))
    expect(screen.getByText(/Pending/i)).toBeInTheDocument()
    expect(screen.getByText(/Ready/i)).toBeInTheDocument()
  })

  it('calls onCloseTable when confirmed', () => {
    render(
      <TableAccountCard
        tableId={7}
        orders={orders}
        total={0}
        onCloseTable={onClose}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /close table/i }))
    expect(onClose).toHaveBeenCalledWith(7)
  })
})
