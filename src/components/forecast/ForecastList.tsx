import { useApp } from '../../context/AppContext'
import { ForecastCard } from './ForecastCard'

export function ForecastList() {
  const { weatherState, units } = useApp()
  const weather = weatherState.weather
  if (!weather) return null

  const days = weather.daily.slice(0, 5)

  return (
    <section aria-label="Five-day forecast">
      <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        5-day forecast
      </h3>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
        {days.map((day) => (
          <ForecastCard key={day.date} day={day} unit={units.unit} />
        ))}
      </div>
    </section>
  )
}
