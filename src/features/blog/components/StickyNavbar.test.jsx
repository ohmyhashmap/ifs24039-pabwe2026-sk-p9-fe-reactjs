import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StickyNavbar from './StickyNavbar'

const setup = (props) => {
  const handlers = { navigate: vi.fn(), onLogout: vi.fn(), onToggleTheme: vi.fn() }
  render(<StickyNavbar isDark={false} {...handlers} {...props} />)
  return handlers
}

describe('StickyNavbar', () => {
  it('shows login/register for guests', async () => {
    const h = setup({ user: null })
    await userEvent.click(screen.getByText('Login'))
    expect(h.navigate).toHaveBeenLastCalledWith('/login')
    await userEvent.click(screen.getByText('Register'))
    expect(h.navigate).toHaveBeenLastCalledWith('/register')
    await userEvent.click(screen.getByText('Delcom Blog'))
    expect(h.navigate).toHaveBeenLastCalledWith('/')
    await userEvent.click(screen.getByLabelText('Ganti tema'))
    expect(h.onToggleTheme).toHaveBeenCalled()
    expect(screen.queryByText('Logout')).toBeNull()
    expect(screen.getByText('🌙')).toBeInTheDocument()
  })

  it('shows workspace and logout for authors', async () => {
    const h = setup({ user: { role: 'author' }, isDark: true })
    await userEvent.click(screen.getByText('Workspace Penulis'))
    expect(h.navigate).toHaveBeenLastCalledWith('/author')
    expect(screen.queryByText('Admin')).toBeNull()
    await userEvent.click(screen.getByText('Logout'))
    expect(h.onLogout).toHaveBeenCalled()
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('shows admin link for admins', async () => {
    const h = setup({ user: { role: 'admin' } })
    await userEvent.click(screen.getByText('Admin'))
    expect(h.navigate).toHaveBeenLastCalledWith('/admin')
  })
})
