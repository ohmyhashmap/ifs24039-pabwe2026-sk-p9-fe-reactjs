import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MarkdownViewer from './MarkdownViewer'

describe('MarkdownViewer', () => {
  it('renders defaults in light mode', () => {
    render(<MarkdownViewer />)
    const viewer = screen.getByTestId('markdown-viewer')
    expect(viewer).toHaveAttribute('data-theme', 'light')
    expect(viewer).toHaveClass('text-gray-800')
    expect(viewer).toBeEmptyDOMElement()
  })

  it('renders headings, list items, paragraphs, and dark mode', () => {
    const md = '# H1\n\n## H2\n\n### H3\n\n- satu\n- dua\n\nParagraf'
    render(<MarkdownViewer content={md} darkMode />)
    const viewer = screen.getByTestId('markdown-viewer')
    expect(viewer).toHaveAttribute('data-theme', 'dark')
    expect(viewer).toHaveClass('text-gray-100')
    expect(screen.getByRole('heading', { level: 2, name: 'H1' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'H2' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'H3' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map((el) => el.textContent)).toEqual(['satu', 'dua'])
    expect(screen.getByText('Paragraf')).toBeInTheDocument()
  })
})
