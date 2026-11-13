import { useCallback, useEffect, useRef, useState } from 'react'
import { cacheLastWeather, getCachedCity, getCachedWeather } from '../services/cacheService'
import { fetchWeatherForCity } from '../services/weatherApi'
import type { City } from '../types/city'
import type { TemperatureUnit, WeatherData } from '../types/weather'
import { getWeatherErrorMessage } from '../utils/validation'

interface UseWeatherOptions {
  unit: TemperatureUnit
  isOffline: boolean
}

export function useWeather({ unit, isOffline }: UseWeatherOptions) {
  const [city, setCity] = useState<City | null>(() => getCachedCity())
  const [weather, setWeather] = useState<WeatherData | null>(() => getCachedWeather())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const loadWeather = useCallback(
    async (nextCity: City, options?: { silent?: boolean }) => {
      abortRef.current?.abort()

      if (isOffline) {
        const cached = getCachedWeather()
        const cachedCity = getCachedCity()
        if (cached && cachedCity) {
          setCity(cachedCity)
          setWeather(cached)
          setFromCache(true)
          setError(
            'You are offline. Showing the last saved forecast for this city. Reconnect to refresh.',
          )
          return
        }
        setError(
          'You are offline and no cached weather is available yet. Connect to the internet, search for a city, then try again.',
        )
        return
      }

      const controller = new AbortController()
      abortRef.current = controller
      if (!options?.silent) setLoading(true)
      setError(null)
      setFromCache(false)
      setCity(nextCity)

      try {
        const data = await fetchWeatherForCity(nextCity, unit, controller.signal)
        setWeather(data)
        cacheLastWeather(data, nextCity)
      } catch (err) {
        const message = getWeatherErrorMessage(err)
        if (!message) return

        const cached = getCachedWeather()
        if (cached && cached.city.name === nextCity.name) {
          setWeather(cached)
          setFromCache(true)
          setError(`${message} Showing the last saved forecast meanwhile.`)
        } else {
          setError(message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    },
    [isOffline, unit],
  )

  const retry = useCallback(() => {
    if (city) void loadWeather(city)
  }, [city, loadWeather])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  return {
    city,
    weather,
    loading,
    error,
    fromCache,
    loadWeather,
    retry,
    setError,
  }
}
