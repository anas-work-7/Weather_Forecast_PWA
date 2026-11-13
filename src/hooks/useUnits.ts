import { useCallback, useState } from 'react'
import { STORAGE_KEYS } from '../constants'
import type { TemperatureUnit } from '../types/weather'
import { readStorage, writeStorage } from '../utils/storage'

export function useUnits() {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => {
    return readStorage<TemperatureUnit>(`${STORAGE_KEYS.settings}:unit`) ?? 'celsius'
  })

  const setUnit = useCallback((next: TemperatureUnit) => {
    setUnitState(next)
    writeStorage(`${STORAGE_KEYS.settings}:unit`, next)
  }, [])

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')
  }, [setUnit, unit])

  return { unit, setUnit, toggleUnit }
}
