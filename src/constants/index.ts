export const APP_NAME = 'WeatherBoard'
export const APP_SHORT_NAME = 'WeatherBoard'

export const STORAGE_KEYS = {
  favourites: 'weatherboard:favourites',
  settings: 'weatherboard:settings',
  lastCity: 'weatherboard:last-city',
  lastWeather: 'weatherboard:last-weather',
} as const

export const MAX_FAVOURITES = 5

export const SEARCH_DEBOUNCE_MS = 300
export const MIN_SEARCH_LENGTH = 2

export const OPEN_METEO = {
  forecastUrl: 'https://api.open-meteo.com/v1/forecast',
  geocodeUrl: 'https://geocoding-api.open-meteo.com/v1/search',
} as const

export const GEODB = {
  baseUrl: 'https://wft-geo-db.p.rapidapi.com/v1/geo',
  minPopulation: 1000,
  limit: 8,
} as const

export const CACHE_NAMES = {
  appShell: 'weatherboard-shell-v1',
  weather: 'weatherboard-weather-v1',
} as const
