import { Droplets, Eye, Gauge, Navigation, SunMedium, Wind } from 'lucide-react'
import type { ReactNode } from 'react'
import { useApp } from '../../context/AppContext'
import {
  formatHumidity,
  formatPressure,
  formatUvIndex,
  formatVisibility,
  formatWindSpeed,
} from '../../utils/formatters'
import { getWindDirectionLabel } from '../../utils/weatherCodes'

interface DetailItem {
  label: string
  value: string
  icon: ReactNode
}

export function WeatherDetails() {
  const { weatherState, units } = useApp()
  const weather = weatherState.weather
  if (!weather) return null

  const { current } = weather
  const visibility = formatVisibility(current.visibility)
  const uv = formatUvIndex(current.uvIndex)

  const items: DetailItem[] = [
    {
      label: 'Humidity',
      value: formatHumidity(current.humidity),
      icon: <Droplets size={18} className="text-sky-400" aria-hidden />,
    },
    {
      label: 'Wind speed',
      value: formatWindSpeed(current.windSpeed, units.unit),
      icon: <Wind size={18} className="text-cyan-300" aria-hidden />,
    },
    {
      label: 'Wind direction',
      value: `${getWindDirectionLabel(current.windDirection)} · ${Math.round(current.windDirection)}°`,
      icon: <Navigation size={18} className="text-blue-300" aria-hidden />,
    },
    {
      label: 'Pressure',
      value: formatPressure(current.pressure),
      icon: <Gauge size={18} className="text-violet-300" aria-hidden />,
    },
  ]

  if (visibility) {
    items.push({
      label: 'Visibility',
      value: visibility,
      icon: <Eye size={18} className="text-emerald-300" aria-hidden />,
    })
  }

  if (uv) {
    items.push({
      label: 'UV index',
      value: uv,
      icon: <SunMedium size={18} className="text-amber-300" aria-hidden />,
    })
  }

  return (
    <section aria-label="Weather details">
      <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Conditions
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <article key={item.label} className="detail-card">
            <div className="mb-3 flex items-center gap-2 text-[var(--text-muted)]">
              {item.icon}
              <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
