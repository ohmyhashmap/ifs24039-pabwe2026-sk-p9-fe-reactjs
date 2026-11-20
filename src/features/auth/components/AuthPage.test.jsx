import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('./AuthForm', () => ({
  default: ({ mode, onSuccess }) => (
    <div data-testid="form" data-mode={mode}>
      <input id={mode === 'login' ? 'login-username' : 'register-username'} />
      <button id="login-submit" onClick={() => onSuccess?.({ ok: 1 })}>go</button>
    </div>
  ),
}))
import AuthPage from './AuthPage'

describe('AuthPage', () => {
  it('renders login by default and has required ids', () => {
    render(<AuthPage />)
    expect(screen.getByTestId('form')).toHaveAttribute('data-mode', 'login')
    expect(document.getElementById('login-username')).toBeInTheDocument()
    expect(document.getElementById('login-submit')).toBeInTheDocument()
    expect(screen.getByText('Masuk Delcom Blog')).toBeInTheDocument()
  })

  it('switches modes back and forth', async () => {
    render(<AuthPage />)
    await userEvent.click(screen.getByTestId('switch-mode'))
    expect(screen.getByTestId('form')).toHaveAttribute('data-mode', 'register')
    expect(screen.getByText('Daftar Delcom Blog')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('switch-mode'))
    expect(screen.getByTestId('form')).toHaveAttribute('data-mode', 'login')
  })

  it('starts in register mode and forwards onSuccess', async () => {
    const onSuccess = vi.fn()
    render(<AuthPage mode="register" onSuccess={onSuccess} />)
    expect(screen.getByTestId('form')).toHaveAttribute('data-mode', 'register')
    await userEvent.click(document.getElementById('login-submit'))
    expect(onSuccess).toHaveBeenCalledWith({ ok: 1 })
  })
})
