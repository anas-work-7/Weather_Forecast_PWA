# PROMPTS.md — WeatherBoard AI development log

**IDE:** Cursor  
**Project:** WeatherBoard (Edspire Frontend React technical challenge)  
**Rule:** Chronological record of significant AI development prompts. No fabricated history.

---

## 2026-11-13 — Initial full build request

### Prompt (summary)

Build a complete production-quality premium weather dashboard (“WeatherBoard”) for an Edspire Frontend (React) hiring challenge, implementing every mandatory requirement: React 19, Vite, TypeScript, Tailwind, Lucide, Open-Meteo, GeoDB via RapidAPI, localStorage favourites, PWA (manifest + service worker + offline), Notifications API with honest limitations, dark/light theme, °C/°F, README + PROMPTS.md + `.env.example`, Vercel readiness.

Provided RapidAPI credentials for configuration via environment variables:
- Host: `wft-geo-db.p.rapidapi.com`
- Key stored in `.env` as `VITE_GEODB_API_KEY` (not in source)

### Implementation decisions

1. Scaffolded with Vite React-TS template; added Tailwind v4 (`@tailwindcss/vite`) and `lucide-react`.
2. Separated API logic into `src/services/weatherApi.ts` and `src/services/geoDbApi.ts`.
3. Used App Context + focused hooks (`useWeather`, `useCitySearch`, `useFavourites`, `useTheme`, `useUnits`, `useOffline`, `useNotifications`) instead of prop drilling.
4. Open-Meteo temperatures stored as Celsius; unit toggle converts in the UI without refetch.
5. GeoDB autocomplete: 300ms debounce, AbortController, keyboard navigation, accessible errors.
6. Favourites: max 5, duplicate prevention, confirm-before-remove, graceful localStorage failure.
7. PWA: custom `service-worker.js` with shell cache + network-first weather cache (success only); last weather also in localStorage.
8. Notifications: explain benefit → request permission only on enable; local reminder scheduling while app is usable; documented push-server limitation clearly in UI and README.
9. Design system: midnight navy / charcoal, electric blue + soft violet accents, Outfit + Manrope typography, restrained glass surfaces.

### AI-generated issues and fixes

| Issue | Fix |
|---|---|
| Vite scaffold included unused `App.css` / default SVGs | Removed unused assets; styles centralized in `index.css` |
| Generated app icon arrived as JPG | Converted to `icon-192.png` and `icon-512.png` with `sharp` |
| Weather API TypeScript import clutter | Cleaned `weatherApi.ts` imports to use `City` type only where needed |
| `React.KeyboardEvent` namespace usage without import | Switched CitySearch to explicit `KeyboardEvent` / `FormEvent` type imports |
| Risk of inventing visibility/UV | Only render those detail cards when API values exist |
| Notification over-claim risk | Explicit Settings + README limitation about closed-browser push |

### Follow-up prompts

_None yet — this file will be appended for every significant subsequent AI prompt in this project._
