import { useEffect } from 'react'
import { FavouritesPanel } from './components/favourites/FavouritesPanel'
import { ForecastList } from './components/forecast/ForecastList'
import { Header } from './components/layout/Header'
import { OfflineBanner } from './components/layout/OfflineBanner'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { CurrentWeather } from './components/weather/CurrentWeather'
import { WeatherDetails } from './components/weather/WeatherDetails'
import { AppProvider, useApp } from './context/AppContext'
import { getCachedCity } from './services/cacheService'
import type { City } from './types/city'

const DEFAULT_CITY: City = {
  id: 2643743,
  name: 'London',
  region: 'England',
  country: 'United Kingdom',
  countryCode: 'GB',
  latitude: 51.5074,
  longitude: -0.1278,
}

function Dashboard() {
  const { weatherState, toast, selectCity } = useApp()

  useEffect(() => {
    if (weatherState.weather) return
    const cached = getCachedCity()
    selectCity(cached ?? DEFAULT_CITY)
    // Intentionally run once on mount to seed initial weather.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[var(--accent-blue)]/15 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-[var(--accent-violet)]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <OfflineBanner />
      <Header />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-8">
        <div className="space-y-6">
          <CurrentWeather />
          <WeatherDetails />
          <ForecastList />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <FavouritesPanel />
        </aside>
      </main>

      <SettingsPanel />

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] shadow-2xl"
        >
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
