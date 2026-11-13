# WeatherBoard

Premium weather dashboard built for the Edspire Frontend (React) developer technical challenge.

Live forecasts, city autocomplete, favourites, offline PWA support, and notification preferences — designed as a polished consumer SaaS experience.

**Live deployment URL:** _Add your Vercel URL after deployment_

---

## Features

- Live current weather and 5-day forecast via **Open-Meteo**
- City autocomplete via **GeoDB Cities (RapidAPI)**
- Favourite cities (max 5) persisted in `localStorage`
- Celsius / Fahrenheit toggle with client-side conversion
- Dark / light / system theme preference
- Progressive Web App (manifest + service worker + offline cache)
- Offline banner with last-viewed city weather restore
- Notification reminder preferences (browser Notifications API)
- Responsive layout for mobile (375px), tablet (768px), and desktop (1280px+)
- Accessible search with keyboard navigation and clear validation messages

## Technologies

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- Lucide React
- Open-Meteo API
- GeoDB Cities API (RapidAPI)
- Service Workers + Web App Manifest
- Browser Notifications API
- Vercel-ready static deployment

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and add your RapidAPI GeoDB key

# 3. Start the development server
npm run dev

# 4. Production build
npm run build
npm run preview
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_GEODB_API_KEY` | RapidAPI key for GeoDB Cities |
| `VITE_GEODB_API_HOST` | RapidAPI host (`wft-geo-db.p.rapidapi.com`) |

See `.env.example`. API keys are never hardcoded in source.

If the GeoDB key is missing, the search UI shows a clear configuration message and does **not** invent fake city suggestions.

## API documentation

### Open-Meteo (weather)

- Forecast: `https://api.open-meteo.com/v1/forecast`
- Used for current conditions, daily min/max, weather codes, humidity, wind, pressure, visibility, UV (daily max), sunrise/sunset
- No API key required
- Temperature is fetched in Celsius and converted client-side for °F display

### GeoDB Cities (autocomplete)

- Base: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`
- Headers: `X-RapidAPI-Key`, `X-RapidAPI-Host`
- Debounced live search (300ms)
- Returns city, region, and country

## Architecture decisions

- **Service layer separation** — `src/services/` owns HTTP; components never call APIs directly.
- **Custom hooks** — favourites, weather, search, theme, units, offline, and notifications are reusable hooks.
- **App context** — shared dashboard state without deep prop drilling.
- **Celsius storage** — Open-Meteo responses stay in °C; unit changes update the UI without refetching.
- **AbortController** — in-flight weather and search requests are cancelled when superseded.
- **Honest notifications** — local reminders while the app/service worker can run; closed-browser push is documented as requiring a push server (not faked).
- **Cache discipline** — service worker caches successful weather responses only; failed responses are never treated as valid weather data.

```
src/
  components/   layout, weather, forecast, search, favourites, settings, ui
  hooks/        reusable state & side-effect logic
  services/     Open-Meteo, GeoDB, local weather cache
  types/        TypeScript interfaces
  utils/        formatters, weather codes, validation, storage
  constants/    app-wide constants
  context/      AppProvider
public/
  icons/        192 & 512 PWA icons
  manifest.webmanifest
  service-worker.js
```

## PWA setup

- Manifest: `public/manifest.webmanifest` (name, short_name, theme_color, standalone, icons)
- Icons: `public/icons/icon-192.png`, `public/icons/icon-512.png`
- Service worker: `public/service-worker.js`
  - App-shell caching
  - Network-first weather caching (success only)
  - Offline navigation fallback to cached shell
- Registration in `src/main.tsx`
- Last viewed city weather also mirrored in `localStorage` for instant restore

## Known limitations

1. **Closed-browser push notifications** — without a push service (VAPID + backend), the browser cannot guarantee scheduled delivery when fully closed. WeatherBoard implements permission flow, reminder preferences, local scheduling while open, and service-worker notification display. This limitation is also shown in Settings.
2. **GeoDB rate limits** — RapidAPI free tiers may throttle frequent typing; the UI surfaces a clear retry message.
3. **Visibility / UV** — shown only when Open-Meteo returns them; values are never invented.
4. **Private browsing** — `localStorage` may be unavailable; favourites warn and degrade gracefully.

## Deployment (Vercel)

1. Push the repository to GitHub (do **not** commit `.env`).
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables in the Vercel project settings:
   - `VITE_GEODB_API_KEY`
   - `VITE_GEODB_API_HOST`
4. Framework preset: Vite. Build command: `npm run build`. Output: `dist`.
5. Deploy. `vercel.json` is included for SPA rewrites and service-worker headers.

```bash
npx vercel
```

After deploy, paste the production URL into the placeholder at the top of this README.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint |

## License

Built for technical evaluation — Edspire Frontend (React) challenge.
