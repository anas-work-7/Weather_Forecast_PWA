import { STORAGE_KEYS } from '../constants'
import type { City } from '../types/city'
import type { WeatherData } from '../types/weather'
import { readStorage, writeStorage, removeStorage } from '../utils/storage'

export function cacheLastWeather(weather: WeatherData, city: City): void {
  writeStorage(STORAGE_KEYS.lastWeather, weather)
  writeStorage(STORAGE_KEYS.lastCity, city)
}

export function getCachedWeather(): WeatherData | null {
  return readStorage<WeatherData>(STORAGE_KEYS.lastWeather)
}

export function getCachedCity(): City | null {
  return readStorage<City>(STORAGE_KEYS.lastCity)
}

export function clearWeatherCache(): void {
  removeStorage(STORAGE_KEYS.lastWeather)
  removeStorage(STORAGE_KEYS.lastCity)
}
