export interface City {
  id: number
  name: string
  region: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
}

export interface GeoDbCityResponse {
  id: number
  city: string
  name: string
  region: string
  regionCode: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  population?: number
}

export interface GeoDbSearchResponse {
  data: GeoDbCityResponse[]
  metadata?: {
    currentOffset: number
    totalCount: number
  }
}
