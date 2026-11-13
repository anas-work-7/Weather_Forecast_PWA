/**
 * Safe localStorage helpers. Failures (private mode, quota, disabled storage)
 * are handled gracefully without throwing into the UI.
 */

export function readStorage<T>(key: string): T | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof localStorage === 'undefined') return false
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key: string): boolean {
  try {
    if (typeof localStorage === 'undefined') return false
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function isStorageAvailable(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false
    const probe = '__wb_probe__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}
