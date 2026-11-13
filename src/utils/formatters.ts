import type { TemperatureUnit } from '../types/weather'

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  const symbol = unit === 'celsius' ? '°C' : '°F'
  return `${Math.round(value)}${symbol}`
}

export function formatTemperatureValue(value: number): string {
  return `${Math.round(value)}°`
}

/** Convert Celsius ↔ Fahrenheit for display without refetching. */
export function convertTemperature(valueC: number, unit: TemperatureUnit): number {
  if (unit === 'celsius') return valueC
  return (valueC * 9) / 5 + 32
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371
    return `${Math.round(mph)} mph`
  }
  return `${Math.round(kmh)} km/h`
}

export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`
}

export function formatVisibility(metres: number | null): string | null {
  if (metres === null || Number.isNaN(metres)) return null
  if (metres >= 1000) return `${(metres / 1000).toFixed(1)} km`
  return `${Math.round(metres)} m`
}

export function formatHumidity(value: number): string {
  return `${Math.round(value)}%`
}

export function formatUvIndex(value: number | null): string | null {
  if (value === null || Number.isNaN(value)) return null
  const rounded = Math.round(value * 10) / 10
  let level = 'Low'
  if (rounded >= 11) level = 'Extreme'
  else if (rounded >= 8) level = 'Very high'
  else if (rounded >= 6) level = 'High'
  else if (rounded >= 3) level = 'Moderate'
  return `${rounded} · ${level}`
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(undefined, options ?? {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDayName(date: string): string {
  const d = new Date(date + 'T12:00:00')
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

export function formatTime(iso: string, timezone?: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone,
    })
  } catch {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })
  }
}

export function formatLocalDateTime(timezone: string): { date: string; time: string } {
  const now = new Date()
  try {
    return {
      date: now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      }),
      time: now.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone,
      }),
    }
  } catch {
    return {
      date: now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      time: now.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }),
    }
  }
}
