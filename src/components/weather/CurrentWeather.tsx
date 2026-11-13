import { Heart, HeartOff, RefreshCw, Sunrise, Sunset } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import {
  convertTemperature,
  formatLocalDateTime,
  formatTemperature,
  formatTime,
} from '../../utils/formatters'
import { getWeatherCondition } from '../../utils/weatherCodes'
import { Spinner } from '../ui/Spinner'
import { WeatherIcon } from './WeatherIcon'

export function CurrentWeather() {
  const { weatherState, units, favourites, showToast, selectCity } = useApp()
  const { weather, city, loading, error, retry, fromCache } = weatherState
  const [clock, setClock] = useState(() =>
    weather ? formatLocalDateTime(weather.timezone) : { date: '', time: '' },
  )

  useEffect(() => {
    if (!weather) return
    const tick = () => setClock(formatLocalDateTime(weather.timezone))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [weather])

  if (loading && !weather) {
    return (
      <section className="weather-panel flex min-h-[280px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--text-secondary)]">
          <Spinner className="size-8 border-[3px]" />
          <p>Loading forecast…</p>
        </div>
      </section>
    )
  }

  if (!weather || !city) {
    return (
      <section className="weather-panel">
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 px-4 text-center">
          <WeatherIcon name="partly-cloudy" size={56} className="opacity-70" />
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Search for a city
          </h2>
          <p className="max-w-md text-sm text-[var(--text-secondary)]">
            Start typing in the search bar to find a location and load live weather from Open-Meteo.
          </p>
          {error && (
            <div className="mt-2 max-w-md">
              <p role="alert" className="text-sm text-rose-400">
                {error}
              </p>
              <button type="button" className="btn-secondary mt-3" onClick={retry}>
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          )}
        </div>
      </section>
    )
  }

  const condition = getWeatherCondition(weather.current.weatherCode, weather.current.isDay)
  const temp = convertTemperature(weather.current.temperature, units.unit)
  const feels = convertTemperature(weather.current.feelsLike, units.unit)
  const isFav = favourites.isFavourite(city)
  const today = weather.daily[0]

  const toggleFavourite = () => {
    if (isFav) {
      const confirmed = window.confirm(`Remove ${city.name} from favourites?`)
      if (!confirmed) return
      favourites.removeFavourite(city.id)
      showToast(`${city.name} removed from favourites.`)
      return
    }
    const result = favourites.addFavourite(city)
    showToast(result.message)
  }

  return (
    <section className="weather-panel weather-panel-enter relative overflow-hidden">
      {loading && (
        <div className="absolute right-4 top-4 text-[var(--accent-blue)]">
          <Spinner />
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                {weather.city.name}
              </h2>
              <p className="mt-1 text-[var(--text-secondary)]">
                {[weather.city.region, weather.city.country].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {clock.date} · {clock.time}
                {fromCache ? ' · Cached' : ''}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost"
                aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
                onClick={toggleFavourite}
              >
                {isFav ? <HeartOff size={18} /> : <Heart size={18} />}
                <span className="hidden sm:inline">{isFav ? 'Unfavourite' : 'Favourite'}</span>
              </button>
              <button type="button" className="btn-ghost" onClick={retry} aria-label="Refresh weather">
                <RefreshCw size={18} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div className="flex items-center gap-4">
              <WeatherIcon
                name={condition.icon}
                isDay={condition.isDay}
                size={72}
                className="weather-icon-lg"
              />
              <div>
                <p className="font-display text-6xl font-semibold tracking-tighter text-[var(--text-primary)] sm:text-7xl">
                  {formatTemperature(temp, units.unit)}
                </p>
                <p className="mt-1 text-lg text-[var(--text-secondary)]">{condition.label}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Feels like {formatTemperature(feels, units.unit)}
          </p>

          {today && (
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <Sunrise size={16} className="text-amber-300" aria-hidden />
                Sunrise {formatTime(today.sunrise, weather.timezone)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Sunset size={16} className="text-orange-300" aria-hidden />
                Sunset {formatTime(today.sunset, weather.timezone)}
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <p role="alert" className="flex-1 text-sm text-rose-300">
            {error}
          </p>
          <button type="button" className="btn-secondary" onClick={() => (city ? selectCity(city) : retry())}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}
    </section>
  )
}
