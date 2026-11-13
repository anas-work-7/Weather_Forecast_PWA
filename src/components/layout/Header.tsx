import { Moon, Settings, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CitySearch } from '../search/CitySearch'

export function Header() {
  const { theme, units, setSettingsOpen } = useApp()
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-violet)] shadow-lg shadow-blue-500/20"
              aria-hidden
            >
              <span className="text-lg font-bold text-white">W</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                WeatherBoard
              </p>
              <p className="text-xs text-[var(--text-muted)]">{today}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1"
              role="group"
              aria-label="Temperature unit"
            >
              <button
                type="button"
                className={`min-h-9 min-w-11 rounded-lg px-3 text-sm font-medium transition ${
                  units.unit === 'celsius'
                    ? 'bg-[var(--accent-blue)] text-white shadow'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-pressed={units.unit === 'celsius'}
                onClick={() => units.setUnit('celsius')}
              >
                °C
              </button>
              <button
                type="button"
                className={`min-h-9 min-w-11 rounded-lg px-3 text-sm font-medium transition ${
                  units.unit === 'fahrenheit'
                    ? 'bg-[var(--accent-blue)] text-white shadow'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-pressed={units.unit === 'fahrenheit'}
                onClick={() => units.setUnit('fahrenheit')}
              >
                °F
              </button>
            </div>

            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              aria-label={theme.resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={theme.toggleTheme}
            >
              {theme.resolved === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              aria-label="Open settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        <CitySearch />
      </div>
    </header>
  )
}
