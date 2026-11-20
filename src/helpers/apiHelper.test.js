import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  apiRequest, getToken, setToken, removeToken, getUser, setUser, removeUser, clearSession,
} from './apiHelper'

const mockFetch = (impl) => vi.stubGlobal('fetch', vi.fn(impl))
const okRes = (json, extra = {}) => ({ ok: true, statusText: 'OK', json: async () => json, ...extra })

describe('apiHelper storage', () => {
  beforeEach(() => localStorage.clear())

  it('manages token', () => {
    expect(getToken()).toBeNull()
    setToken('abc')
    expect(getToken()).toBe('abc')
    removeToken()
    expect(getToken()).toBeNull()
  })

  it('manages user', () => {
    expect(getUser()).toBeNull()
    setUser({ id: 1 })
    expect(getUser()).toEqual({ id: 1 })
    localStorage.setItem('delcom_user', '{bad')
    expect(getUser()).toBeNull()
    removeUser()
    expect(getUser()).toBeNull()
  })

  it('clears session', () => {
    setToken('t')
    setUser({ id: 1 })
    clearSession()
    expect(getToken()).toBeNull()
    expect(getUser()).toBeNull()
  })
})

describe('apiRequest', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('sends json body with token and parses response', async () => {
    setToken('tok')
    mockFetch(async () => okRes({ status: 'success', message: 'hi', data: { a: 1 } }))
    const res = await apiRequest('/api/x', { method: 'POST', body: { q: 1 }, headers: { X: '1' } })
    expect(res).toEqual({ status: 'success', message: 'hi', data: { a: 1 } })
    const [path, init] = fetch.mock.calls[0]
    expect(path).toBe('/api/x')
    expect(init.headers.Authorization).toBe('Bearer tok')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(init.headers.X).toBe('1')
    expect(init.body).toBe('{"q":1}')
  })

  it('works without options, token or body', async () => {
    mockFetch(async () => okRes({ status: 'success', message: 'm', data: null }))
    await apiRequest('/api/x')
    const init = fetch.mock.calls[0][1]
    expect(init.headers.Authorization).toBeUndefined()
    expect(init.body).toBeUndefined()
  })

  it('passes FormData and string bodies unchanged', async () => {
    mockFetch(async () => okRes({}))
    const fd = new FormData()
    await apiRequest('/a', { method: 'POST', body: fd })
    expect(fetch.mock.calls[0][1].body).toBe(fd)
    expect(fetch.mock.calls[0][1].headers['Content-Type']).toBeUndefined()
    await apiRequest('/a', { method: 'POST', body: 'raw' })
    expect(fetch.mock.calls[1][1].body).toBe('raw')
  })

  it('applies defaults for missing json fields (ok and not ok)', async () => {
    mockFetch(async () => okRes({}))
    expect(await apiRequest('/a')).toEqual({ status: 'success', message: '', data: null })
    mockFetch(async () => okRes({}, { ok: false }))
    expect(await apiRequest('/a')).toEqual({ status: 'error', message: '', data: null })
  })

  it('handles non-json responses', async () => {
    const bad = (ok, statusText) => async () => ({ ok, statusText, json: async () => { throw new Error('x') } })
    mockFetch(bad(true, 'OK'))
    expect(await apiRequest('/a')).toEqual({ status: 'success', message: 'OK', data: null })
    mockFetch(bad(false, ''))
    expect(await apiRequest('/a')).toEqual({ status: 'error', message: '', data: null })
  })

  it('handles network errors', async () => {
    mockFetch(async () => { throw new Error('down') })
    expect(await apiRequest('/a')).toEqual({ status: 'error', message: 'down', data: null })
  })
})
