import { apiRequest } from '../../../helpers/apiHelper'

export const login = ({ username, password }) =>
  apiRequest('/api/auth/login', { method: 'POST', body: { username, password } })

export const register = ({ name, username, password }) =>
  apiRequest('/api/auth/register', { method: 'POST', body: { name, username, password } })

export const logout = () => apiRequest('/api/auth/logout', { method: 'POST' })

export const getProfile = () => apiRequest('/api/auth/profile')
