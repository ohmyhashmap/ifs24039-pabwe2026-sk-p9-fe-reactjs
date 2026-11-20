import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useInput from './useInput'

describe('useInput', () => {
  it('uses default empty initial value', () => {
    const { result } = renderHook(() => useInput())
    expect(result.current[0]).toBe('')
  })

  it('handles events, raw values, reset and setter', () => {
    const { result } = renderHook(() => useInput('a'))
    act(() => result.current[1]({ target: { value: 'b' } }))
    expect(result.current[0]).toBe('b')
    act(() => result.current[1]('c'))
    expect(result.current[0]).toBe('c')
    act(() => result.current[1](''))
    expect(result.current[0]).toBe('')
    act(() => result.current[3]('z'))
    expect(result.current[0]).toBe('z')
    act(() => result.current[2]())
    expect(result.current[0]).toBe('a')
  })
})
