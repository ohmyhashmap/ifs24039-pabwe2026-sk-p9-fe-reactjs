import { apiRequest } from '../../../helpers/apiHelper'

export const CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']
export const FILTER_CATEGORIES = ['Semua', ...CATEGORIES]

export const toList = (data) => {
  if (Array.isArray(data)) return data
  return (data && data.posts) || []
}

export const buildQuery = (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') return
    search.append(key, value)
  })
  const str = search.toString()
  return str ? `?${str}` : ''
}

export const getCategories = () => apiRequest('/api/public/categories')
export const getPublicPosts = (params) => apiRequest(`/api/public/posts${buildQuery(params)}`)
export const getPublicPostBySlug = (slug) =>
  apiRequest(`/api/public/posts/${encodeURIComponent(slug)}`)

export const getMyPosts = (params) => apiRequest(`/api/posts${buildQuery(params)}`)
export const getPostStats = () => apiRequest('/api/posts/stats')
export const getPostById = (id) => apiRequest(`/api/posts/${id}`)
export const createPost = (payload) => apiRequest('/api/posts', { method: 'POST', body: payload })
export const updatePost = (id, payload) =>
  apiRequest(`/api/posts/${id}`, { method: 'PUT', body: payload })
export const deletePost = (id) => apiRequest(`/api/posts/${id}`, { method: 'DELETE' })
export const togglePublish = (id) =>
  apiRequest(`/api/posts/${id}/toggle-publish`, { method: 'PATCH' })
export const aiGenerate = (payload) =>
  apiRequest('/api/posts/ai-generate', { method: 'POST', body: payload })
