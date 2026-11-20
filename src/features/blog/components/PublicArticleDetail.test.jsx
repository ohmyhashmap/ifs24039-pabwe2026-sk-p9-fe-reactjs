import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/blogApi', () => ({ getPublicPostBySlug: vi.fn() }))
vi.mock('../../../components/MarkdownViewer', () => ({
  default: ({ content, darkMode }) => (
    <div data-testid="viewer" data-dark={String(darkMode)}>{content}</div>
  ),
}))
import { getPublicPostBySlug } from '../api/blogApi'
import PublicArticleDetail from './PublicArticleDetail'

const post = {
  title: 'Judul', author_name: 'Budi', published_at: '2026-01-15T00:00:00Z',
  category: 'Bisnis', reading_time: 4, content: '# isi', cover_image: 'http://x/y.png',
}

describe('PublicArticleDetail', () => {
  beforeEach(() => {
    delete window.__PREFETCH_POST_DETAIL__
    getPublicPostBySlug.mockReset()
  })

  it('uses window.__PREFETCH_POST_DETAIL__ when available and deletes it', async () => {
    window.__PREFETCH_POST_DETAIL__ = Promise.resolve({ status: 'success', data: post })
    render(<PublicArticleDetail slug="judul" navigate={vi.fn()} isDark={false} />)
    expect(window.__PREFETCH_POST_DETAIL__).toBeUndefined()
    expect(await screen.findByText('Judul')).toBeInTheDocument()
    expect(getPublicPostBySlug).not.toHaveBeenCalled()
  })

  it('shows loading then full article with cover', async () => {
    getPublicPostBySlug.mockResolvedValue({ status: 'success', data: post })
    render(<PublicArticleDetail slug="judul" navigate={vi.fn()} isDark />)
    expect(screen.getByText('Memuat...')).toBeInTheDocument()
    expect(await screen.findByText('Judul')).toBeInTheDocument()
    expect(getPublicPostBySlug).toHaveBeenCalledWith('judul')
    expect(screen.getByText(/Budi/)).toHaveTextContent('4 menit baca')
    expect(screen.getByText(/Budi/)).toHaveTextContent('Bisnis')
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://x/y.png')
    expect(await screen.findByTestId('viewer')).toHaveTextContent('# isi')
    expect(screen.getByTestId('viewer')).toHaveAttribute('data-dark', 'true')
  })

  it('renders without cover image', async () => {
    getPublicPostBySlug.mockResolvedValue({ status: 'success', data: { ...post, cover_image: '' } })
    render(<PublicArticleDetail slug="x" navigate={vi.fn()} isDark={false} />)
    await screen.findByText('Judul')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('shows not found and navigates back', async () => {
    getPublicPostBySlug.mockResolvedValue({ status: 'error', data: null })
    const navigate = vi.fn()
    render(<PublicArticleDetail slug="x" navigate={navigate} />)
    expect(await screen.findByText('Artikel tidak ditemukan.')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Kembali'))
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
