import { MapPin, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { useCitySearch } from '../../hooks/useCitySearch'
import type { City } from '../../types/city'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Spinner } from '../ui/Spinner'

export function CitySearch() {
  const { selectCity } = useApp()
  const search = useCitySearch()
  const listId = useId()
  const errorId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    setActiveIndex(-1)
  }, [search.results])

  const { setOpen } = search
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [setOpen])

  const select = (city: City) => {
    selectCity(city)
    search.clear()
    search.setQuery(`${city.name}, ${city.country}`)
    search.setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      search.setOpen(false)
      setActiveIndex(-1)
      return
    }

    if (!search.open || search.results.length === 0) {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (!search.validate()) return
        if (search.results.length === 1) select(search.results[0])
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % search.results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i <= 0 ? search.results.length - 1 : i - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (!search.validate()) return
      const chosen = activeIndex >= 0 ? search.results[activeIndex] : search.results[0]
      if (chosen) select(chosen)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!search.validate()) return
    if (search.results.length > 0) {
      select(activeIndex >= 0 ? search.results[activeIndex] : search.results[0])
    } else if (!search.loading) {
      // search.setError(
      //   search.query.trim()
      //     ? `No cities matched “${search.query.trim()}”. Check the spelling or try a larger nearby city.`
      //     : 'Enter a city name to search. Try something like “London” or “Tokyo”.',
      // )
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={onSubmit} role="search" noValidate>
        <label htmlFor="city-search" className="sr-only">
          Search for a city
        </label>
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            aria-hidden
          />
          <input
            id="city-search"
            type="search"
            autoComplete="off"
            placeholder="Search city…"
            value={search.query}
            onChange={(e) => {
              search.setQuery(e.target.value)
              search.setOpen(true)
              search.setTouched(true)
            }}
            onBlur={() => search.setTouched(true)}
            onFocus={() => {
              if (search.results.length > 0) search.setOpen(true)
            }}
            onKeyDown={onKeyDown}
            aria-invalid={Boolean(search.error)}
            aria-describedby={search.error ? errorId : undefined}
            aria-controls={listId}
            aria-expanded={search.open}
            aria-autocomplete="list"
            role="combobox"
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-10 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/30"
          />
          {search.loading ? (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-blue)]">
              <Spinner />
            </span>
          ) : search.query ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              onClick={() => search.clear()}
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </form>

      <ErrorMessage id={errorId} message={search.error} />

      {search.open && search.results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-xl"
        >
          {search.results.map((city, index) => (
            <li key={`${city.id}-${city.latitude}`} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  index === activeIndex
                    ? 'bg-[var(--accent-blue)]/15 text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(city)}
              >
                <MapPin size={16} className="shrink-0 text-[var(--accent-blue)]" aria-hidden />
                <span>
                  <span className="font-medium text-[var(--text-primary)]">{city.name}</span>
                  <span className="text-[var(--text-muted)]">
                    {city.region ? `, ${city.region}` : ''} · {city.country}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
