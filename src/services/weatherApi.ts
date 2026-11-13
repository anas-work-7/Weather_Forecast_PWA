import { OPEN_METEO } from '../constants'
import type { City } from '../types/city'
import type {
  DailyForecast,
  OpenMeteoResponse,
  TemperatureUnit,
  WeatherData,
} from '../types/weather'

export interface WeatherLocationInput {
  name: string
  country: string
  region?: string
  latitude: number
  longitude: number
}

/** Open-Meteo always returns Celsius; we convert client-side for unit toggles. */
export async function fetchWeather(
  location: WeatherLocationInput,
  _unit: TemperatureUnit = 'celsius',
  signal?: AbortSignal,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '6',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
  })

  const url = `${OPEN_METEO.forecastUrl}?${params.toString()}`

  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('ABORTED')
    }
    throw error
  }

  if (!response.ok) {
    if (response.status === 404) throw new Error('NOT_FOUND')
    throw new Error(`Weather request failed with status ${response.status}`)
  }

  const data = (await response.json()) as OpenMeteoResponse

  if (!data.current || !data.daily) {
    throw new Error('NOT_FOUND')
  }

  const uvFromDaily =
    data.daily.uv_index_max && data.daily.uv_index_max.length > 0
      ? data.daily.uv_index_max[0]
      : null

  const daily: DailyForecast[] = data.daily.time.slice(0, 5).map((date, index) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    tempMin: data.daily.temperature_2m_min[index],
    tempMax: data.daily.temperature_2m_max[index],
    sunrise: data.daily.sunrise[index],
    sunset: data.daily.sunset[index],
  }))

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.surface_pressure,
      visibility:
        typeof data.current.visibility === 'number' ? data.current.visibility : null,
      uvIndex:
        typeof data.current.uv_index === 'number' ? data.current.uv_index : uvFromDaily,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    daily,
    city: {
      name: location.name,
      country: location.country,
      region: location.region,
    },
    fetchedAt: new Date().toISOString(),
  }
}

export function cityToLocation(city: City): WeatherLocationInput {
  return {
    name: city.name,
    country: city.country,
    region: city.region,
    latitude: city.latitude,
    longitude: city.longitude,
  }
}

export async function fetchWeatherForCity(
  city: City,
  unit: TemperatureUnit,
  signal?: AbortSignal,
): Promise<WeatherData> {
  return fetchWeather(cityToLocation(city), unit, signal)
}
