import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/authApi', () => ({ login: vi.fn(), register: vi.fn() }))
vi.mock('../../../helpers/apiHelper', () => ({ setToken: vi.fn(), setUser: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ showErrorAlert: vi.fn(), showSuccessAlert: vi.fn() }))

import { login, register } from '../api/authApi'
import { setToken, setUser } from '../../../helpers/apiHelper'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'
import AuthForm from './AuthForm'

describe('AuthForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('logs in successfully with user and calls onSuccess', async () => {
    login.mockResolvedValue({ status: 'success', data: { token: 't', user: { id: 1 } } })
    const onSuccess = vi.fn()
    render(<AuthForm onSuccess={onSuccess} />)
    await userEvent.type(document.getElementById('login-username'), 'bob')
    await userEvent.type(document.getElementById('login-password'), 'pw')
    await userEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    expect(login).toHaveBeenCalledWith({ username: 'bob', password: 'pw' })
    expect(setToken).toHaveBeenCalledWith('t')
    expect(setUser).toHaveBeenCalledWith({ id: 1 })
  })

  it('logs in with data lacking user, no onSuccess', async () => {
    login.mockResolvedValue({ status: 'success', data: { token: 't' } })
    render(<AuthForm mode="login" />)
    await userEvent.type(document.getElementById('login-username'), 'a')
    await userEvent.type(document.getElementById('login-password'), 'b')
    await userEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(setToken).toHaveBeenCalled())
    expect(setUser).not.toHaveBeenCalled()
  })

  it('logs in with null data', async () => {
    login.mockResolvedValue({ status: 'success', data: null })
    const onSuccess = vi.fn()
    render(<AuthForm onSuccess={onSuccess} />)
    await userEvent.type(document.getElementById('login-username'), 'a')
    await userEvent.type(document.getElementById('login-password'), 'b')
    await userEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(null))
    expect(setUser).not.toHaveBeenCalled()
  })

  it('shows error on failure', async () => {
    login.mockResolvedValue({ status: 'error', message: 'nope' })
    render(<AuthForm />)
    await userEvent.type(document.getElementById('login-username'), 'a')
    await userEvent.type(document.getElementById('login-password'), 'b')
    await userEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('nope'))
  })

  it('shows error when register fails', async () => {
    register.mockResolvedValue({ status: 'error', message: 'taken' })
    render(<AuthForm mode="register" />)
    await userEvent.type(document.getElementById('register-name'), 'B')
    await userEvent.type(document.getElementById('register-username'), 'b')
    await userEvent.type(document.getElementById('register-password'), 'p')
    await userEvent.click(document.getElementById('register-submit'))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('taken'))
  })

  it('registers', async () => {
    register.mockResolvedValue({ status: 'success', message: 'done', data: null })
    const onSuccess = vi.fn()
    render(<AuthForm mode="register" onSuccess={onSuccess} />)
    await userEvent.type(document.getElementById('register-name'), 'Bob')
    await userEvent.type(document.getElementById('register-username'), 'bob')
    await userEvent.type(document.getElementById('register-password'), 'pw')
    await userEvent.click(screen.getByRole('button', { name: 'Daftar' }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    expect(register).toHaveBeenCalledWith({ name: 'Bob', username: 'bob', password: 'pw' })
    expect(showSuccessAlert).toHaveBeenCalledWith('done')
    expect(document.getElementById('register-submit')).toBeInTheDocument()
  })
})
