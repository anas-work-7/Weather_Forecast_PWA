import { useCallback, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const existing = readStorage<T>(key)
    return existing ?? initialValue
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value
        writeStorage(key, next)
        return next
      })
    },
    [key],
  )

  return [storedValue, setValue] as const
}
