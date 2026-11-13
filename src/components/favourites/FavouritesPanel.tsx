import { MapPin, Star, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { fetchWeatherForCity } from '../../services/weatherApi'
import { convertTemperature, formatTemperatureValue } from '../../utils/formatters'

export function FavouritesPanel() {
  const {
    favourites,
    selectCity,
    weatherState,
    units,
    favouriteTemps,
    setFavouriteTemp,
    showToast,
    offline,
  } = useApp()

  useEffect(() => {
    if (offline.isOffline) return
    let cancelled = false

    favourites.favourites.forEach((city) => {
      void fetchWeatherForCity(city, 'celsius')
        .then((data) => {
          if (!cancelled) setFavouriteTemp(city.id, data.current.temperature)
        })
        .catch(() => {
          if (!cancelled) setFavouriteTemp(city.id, null)
        })
    })

    return () => {
      cancelled = true
    }
  }, [favourites.favourites, offline.isOffline, setFavouriteTemp])

  const remove = (cityId: number, name: string) => {
    const confirmed = window.confirm(`Remove ${name} from favourites?`)
    if (!confirmed) return
    favourites.removeFavourite(cityId)
    showToast(`${name} removed from favourites.`)
  }

  return (
    <section aria-label="Favourite locations" className="panel">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Favourites
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {favourites.favourites.length}/5
        </span>
      </div>

      {!favourites.storageAvailable && (
        <p className="mb-3 text-xs text-amber-300">
          Local storage is unavailable in this browser, so favourites may not persist after refresh.
        </p>
      )}

      {favourites.favourites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--border)] px-4 py-10 text-center">
          <Star size={28} className="text-[var(--text-muted)]" aria-hidden />
          <p className="text-sm font-medium text-[var(--text-primary)]">No favourites yet</p>
          <p className="max-w-xs text-xs text-[var(--text-secondary)]">
            Search for a city, then tap Favourite to save up to five locations for quick switching.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {favourites.favourites.map((city) => {
            const active = weatherState.city?.id === city.id
            const rawTemp = favouriteTemps[city.id]
            const displayTemp =
              typeof rawTemp === 'number'
                ? formatTemperatureValue(convertTemperature(rawTemp, units.unit))
                : '—'

            return (
              <li key={city.id}>
                <div
                  className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition ${
                    active
                      ? 'border-[var(--accent-blue)]/50 bg-[var(--accent-blue)]/10'
                      : 'border-[var(--border)] bg-[var(--surface)]'
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg px-2 text-left transition hover:bg-[var(--surface-hover)]"
                    onClick={() => selectCity(city)}
                  >
                    <MapPin size={16} className="shrink-0 text-[var(--accent-blue)]" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
                        {city.name}
                      </span>
                      <span className="block truncate text-xs text-[var(--text-muted)]">
                        {city.country}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {displayTemp}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label={`Remove ${city.name} from favourites`}
                    onClick={() => remove(city.id, city.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
