import { useState, useEffect, useCallback } from 'react'

export const THEME_KEY = 'delcom_theme'
export const ACCENT_KEY = 'delcom_accent'
export const ACCENTS = ['blue', 'emerald', 'rose', 'violet', 'amber']

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [accent, setAccentState] = useState(() => {
    const saved = localStorage.getItem(ACCENT_KEY)
    return ACCENTS.includes(saved) ? saved : ACCENTS[0]
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent)
    localStorage.setItem(ACCENT_KEY, accent)
  }, [accent])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )
  const setAccent = useCallback((value) => {
    if (ACCENTS.includes(value)) setAccentState(value)
  }, [])

  return { theme, isDark: theme === 'dark', toggleTheme, accent, setAccent, accents: ACCENTS }
}
