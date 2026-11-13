# WeatherBoard — Engineering Development Log

## Project Overview

WeatherBoard is a React-based weather dashboard
developed as part of the Edspire Frontend Technical Challenge.

## Technical Implementation

### Architecture

- React 19 with TypeScript and Vite.
- Context API for shared application state.
- Custom hooks for reusable application logic.
- Dedicated API service modules.

### API Integration

- Open-Meteo for weather data.
- GeoDB for city search and autocomplete.
- Environment variables for API configuration.

### Engineering Decisions

- Celsius-based internal temperature handling.
- Debounced city search with AbortController.
- Local persistence for favourite cities.
- Offline caching with service workers.
- Accessible keyboard navigation and error handling.

## AI-Assisted Development

Cursor AI tools were used as development assistants for
implementation suggestions, debugging, and code review.
Generated suggestions were reviewed and adapted
during development.
