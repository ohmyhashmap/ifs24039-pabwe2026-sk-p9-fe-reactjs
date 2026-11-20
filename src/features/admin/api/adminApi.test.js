import { describe, it, expect, vi } from 'vitest'

vi.mock('../../../helpers/apiHelper', () => ({ apiRequest: vi.fn(async () => ({ status: 'success' })) }))
import { apiRequest } from '../../../helpers/apiHelper'
import { getUsers, getAllPosts, getUserPosts } from './adminApi'

describe('adminApi', () => {
  it('calls admin endpoints', () => {
    getUsers()
    expect(apiRequest).toHaveBeenLastCalledWith('/api/admin/users')
    getAllPosts()
    expect(apiRequest).toHaveBeenLastCalledWith('/api/admin/posts')
    getUserPosts(5)
    expect(apiRequest).toHaveBeenLastCalledWith('/api/admin/users/5/posts')
  })
})
