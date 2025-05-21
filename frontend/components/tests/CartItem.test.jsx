import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../cart-item'
import { useCart } from '@/context/cart-context'
import { useParams } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))
jest.mock('@/context/cart-context', () => ({
  useCart: jest.fn(),
}))

describe('CartItem', () => {
  const mockUpdate = jest.fn()
  const mockRemove = jest.fn()

  beforeEach(() => {
    useParams.mockReturnValue({ tableId: '42' })
    useCart.mockReturnValue({
      updateQuantity: mockUpdate,
      removeFromCart: mockRemove,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const item = {
    id: 7,
    name: 'Margarita',
    price: 8.5,
    quantity: 2,
    image: '/pizza.png',
    removedIngredients: ['olives', 'anchovies'],
  }

  test('renders image, name, price × quantity and removed ingredients', () => {
    render(<CartItem item={item} />)
    expect(screen.getByRole('img', { name: /margarita/i })).toHaveAttribute(
      'src',
      expect.stringContaining('pizza.png')
    )
    expect(screen.getByText('Margarita')).toBeInTheDocument()
    expect(screen.getByText('$17.00')).toBeInTheDocument()
    expect(screen.getByText('No: olives, anchovies')).toBeInTheDocument()
  })

  test('increment button calls updateQuantity with +1', () => {
    render(<CartItem item={item} />)
    const [dec, inc, rem] = screen.getAllByRole('button')
    fireEvent.click(inc)
    expect(mockUpdate).toHaveBeenCalledWith(
      7,
      3,
      ['olives', 'anchovies'],
      42
    )
  })

  test('decrement button calls updateQuantity with –1 when quantity > 1', () => {
    render(<CartItem item={item} />)
    const [dec] = screen.getAllByRole('button')
    fireEvent.click(dec)
    expect(mockUpdate).toHaveBeenCalledWith(
      7,
      1,
      ['olives', 'anchovies'],
      42
    )
  })

  test('remove button calls removeFromCart', () => {
    render(<CartItem item={item} />)
    const buttons = screen.getAllByRole('button')
    const removeBtn = buttons[2]
    fireEvent.click(removeBtn)
    expect(mockRemove).toHaveBeenCalledWith(
      7,
      ['olives', 'anchovies'],
      42
    )
  })
})
