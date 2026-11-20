const TOKEN_KEY = 'delcom_token'
const USER_KEY = 'delcom_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const removeUser = () => localStorage.removeItem(USER_KEY)

export const clearSession = () => {
  removeToken()
  removeUser()
}

export const getApiUrl = (path) => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  return `${base}${path}`
}

export async function apiRequest(path, options = {}) {
  const { headers = {}, body, ...rest } = options
  const finalHeaders = { ...headers }
  const token = getToken()
  if (token) finalHeaders.Authorization = `Bearer ${token}`

  let finalBody = body
  if (body !== undefined && !(body instanceof FormData) && typeof body !== 'string') {
    finalBody = JSON.stringify(body)
    finalHeaders['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(getApiUrl(path), { ...rest, headers: finalHeaders, body: finalBody })
  } catch (err) {
    return { status: 'error', message: err.message, data: null }
  }

  let json
  try {
    json = await response.json()
  } catch {
    return {
      status: response.ok ? 'success' : 'error',
      message: response.statusText || '',
      data: null,
    }
  }
  return {
    status: json.status ?? (response.ok ? 'success' : 'error'),
    message: json.message ?? '',
    data: json.data ?? null,
  }
}