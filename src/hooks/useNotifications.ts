import { useCallback, useEffect, useRef, useState } from 'react'
import { STORAGE_KEYS } from '../constants'
import type { NotificationSettings } from '../types/settings'
import { readStorage, writeStorage } from '../utils/storage'

function getInitialPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}

const DEFAULT: NotificationSettings = {
  enabled: false,
  reminderTime: '08:00',
  permission: getInitialPermission(),
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    return readStorage<NotificationSettings>(`${STORAGE_KEYS.settings}:notifications`) ?? {
      ...DEFAULT,
      permission: getInitialPermission(),
    }
  })
  const timerRef = useRef<number | null>(null)

  const persist = useCallback((next: NotificationSettings) => {
    setSettings(next)
    writeStorage(`${STORAGE_KEYS.settings}:notifications`, next)
  }, [])

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const showReminder = useCallback(async () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const title = 'WeatherBoard Reminder'
    const body = 'Time to check today’s forecast on WeatherBoard.'
    const options: NotificationOptions = {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'weatherboard-reminder',
    }

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration()
        if (reg) {
          await reg.showNotification(title, options)
          return
        }
      }
      new Notification(title, options)
    } catch {
      // Notification failure must never break the dashboard.
    }
  }, [])

  const scheduleNextReminder = useCallback(
    (reminderTime: string) => {
      clearTimer()
      if (!settings.enabled || Notification.permission !== 'granted') return

      const [hours, minutes] = reminderTime.split(':').map(Number)
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return

      const now = new Date()
      const target = new Date()
      target.setHours(hours, minutes, 0, 0)
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1)
      }

      const delay = target.getTime() - now.getTime()
      timerRef.current = window.setTimeout(() => {
        void showReminder()
        scheduleNextReminder(reminderTime)
      }, delay)
    },
    [settings.enabled, showReminder],
  )

  useEffect(() => {
    if (settings.enabled && settings.permission === 'granted') {
      scheduleNextReminder(settings.reminderTime)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [settings.enabled, settings.permission, settings.reminderTime, scheduleNextReminder])

  const enableReminders = useCallback(
    async (reminderTime: string) => {
      if (!('Notification' in window)) {
        persist({
          ...settings,
          enabled: false,
          permission: 'unsupported',
          reminderTime,
        })
        return {
          ok: false,
          message:
            'This browser does not support notifications. You can still use WeatherBoard normally; reminders are unavailable here.',
        }
      }

      let permission = Notification.permission
      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }

      if (permission === 'denied') {
        persist({
          ...settings,
          enabled: false,
          permission: 'denied',
          reminderTime,
        })
        return {
          ok: false,
          message:
            'Notification permission was denied. Enable notifications for this site in your browser settings if you want reminders.',
        }
      }

      if (permission === 'granted') {
        persist({
          ...settings,
          enabled: true,
          permission: 'granted',
          reminderTime,
        })
        return {
          ok: true,
          message:
            'Reminders enabled. You will receive a local reminder while WeatherBoard is open in a browser tab. Closed-browser push delivery requires a push server and is not available in this client-only build.',
        }
      }

      return { ok: false, message: 'Could not enable notifications in this browser.' }
    },
    [persist, settings],
  )

  const disableReminders = useCallback(() => {
    clearTimer()
    persist({ ...settings, enabled: false })
  }, [persist, settings])

  const setReminderTime = useCallback(
    (reminderTime: string) => {
      persist({ ...settings, reminderTime })
    },
    [persist, settings],
  )

  const testNotification = useCallback(async () => {
    if (settings.permission !== 'granted') {
      return {
        ok: false,
        message: 'Enable reminders and grant permission before sending a test notification.',
      }
    }
    await showReminder()
    return { ok: true, message: 'Test notification sent.' }
  }, [settings.permission, showReminder])

  return {
    settings,
    enableReminders,
    disableReminders,
    setReminderTime,
    testNotification,
  }
}
