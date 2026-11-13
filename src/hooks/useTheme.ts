import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../constants'
import type { ThemePreference } from '../types/settings'
import { readStorage, writeStorage } from '../utils/storage'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    return readStorage<ThemePreference>(`${STORAGE_KEYS.settings}:theme`) ?? 'dark'
  })
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => {
    const pref = readStorage<ThemePreference>(`${STORAGE_KEYS.settings}:theme`) ?? 'dark'
    return pref === 'system' ? getSystemTheme() : pref
  })

  useEffect(() => {
    const next = preference === 'system' ? getSystemTheme() : preference
    setResolved(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.classList.toggle('light', next === 'light')
    document.documentElement.dataset.theme = next
    writeStorage(`${STORAGE_KEYS.settings}:theme`, preference)
  }, [preference])

  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolved(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [preference])

  const setPreference = (value: ThemePreference) => setPreferenceState(value)
  const toggleTheme = () => {
    setPreferenceState((prev) => {
      const current = prev === 'system' ? getSystemTheme() : prev
      return current === 'dark' ? 'light' : 'dark'
    })
  }

  return { preference, resolved, setPreference, toggleTheme }
}
