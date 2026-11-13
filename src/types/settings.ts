import type { TemperatureUnit } from './weather'

export type ThemePreference = 'dark' | 'light' | 'system'

export interface NotificationSettings {
  enabled: boolean
  reminderTime: string
  permission: NotificationPermission | 'unsupported'
}

export interface AppSettings {
  theme: ThemePreference
  unit: TemperatureUnit
  notifications: NotificationSettings
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  unit: 'celsius',
  notifications: {
    enabled: false,
    reminderTime: '08:00',
    permission: 'unsupported',
  },
}
