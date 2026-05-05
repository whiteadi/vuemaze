/**
 * Shows composable
 * Handles fetching, caching, and organizing TV shows by genre
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { getShowsMultiplePages, getShowById } from '@/services/tvmazeApi'
import type { Show, GenreGroup } from '@/types/show'

/** Genres to display (in order) */
const FEATURED_GENRES = [
  'Drama',
  'Comedy',
  'Action',
  'Science-Fiction',
  'Thriller',
  'Romance',
  'Crime',
  'Horror',
  'Adventure',
  'Fantasy',
  'Mystery',
  'Family',
]

/** Maximum shows per genre row */
const MAX_SHOWS_PER_GENRE = 20

/** Minimum rating to include a show */
const MIN_RATING = 5

/** Cache for shows data */
let showsCache: Show[] | null = null

/**
 * Composable for managing TV shows data
 */
export function useShows(): {
  shows: Ref<Show[]>
  genreGroups: ComputedRef<GenreGroup[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchShows: () => Promise<void>
  getShowById: (id: number) => Promise<Show | null>
} {
  const shows = ref<Show[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Groups shows by genre and sorts by rating
   */
  const genreGroups = computed<GenreGroup[]>(() => {
    const groups: Map<string, Show[]> = new Map()

    // Initialize groups for featured genres
    FEATURED_GENRES.forEach((genre) => {
      groups.set(genre, [])
    })

    // Group shows by genre
    shows.value.forEach((show) => {
      // Only include shows with a rating
      if (!show.rating?.average || show.rating.average < MIN_RATING) {
        return
      }

      show.genres.forEach((genre) => {
        if (groups.has(genre)) {
          const genreShows = groups.get(genre)!
          // Avoid duplicates
          if (!genreShows.some((s) => s.id === show.id)) {
            genreShows.push(show)
          }
        }
      })
    })

    // Sort each genre by rating and limit
    const result: GenreGroup[] = []

    FEATURED_GENRES.forEach((genre) => {
      const genreShows = groups.get(genre) || []

      // Sort by rating (highest first)
      const sortedShows = genreShows
        .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
        .slice(0, MAX_SHOWS_PER_GENRE)

      // Only include genres that have shows
      if (sortedShows.length > 0) {
        result.push({
          name: genre,
          shows: sortedShows,
        })
      }
    })

    return result
  })

  /**
   * Fetches shows from API (with caching)
   */
  async function fetchShows(): Promise<void> {
    // Return cached data if available
    if (showsCache) {
      shows.value = showsCache
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await getShowsMultiplePages(3)
      shows.value = data
      showsCache = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch shows'
      console.error('Error fetching shows:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches a single show by ID
   */
  async function fetchShowById(id: number): Promise<Show | null> {
    // First check cache
    const cachedShow = showsCache?.find((s) => s.id === id)
    if (cachedShow) {
      return cachedShow
    }

    try {
      return await getShowById(id)
    } catch (err) {
      console.error('Error fetching show:', err)
      return null
    }
  }

  return {
    shows,
    genreGroups,
    isLoading,
    error,
    fetchShows,
    getShowById: fetchShowById,
  }
}

/**
 * Formats a show's rating for display
 */
export function formatRating(rating: number | null): string {
  if (rating === null) return 'N/A'
  return rating.toFixed(1)
}

/**
 * Strips HTML tags from summary
 */
export function stripHtml(html: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Formats a date string for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Gets the year from a date string
 */
export function getYear(dateString: string | null): string {
  if (!dateString) return 'Unknown'
  return new Date(dateString).getFullYear().toString()
}