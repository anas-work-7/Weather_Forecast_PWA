import type { DailyForecast } from '../../types/weather'
import type { TemperatureUnit } from '../../types/weather'
import { convertTemperature, formatDayName, formatTemperatureValue } from '../../utils/formatters'
import { getWeatherCondition } from '../../utils/weatherCodes'
import { WeatherIcon } from '../weather/WeatherIcon'

interface ForecastCardProps {
  day: DailyForecast
  unit: TemperatureUnit
}

export function ForecastCard({ day, unit }: ForecastCardProps) {
  const condition = getWeatherCondition(day.weatherCode, true)
  const min = convertTemperature(day.tempMin, unit)
  const max = convertTemperature(day.tempMax, unit)

  return (
    <article className="forecast-card min-w-[140px] flex-1">
      <p className="text-sm font-medium text-[var(--text-primary)]">{formatDayName(day.date)}</p>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
        {new Date(day.date + 'T12:00:00').toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}
      </p>
      <div className="my-4 flex justify-center">
        <WeatherIcon name={condition.icon} size={36} />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">{condition.label}</p>
      <p className="mt-3 flex items-baseline justify-center gap-2 text-sm">
        <span className="font-semibold text-[var(--text-primary)]">
          {formatTemperatureValue(max)}
        </span>
        <span className="text-[var(--text-muted)]">{formatTemperatureValue(min)}</span>
      </p>
    </article>
  )
}
