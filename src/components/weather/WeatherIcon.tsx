import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
  HelpCircle,
  Moon,
  Sun,
  CloudSun,
} from 'lucide-react'
import type { WeatherIconName } from '../../types/weather'

interface WeatherIconProps {
  name: WeatherIconName
  isDay?: boolean
  className?: string
  size?: number
}

export function WeatherIcon({ name, isDay = true, className = '', size = 48 }: WeatherIconProps) {
  const props = { size, className: `weather-icon ${className}`, strokeWidth: 1.5 }

  switch (name) {
    case 'clear':
      return isDay ? (
        <Sun {...props} className={`${props.className} text-amber-300`} />
      ) : (
        <Moon {...props} className={`${props.className} text-slate-200`} />
      )
    case 'partly-cloudy':
      return isDay ? (
        <CloudSun {...props} className={`${props.className} text-sky-300`} />
      ) : (
        <Cloudy {...props} className={`${props.className} text-slate-300`} />
      )
    case 'cloudy':
      return <Cloud {...props} className={`${props.className} text-slate-300`} />
    case 'fog':
      return <CloudFog {...props} className={`${props.className} text-slate-400`} />
    case 'drizzle':
      return <CloudDrizzle {...props} className={`${props.className} text-sky-400`} />
    case 'rain':
      return <CloudRain {...props} className={`${props.className} text-blue-400`} />
    case 'snow':
      return <CloudSnow {...props} className={`${props.className} text-cyan-200`} />
    case 'thunderstorm':
      return <CloudLightning {...props} className={`${props.className} text-violet-300`} />
    default:
      return <HelpCircle {...props} className={`${props.className} text-slate-400`} />
  }
}
