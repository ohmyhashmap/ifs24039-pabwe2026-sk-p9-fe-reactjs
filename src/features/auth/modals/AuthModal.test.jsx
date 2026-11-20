import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../components/AuthForm', () => ({
  default: ({ mode, onSuccess }) => (
    <div data-testid="form" data-mode={mode}>
      <input id={mode === 'login' ? 'login-username' : 'register-username'} />
      <button id="login-submit" onClick={() => onSuccess?.({ ok: 1 })}>go</button>
    </div>
  ),
}))
import AuthModal from './AuthModal'

describe('AuthModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<AuthModal open={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders login form with required ids and switches modes', async () => {
    render(<AuthModal open />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.getElementById('login-username')).toBeInTheDocument()
    expect(document.getElementById('login-submit')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('switch-mode'))
    expect(screen.getByTestId('form')).toHaveAttribute('data-mode', 'register')
    await userEvent.click(screen.getByTestId('switch-mode'))
    expect(screen.getByTestId('form')).toHaveAttribute('data-mode', 'login')
  })

  it('closes and calls success handlers', async () => {
    const onClose = vi.fn()
    const onSuccess = vi.fn()
    render(<AuthModal open mode="register" onClose={onClose} onSuccess={onSuccess} />)
    await userEvent.click(screen.getByTestId('close-modal'))
    expect(onClose).toHaveBeenCalledTimes(1)
    await userEvent.click(document.getElementById('login-submit'))
    expect(onSuccess).toHaveBeenCalledWith({ ok: 1 })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('works without optional callbacks', async () => {
    render(<AuthModal open />)
    await userEvent.click(screen.getByTestId('close-modal'))
    await userEvent.click(document.getElementById('login-submit'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
