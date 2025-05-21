import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme-provider'

test('renders children inside ThemeProvider', () => {
  render(
    <ThemeProvider attribute="class">
      <div>Hello Theme</div>
    </ThemeProvider>
  )
  expect(screen.getByText('Hello Theme')).toBeInTheDocument()
})
