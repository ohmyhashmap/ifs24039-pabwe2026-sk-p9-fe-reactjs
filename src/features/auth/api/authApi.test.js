import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../helpers/apiHelper', () => ({ apiRequest: vi.fn(async () => ({ status: 'success' })) }))
import { apiRequest } from '../../../helpers/apiHelper'
import { login, register, logout, getProfile } from './authApi'

describe('authApi', () => {
  beforeEach(() => apiRequest.mockClear())

  it('login', async () => {
    await login({ username: 'u', password: 'p' })
    expect(apiRequest).toHaveBeenCalledWith('/api/auth/login', { method: 'POST', body: { username: 'u', password: 'p' } })
  })
  it('register', async () => {
    await register({ name: 'n', username: 'u', password: 'p' })
    expect(apiRequest).toHaveBeenCalledWith('/api/auth/register', { method: 'POST', body: { name: 'n', username: 'u', password: 'p' } })
  })
  it('logout', async () => {
    await logout()
    expect(apiRequest).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
  })
  it('getProfile', async () => {
    await getProfile()
    expect(apiRequest).toHaveBeenCalledWith('/api/auth/profile')
  })
})
