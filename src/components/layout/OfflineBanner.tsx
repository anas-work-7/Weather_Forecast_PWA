import { WifiOff } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function OfflineBanner() {
  const { offline, weatherState } = useApp()
  if (!offline.isOffline) return null

  return (
    <div
      role="status"
      className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-100"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <WifiOff size={16} aria-hidden />
        <span>
          You are offline.
          {weatherState.fromCache || weatherState.weather
            ? ' Showing the last cached forecast. Changes will sync when you reconnect.'
            : ' Connect to the internet to load weather data.'}
        </span>
      </div>
    </div>
  )
}
