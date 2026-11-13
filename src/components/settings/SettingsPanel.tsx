import { Bell, BellOff, Check, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { ThemePreference } from '../../types/settings'

export function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, notifications, units, theme, showToast } = useApp()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!settingsOpen) return null

  const onToggleReminders = async () => {
    if (notifications.settings.enabled) {
      notifications.disableReminders()
      setStatusMessage('Weather reminders turned off.')
      return
    }

    setBusy(true)
    const result = await notifications.enableReminders(notifications.settings.reminderTime)
    setStatusMessage(result.message)
    showToast(result.message)
    setBusy(false)
  }

  const onTest = async () => {
    const result = await notifications.testNotification()
    setStatusMessage(result.message)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close settings"
        onClick={() => setSettingsOpen(false)}
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 id="settings-title" className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Settings
          </h2>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Appearance
            </h3>
            <div className="space-y-3">
              <label className="block text-sm text-[var(--text-secondary)]">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'system'] as ThemePreference[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm capitalize transition ${
                      theme.preference === option
                        ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/15 text-[var(--text-primary)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                    onClick={() => theme.setPreference(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Temperature unit
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`min-h-11 rounded-xl border px-3 text-sm transition ${
                  units.unit === 'celsius'
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/15 text-[var(--text-primary)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
                onClick={() => units.setUnit('celsius')}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                className={`min-h-11 rounded-xl border px-3 text-sm transition ${
                  units.unit === 'fahrenheit'
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/15 text-[var(--text-primary)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
                onClick={() => units.setUnit('fahrenheit')}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Notifications
            </h3>
            <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Enable a daily weather reminder so you can check conditions before heading out. Permission
                is requested only when you turn reminders on.
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  {notifications.settings.enabled ? (
                    <Bell size={16} className="text-[var(--accent-blue)]" />
                  ) : (
                    <BellOff size={16} className="text-[var(--text-muted)]" />
                  )}
                  Daily reminder
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.settings.enabled}
                  disabled={busy || notifications.settings.permission === 'unsupported'}
                  className={`relative h-7 w-12 rounded-full transition ${
                    notifications.settings.enabled ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-strong)]'
                  }`}
                  onClick={() => void onToggleReminders()}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white transition ${
                      notifications.settings.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div>
                <label htmlFor="reminder-time" className="mb-2 block text-sm text-[var(--text-secondary)]">
                  Reminder time
                </label>
                <input
                  id="reminder-time"
                  type="time"
                  value={notifications.settings.reminderTime}
                  onChange={(e) => notifications.setReminderTime(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/30"
                />
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                Permission: <span className="text-[var(--text-secondary)]">{notifications.settings.permission}</span>
              </p>

              {notifications.settings.permission === 'granted' && (
                <button type="button" className="btn-secondary w-full" onClick={() => void onTest()}>
                  <Check size={16} /> Send test notification
                </button>
              )}

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-xs text-amber-100/90">
                <strong className="font-medium text-amber-100">Limitation:</strong> A browser-only app
                can show local reminders while WeatherBoard is open (or the service worker is active).
                Guaranteed delivery when the browser is fully closed requires a push service and server —
                not included in this client-only build.
              </div>

              {statusMessage && (
                <p role="status" className="text-sm text-[var(--text-secondary)]">
                  {statusMessage}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
