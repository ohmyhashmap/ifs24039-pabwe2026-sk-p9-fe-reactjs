import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/adminApi', () => ({ getUsers: vi.fn(), getAllPosts: vi.fn(), getUserPosts: vi.fn() }))
import { getUsers, getAllPosts, getUserPosts } from '../api/adminApi'
import AdminDashboard from './AdminDashboard'

const users = [
  { id: 1, username: 'budi', email: 'b@x.id', role: 'author', total_posts: 2, published_posts: 1 },
  { id: 2, username: 'ani', email: 'a@x.id', role: 'admin', total_posts: 0, published_posts: 0 },
]
const posts = [
  { id: 1, title: 'P1', author_name: 'budi', category: 'Bisnis', is_published: true },
  { id: 2, title: 'P2', author_name: 'budi', category: 'Opini', is_published: false },
]

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getUsers.mockResolvedValue({ status: 'success', data: users })
    getAllPosts.mockResolvedValue({ status: 'success', data: posts })
  })

  it('renders stats, users and archive', async () => {
    render(<AdminDashboard />)
    expect(await screen.findByText('ani', { selector: 'td' })).toBeInTheDocument()
    expect(screen.getByText('b@x.id')).toBeInTheDocument()
    expect(screen.getByText('Total Pengguna', { selector: 'p' }).nextSibling).toHaveTextContent('2')
    expect(screen.getByText('Total Artikel', { selector: 'p' }).nextSibling).toHaveTextContent('2')
    expect(screen.getByText('Total Terbit', { selector: 'p' }).nextSibling).toHaveTextContent('1')
    expect(screen.getByText('Arsip Semua Artikel')).toBeInTheDocument()
    expect(screen.getByText('P2')).toBeInTheDocument()
    expect(screen.getByText('Terbit', { selector: 'td' })).toBeInTheDocument()
    expect(screen.getByText('Draf')).toBeInTheDocument()
    expect(screen.queryByText('Tampilkan Semua')).toBeNull()
  })

  it('filters by user and resets', async () => {
    getUserPosts.mockResolvedValue({ status: 'success', data: [posts[0]] })
    render(<AdminDashboard />)
    await screen.findByText('P2')
    await userEvent.click(screen.getAllByText('Lihat Artikel')[0])
    expect(await screen.findByText('Artikel budi')).toBeInTheDocument()
    expect(getUserPosts).toHaveBeenCalledWith(1)
    expect(screen.queryByText('P2')).toBeNull()
    await userEvent.click(screen.getByText('Tampilkan Semua'))
    expect(await screen.findByText('P2')).toBeInTheDocument()
    expect(screen.getByText('Arsip Semua Artikel')).toBeInTheDocument()
  })

  it('handles user posts error', async () => {
    getUserPosts.mockResolvedValue({ status: 'error' })
    render(<AdminDashboard />)
    await screen.findByText('P2')
    await userEvent.click(screen.getAllByText('Lihat Artikel')[1])
    await waitFor(() => expect(screen.queryByText('P2')).toBeNull())
  })

  it('handles load errors', async () => {
    getUsers.mockResolvedValue({ status: 'error' })
    getAllPosts.mockResolvedValue({ status: 'error' })
    render(<AdminDashboard />)
    await waitFor(() => expect(getAllPosts).toHaveBeenCalled())
    expect(screen.getByText('Total Pengguna', { selector: 'p' }).nextSibling).toHaveTextContent('0')
    expect(within(document.body).queryByText('P1')).toBeNull()
  })
})
