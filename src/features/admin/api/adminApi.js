import { apiRequest } from '../../../helpers/apiHelper'

export const getUsers = () => apiRequest('/api/admin/users')
export const getAllPosts = () => apiRequest('/api/admin/posts')
export const getUserPosts = (id) => apiRequest(`/api/admin/users/${id}/posts`)
