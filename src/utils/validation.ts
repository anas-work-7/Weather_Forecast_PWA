export interface ValidationResult {
  valid: boolean
  message: string | null
}

export function validateCityQuery(query: string): ValidationResult {
  const trimmed = query.trim()

  if (!trimmed) {
    return {
      valid: false,
      message: 'Enter a city name to search. Try something like “London” or “Tokyo”.',
    }
  }

  if (trimmed.length < 2) {
    return {
      valid: false,
      message: 'Type at least 2 characters so we can find matching cities.',
    }
  }

  return { valid: true, message: null }
}

export function getSearchErrorMessage(error: unknown): string {
  if (error instanceof TypeError || (error instanceof Error && /network|fetch|failed/i.test(error.message))) {
    return 'We could not reach the city search service. Check your internet connection and try again.'
  }

  if (error instanceof Error) {
    if (error.message === 'CONFIG_MISSING') {
      return 'City search is not configured. Add VITE_GEODB_API_KEY and VITE_GEODB_API_HOST to your .env file, then restart the development server.'
    }
    if (error.message === 'RATE_LIMIT') {
      return 'Too many city searches in a short time. Wait a few seconds, then try again.'
    }
    if (error.message === 'UNAUTHORIZED') {
      return 'The GeoDB API key was rejected. Verify VITE_GEODB_API_KEY in your .env file.'
    }
    if (error.message === 'ABORTED') {
      return ''
    }
  }

  return 'City search failed unexpectedly. Wait a moment and try typing again.'
}

export function getWeatherErrorMessage(error: unknown): string {
  if (error instanceof TypeError || (error instanceof Error && /network|fetch|failed/i.test(error.message))) {
    return 'We could not load weather data. Check your connection, then tap Retry.'
  }

  if (error instanceof Error) {
    if (error.message === 'NOT_FOUND') {
      return 'No weather data was found for this location. Try another city from the search results.'
    }
    if (error.message === 'ABORTED') {
      return ''
    }
  }

  return 'Weather data could not be loaded. Tap Retry to request a fresh forecast.'
}
