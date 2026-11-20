import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTheme from './useTheme'

const mockPrefers = (dark) =>
  vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({ matches: dark, media: q }))

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-accent')
  })
  afterEach(() => vi.restoreAllMocks())

  it('defaults to light and first accent', () => {
    mockPrefers(false)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
    expect(result.current.accent).toBe('blue')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.getAttribute('data-accent')).toBe('blue')
  })

  it('follows system dark preference', () => {
    mockPrefers(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('uses saved values', () => {
    mockPrefers(false)
    localStorage.setItem('delcom_theme', 'dark')
    localStorage.setItem('delcom_accent', 'rose')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(result.current.accent).toBe('rose')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles theme and sets accent', () => {
    mockPrefers(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('delcom_theme')).toBe('dark')
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    act(() => result.current.setAccent('violet'))
    expect(result.current.accent).toBe('violet')
    act(() => result.current.setAccent('invalid'))
    expect(result.current.accent).toBe('violet')
    expect(result.current.accents).toContain('amber')
  })
})
