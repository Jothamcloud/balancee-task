import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  it('renders the heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /Hello, Hello/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Home />)
    const description = screen.getByText(/This is Jotham Arinze DevOps submission for the Balanceè/i)
    expect(description).toBeInTheDocument()
  })
})