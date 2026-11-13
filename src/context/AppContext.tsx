import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useFavourites } from '../hooks/useFavourites'
import { useNotifications } from '../hooks/useNotifications'
import { useOffline } from '../hooks/useOffline'
import { useTheme } from '../hooks/useTheme'
import { useUnits } from '../hooks/useUnits'
import { useWeather } from '../hooks/useWeather'
import type { City } from '../types/city'

interface AppContextValue {
  theme: ReturnType<typeof useTheme>
  units: ReturnType<typeof useUnits>
  offline: ReturnType<typeof useOffline>
  favourites: ReturnType<typeof useFavourites>
  notifications: ReturnType<typeof useNotifications>
  weatherState: ReturnType<typeof useWeather>
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  selectCity: (city: City) => void
  favouriteTemps: Record<number, number | null>
  setFavouriteTemp: (cityId: number, temp: number | null) => void
  toast: string | null
  showToast: (message: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const units = useUnits()
  const offline = useOffline()
  const favourites = useFavourites()
  const notifications = useNotifications()
  const weatherState = useWeather({ unit: units.unit, isOffline: offline.isOffline })
  const { loadWeather } = weatherState
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [favouriteTemps, setFavouriteTemps] = useState<Record<number, number | null>>({})
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const setFavouriteTemp = useCallback((cityId: number, temp: number | null) => {
    setFavouriteTemps((prev) => ({ ...prev, [cityId]: temp }))
  }, [])

  const selectCity = useCallback(
    (city: City) => {
      void loadWeather(city)
    },
    [loadWeather],
  )

  const value = useMemo(
    () => ({
      theme,
      units,
      offline,
      favourites,
      notifications,
      weatherState,
      settingsOpen,
      setSettingsOpen,
      selectCity,
      favouriteTemps,
      setFavouriteTemp,
      toast,
      showToast,
    }),
    [
      theme,
      units,
      offline,
      favourites,
      notifications,
      weatherState,
      settingsOpen,
      selectCity,
      favouriteTemps,
      setFavouriteTemp,
      toast,
      showToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
