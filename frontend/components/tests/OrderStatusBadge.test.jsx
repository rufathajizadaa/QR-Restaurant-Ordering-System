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
<<<<<<< HEAD
      expect(badge).toHaveClass(`status-${key}`)
=======

      if (key === 'completed') {
        // completed uses explicit gray+white classes
        expect(badge).toHaveClass('bg-gray-500', 'text-white')
      } else {
        // others use the helper `status-${key}` class
        expect(badge).toHaveClass(`status-${key}`)
      }
>>>>>>> 32def5f (Tsetin issues resolved)
    })
  }
})
