import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostStats from './PostStats'

describe('PostStats', () => {
  it('renders values', () => {
    render(<PostStats total={5} published={3} draft={2} />)
    expect(screen.getByText('Total Artikel').nextSibling).toHaveTextContent('5')
    expect(screen.getByText('Terbit').nextSibling).toHaveTextContent('3')
    expect(screen.getByText('Draf').nextSibling).toHaveTextContent('2')
  })
  it('defaults to zero', () => {
    render(<PostStats />)
    expect(screen.getByText('Draf').nextSibling).toHaveTextContent('0')
  })
})
