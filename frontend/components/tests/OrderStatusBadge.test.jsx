import React from 'react'
import { render, screen } from '@testing-library/react'
import OrderStatusBadge from '../order-status-badge'

const statuses = {
  pending: 'Pending',
  preparing: 'In Preparation',
  ready: 'Ready',
  delivered: 'Delivered',
  completed: 'Completed',
}

describe('OrderStatusBadge', () => {
  for (const [key, label] of Object.entries(statuses)) {
    test(`renders "${label}" for status="${key}"`, () => {
      render(<OrderStatusBadge status={key} />)
      const badge = screen.getByText(label)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass(`status-${key}`)
    })
  }
})
