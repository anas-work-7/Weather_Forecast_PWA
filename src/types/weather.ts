export type TemperatureUnit = 'celsius' | 'fahrenheit'

export interface WeatherCondition {
  code: number
  label: string
  icon: WeatherIconName
  isDay: boolean
}

export type WeatherIconName =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown'

export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  visibility: number | null
  uvIndex: number | null
  weatherCode: number
  isDay: boolean
  time: string
}

export interface DailyForecast {
  date: string
  weatherCode: number
  tempMin: number
  tempMax: number
  sunrise: string
  sunset: string
}

export interface WeatherData {
  latitude: number
  longitude: number
  timezone: string
  current: CurrentWeather
  daily: DailyForecast[]
  city: {
    name: string
    country: string
    region?: string
  }
  fetchedAt: string
}

export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    weather_code: number
    surface_pressure: number
    wind_speed_10m: number
    wind_direction_10m: number
    visibility?: number
    uv_index?: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    sunrise: string[]
    sunset: string[]
    uv_index_max?: number[]
  }
  current_units?: Record<string, string>
}

export interface OpenMeteoGeocodeResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
  timezone?: string
}

export interface OpenMeteoGeocodeResponse {
  results?: OpenMeteoGeocodeResult[]
  generationtime_ms?: number
}
