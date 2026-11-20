import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../helpers/apiHelper', () => ({ apiRequest: vi.fn(async () => ({ status: 'success' })) }))
import { apiRequest } from '../../../helpers/apiHelper'
import * as api from './blogApi'

describe('blogApi helpers', () => {
  it('exposes categories', () => {
    expect(api.FILTER_CATEGORIES[0]).toBe('Semua')
    expect(api.FILTER_CATEGORIES).toHaveLength(7)
  })

  it('toList normalizes data', () => {
    expect(api.toList([1])).toEqual([1])
    expect(api.toList({ posts: [2] })).toEqual([2])
    expect(api.toList({})).toEqual([])
    expect(api.toList(null)).toEqual([])
  })

  it('buildQuery skips empty values', () => {
    expect(api.buildQuery()).toBe('')
    expect(api.buildQuery({ a: undefined, b: null, c: '', d: 'x y', e: 0 })).toBe('?d=x+y&e=0')
  })
})

describe('blogApi endpoints', () => {
  beforeEach(() => apiRequest.mockClear())

  it('calls public endpoints', () => {
    api.getCategories()
    expect(apiRequest).toHaveBeenLastCalledWith('/api/public/categories')
    api.getPublicPosts()
    expect(apiRequest).toHaveBeenLastCalledWith('/api/public/posts')
    api.getPublicPosts({ search: 'a' })
    expect(apiRequest).toHaveBeenLastCalledWith('/api/public/posts?search=a')
    api.getPublicPostBySlug('hello world')
    expect(apiRequest).toHaveBeenLastCalledWith('/api/public/posts/hello%20world')
  })

  it('calls author endpoints', () => {
    api.getMyPosts()
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts')
    api.getPostStats()
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts/stats')
    api.getPostById(3)
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts/3')
    api.createPost({ a: 1 })
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts', { method: 'POST', body: { a: 1 } })
    api.updatePost(3, { a: 2 })
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts/3', { method: 'PUT', body: { a: 2 } })
    api.deletePost(3)
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts/3', { method: 'DELETE' })
    api.togglePublish(3)
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts/3/toggle-publish', { method: 'PATCH' })
    api.aiGenerate({ topic: 't' })
    expect(apiRequest).toHaveBeenLastCalledWith('/api/posts/ai-generate', { method: 'POST', body: { topic: 't' } })
  })
})
