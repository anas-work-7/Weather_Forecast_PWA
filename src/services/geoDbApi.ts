import { GEODB } from '../constants'
import type { City, GeoDbSearchResponse } from '../types/city'

function getConfig(): { apiKey: string; apiHost: string } | null {
  const apiKey = import.meta.env.VITE_GEODB_API_KEY as string | undefined
  const apiHost = import.meta.env.VITE_GEODB_API_HOST as string | undefined

  if (!apiKey || !apiHost || apiKey === 'your_rapidapi_key_here') {
    return null
  }

  return { apiKey, apiHost }
}

export function isGeoDbConfigured(): boolean {
  return getConfig() !== null
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const config = getConfig()
  if (!config) {
    throw new Error('CONFIG_MISSING')
  }

  const params = new URLSearchParams({
    namePrefix: query.trim(),
    limit: String(GEODB.limit),
    offset: '0',
    sort: '-population',
    types: 'CITY',
  })

  const url = `${GEODB.baseUrl}/cities?${params.toString()}`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': config.apiKey,
        'X-RapidAPI-Host': config.apiHost,
      },
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('ABORTED')
    }
    throw error
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('UNAUTHORIZED')
  }

  if (response.status === 429) {
    throw new Error('RATE_LIMIT')
  }

  if (!response.ok) {
    throw new Error(`GeoDB request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as GeoDbSearchResponse

  return (payload.data ?? []).map((item) => ({
    id: item.id,
    name: item.city || item.name,
    region: item.region || item.regionCode || '',
    country: item.country,
    countryCode: item.countryCode,
    latitude: item.latitude,
    longitude: item.longitude,
  }))
}
