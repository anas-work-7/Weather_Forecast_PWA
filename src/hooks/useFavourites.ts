import { useCallback, useState } from 'react'
import { MAX_FAVOURITES, STORAGE_KEYS } from '../constants'
import type { City } from '../types/city'
import { isStorageAvailable, readStorage, writeStorage } from '../utils/storage'

export interface UseFavouritesResult {
  favourites: City[]
  storageAvailable: boolean
  isFavourite: (city: City) => boolean
  canAddMore: boolean
  addFavourite: (city: City) => { ok: boolean; message: string }
  removeFavourite: (cityId: number) => void
}

export function useFavourites(): UseFavouritesResult {
  const storageAvailable = isStorageAvailable()
  const [favourites, setFavourites] = useState<City[]>(() => {
    return readStorage<City[]>(STORAGE_KEYS.favourites) ?? []
  })

  const persist = useCallback((next: City[]) => {
    setFavourites(next)
    writeStorage(STORAGE_KEYS.favourites, next)
  }, [])

  const isFavourite = useCallback(
    (city: City) =>
      favourites.some(
        (f) =>
          f.id === city.id ||
          (f.name === city.name &&
            f.countryCode === city.countryCode &&
            Math.abs(f.latitude - city.latitude) < 0.01),
      ),
    [favourites],
  )

  const addFavourite = useCallback(
    (city: City): { ok: boolean; message: string } => {
      if (isFavourite(city)) {
        return { ok: false, message: `${city.name} is already in your favourites.` }
      }
      if (favourites.length >= MAX_FAVOURITES) {
        return {
          ok: false,
          message: `You can save up to ${MAX_FAVOURITES} favourite cities. Remove one before adding another.`,
        }
      }
      persist([...favourites, city])
      return { ok: true, message: `${city.name} added to favourites.` }
    },
    [favourites, isFavourite, persist],
  )

  const removeFavourite = useCallback(
    (cityId: number) => {
      persist(favourites.filter((f) => f.id !== cityId))
    },
    [favourites, persist],
  )

  return {
    favourites,
    storageAvailable,
    isFavourite,
    canAddMore: favourites.length < MAX_FAVOURITES,
    addFavourite,
    removeFavourite,
  }
}
