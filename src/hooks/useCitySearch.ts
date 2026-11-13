import { useEffect, useRef, useState } from 'react'
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../constants'
import { isGeoDbConfigured, searchCities } from '../services/geoDbApi'
import type { City } from '../types/city'
import { getSearchErrorMessage, validateCityQuery } from '../utils/validation'
import { useDebounce } from './useDebounce'

export function useCitySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const abortRef = useRef<AbortController | null>(null)
  const configured = isGeoDbConfigured()

  useEffect(() => {
    abortRef.current?.abort()

    if (!configured) {
      setResults([])
      setLoading(false)
      setError(
        'City search is not configured. Add VITE_GEODB_API_KEY and VITE_GEODB_API_HOST to your .env file, then restart the development server.',
      )
      return
    }

    const trimmed = debouncedQuery.trim()
    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setResults([])
      setLoading(false)
      if (touched && trimmed.length === 0) {
        setError(validateCityQuery(trimmed).message)
      } else {
        setError(null)
      }
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)

    searchCities(trimmed, controller.signal)
      .then((cities) => {
        setResults(cities)
        setOpen(true)
        if (cities.length === 0) {
          // setError(
          //   `No cities matched “${trimmed}”. Check the spelling or try a larger nearby city.`,
          // )
        }
      })
      .catch((err: unknown) => {
        const message = getSearchErrorMessage(err)
        if (message) {
          setResults([])
          setError(message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [debouncedQuery, configured, touched])

  const validate = () => {
    setTouched(true)
    const result = validateCityQuery(query)
    if (!result.valid) {
      setError(result.message)
      return false
    }
    return true
  }

  const clear = () => {
    setQuery('')
    setResults([])
    setError(null)
    setOpen(false)
  }

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    setError,
    open,
    setOpen,
    touched,
    setTouched,
    validate,
    clear,
    configured,
  }
}
