import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import LoginDialog from '../login-dialog'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('LoginDialog', () => {
  let pushMock
  const onOpenChange = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    pushMock = jest.fn()
    useRouter.mockReturnValue({ push: pushMock })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  test('renders inputs and default role', () => {
    render(<LoginDialog open={true} onOpenChange={onOpenChange} />)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    // match both the hidden <option> and the visible <span>
    expect(screen.getAllByText(/kitchen staff/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled()
  })

  test('submits and navigates to selected role', () => {
    render(<LoginDialog open={true} onOpenChange={onOpenChange} />)
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'foo' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'bar' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // advance the 1s simulated login
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(pushMock).toHaveBeenCalledWith('/kitchen')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
