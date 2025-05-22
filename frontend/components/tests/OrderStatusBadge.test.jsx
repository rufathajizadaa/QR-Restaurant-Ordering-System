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

      if (key === 'completed') {
        // completed uses explicit bg-gray-500 + text-white classes
        expect(badge).toHaveClass('bg-gray-500', 'text-white')
      } else {
        // all others use the tailwind helper class `status-${key}`
        expect(badge).toHaveClass(`status-${key}`)
      }
    })
  }
})
