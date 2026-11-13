/* WeatherBoard service worker — app-shell + last-weather caching */
const SHELL_CACHE = 'weatherboard-shell-v1'
const WEATHER_CACHE = 'weatherboard-weather-v1'
const SHELL_ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== WEATHER_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

function isWeatherApi(url) {
  return (
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('geocoding-api.open-meteo.com')
  )
}

function isGeoDbApi(url) {
  return url.hostname.includes('rapidapi.com') || url.hostname.includes('geo-db')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Never cache GeoDB / RapidAPI responses in the SW (auth + freshness).
  if (isGeoDbApi(url)) return

  // Weather API: network-first, cache only successful responses.
  if (isWeatherApi(url)) {
    event.respondWith(networkFirstWeather(request))
    return
  }

  // App shell / same-origin: cache-first with network fallback.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstShell(request))
  }
})

async function networkFirstWeather(request) {
  const cache = await caches.open(WEATHER_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      await cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function cacheFirstShell(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE)
      await cache.put(request, response.clone())
    }
    return response
  } catch {
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html')
      if (fallback) return fallback
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' })
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow('/')
      return undefined
    }),
  )
})
