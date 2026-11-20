import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/blogApi', async (orig) => ({ ...(await orig()), getPublicPosts: vi.fn() }))
import { getPublicPosts } from '../api/blogApi'
import PublicArticleList from './PublicArticleList'

const posts = [
  { id: 1, slug: 'a', title: 'Judul A', excerpt: 'Ringkas A', category: 'Bisnis', reading_time: 3 },
  { id: 2, slug: 'b', title: 'Judul B', excerpt: 'Ringkas B', category: 'Opini', reading_time: 5 },
]

describe('PublicArticleList', () => {
  beforeEach(() => {
    delete window.__PREFETCH_POSTS__
    getPublicPosts.mockReset()
  })

  it('uses window.__PREFETCH_POSTS__ on initial mount and deletes it', async () => {
    window.__PREFETCH_POSTS__ = Promise.resolve({ status: 'success', data: [posts[0]] })
    render(<PublicArticleList navigate={vi.fn()} />)
    expect(window.__PREFETCH_POSTS__).toBeUndefined()
    expect(await screen.findByText('Judul A')).toBeInTheDocument()
    expect(getPublicPosts).not.toHaveBeenCalled()
  })

  it('renders cards and navigates', async () => {
    getPublicPosts.mockResolvedValue({ status: 'success', data: posts })
    const navigate = vi.fn()
    render(<PublicArticleList navigate={navigate} />)
    expect(await screen.findByText('Judul A')).toBeInTheDocument()
    expect(screen.getByText('5 menit baca')).toBeInTheDocument()
    expect(screen.getByText('Ringkas B')).toBeInTheDocument()
    await userEvent.click(screen.getAllByTestId('article-card')[0])
    expect(navigate).toHaveBeenCalledWith('/posts/a')
  })

  it('searches in real time and filters by category', async () => {
    getPublicPosts.mockResolvedValue({ status: 'success', data: posts })
    render(<PublicArticleList navigate={vi.fn()} />)
    await screen.findByText('Judul A')
    expect(getPublicPosts).toHaveBeenLastCalledWith({ search: '', category: '' })
    await userEvent.type(screen.getByLabelText('Cari artikel'), 'ab')
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith({ search: 'ab', category: '' }))
    await userEvent.click(screen.getByRole('button', { name: 'Teknologi' }))
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith({ search: 'ab', category: 'Teknologi' }))
    expect(screen.getByRole('button', { name: 'Teknologi' })).toHaveAttribute('aria-pressed', 'true')
    for (const name of ['Semua', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('shows empty state on error', async () => {
    getPublicPosts.mockResolvedValue({ status: 'error', data: null })
    render(<PublicArticleList navigate={vi.fn()} />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
  })
})
