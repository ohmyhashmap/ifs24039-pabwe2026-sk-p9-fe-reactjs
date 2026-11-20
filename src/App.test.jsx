import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('./features/auth/api/authApi', () => ({ logout: vi.fn(async () => ({ status: 'success' })) }))
vi.mock('./features/auth/components/AuthPage', () => ({
  default: ({ mode, onSuccess }) => (
    <div data-testid="auth-page" data-mode={mode}>
      <button onClick={onSuccess}>auth-success</button>
    </div>
  ),
}))
vi.mock('./features/blog/components/PublicArticleList', () => ({
  default: ({ navigate }) => <div data-testid="list"><button onClick={() => navigate('/posts/abc')}>open</button></div>,
}))
vi.mock('./features/blog/components/PublicArticleDetail', () => ({
  default: ({ slug }) => <div data-testid="detail">{slug}</div>,
}))
vi.mock('./features/blog/components/AuthorDashboard', () => ({
  default: () => <div data-testid="author" />,
}))
vi.mock('./features/admin/components/AdminDashboard', () => ({
  default: () => <div data-testid="admin" />,
}))

import { logout } from './features/auth/api/authApi'
import App from './App'

const go = (path) => window.history.replaceState({}, '', path)
const login = (user) => localStorage.setItem('delcom_user', JSON.stringify(user))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    go('/')
  })

  it('renders public list on / and /public, and navigates to detail', async () => {
    render(<App />)
    expect(screen.getByTestId('list')).toBeInTheDocument()
    await userEvent.click(screen.getByText('open'))
    expect(window.location.pathname).toBe('/posts/abc')
    expect(await screen.findByTestId('detail')).toHaveTextContent('abc')
  })

  it('renders list on /public', () => {
    go('/public')
    render(<App />)
    expect(screen.getByTestId('list')).toBeInTheDocument()
  })

  it('decodes slug', async () => {
    go('/posts/hello%20x')
    render(<App />)
    expect(await screen.findByTestId('detail')).toHaveTextContent('hello x')
  })

  it('redirects guests from /author to /login', async () => {
    go('/author')
    render(<App />)
    await waitFor(() => expect(window.location.pathname).toBe('/login'))
    expect(await screen.findByTestId('auth-page')).toHaveAttribute('data-mode', 'login')
  })

  it('shows author dashboard for logged in users', async () => {
    login({ role: 'author' })
    go('/author')
    render(<App />)
    expect(await screen.findByTestId('author')).toBeInTheDocument()
  })

  it('guards /admin', async () => {
    go('/admin')
    const { unmount } = render(<App />)
    await waitFor(() => expect(window.location.pathname).toBe('/login'))
    unmount()

    login({ role: 'author' })
    go('/admin')
    const second = render(<App />)
    await waitFor(() => expect(window.location.pathname).toBe('/'))
    second.unmount()

    login({ role: 'admin' })
    go('/admin')
    render(<App />)
    expect(await screen.findByTestId('admin')).toBeInTheDocument()
  })

  it('renders register and goes to login after success', async () => {
    go('/register')
    render(<App />)
    expect(await screen.findByTestId('auth-page')).toHaveAttribute('data-mode', 'register')
    await userEvent.click(screen.getByText('auth-success'))
    expect(window.location.pathname).toBe('/login')
  })

  it('routes after login by role', async () => {
    go('/login')
    const { unmount } = render(<App />)
    login({ role: 'admin' })
    await userEvent.click(await screen.findByText('auth-success'))
    expect(window.location.pathname).toBe('/admin')
    unmount()

    go('/login')
    const second = render(<App />)
    login({ role: 'author' })
    await userEvent.click(await screen.findByText('auth-success'))
    expect(window.location.pathname).toBe('/author')
    second.unmount()

    localStorage.clear()
    go('/login')
    render(<App />)
    await userEvent.click(await screen.findByText('auth-success'))
    await waitFor(() => expect(window.location.pathname).toBe('/login'))
  })

  it('shows not found page', async () => {
    go('/nope')
    render(<App />)
    expect(screen.getByText('Halaman tidak ditemukan.')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Ke Beranda'))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByTestId('list')).toBeInTheDocument()
  })

  it('reacts to popstate', async () => {
    render(<App />)
    go('/register')
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(await screen.findByTestId('auth-page')).toBeInTheDocument()
  })

  it('logs out', async () => {
    login({ role: 'author' })
    go('/author')
    render(<App />)
    await userEvent.click(screen.getByText('Logout'))
    await waitFor(() => expect(window.location.pathname).toBe('/'))
    expect(logout).toHaveBeenCalled()
    expect(localStorage.getItem('delcom_user')).toBeNull()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('toggles theme', async () => {
    render(<App />)
    const before = document.documentElement.classList.contains('dark')
    await userEvent.click(screen.getByLabelText('Ganti tema'))
    expect(document.documentElement.classList.contains('dark')).toBe(!before)
  })
})
