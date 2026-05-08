/**
 * TVMaze API Service
 * Handles all HTTP requests to the TVMaze API
 * @see https://www.tvmaze.com/api
 */

import type { Show, SearchResult } from '@/types/show'

const BASE_URL = 'https://api.tvmaze.com'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic fetch wrapper with error handling
 * @param endpoint - API endpoint
 * @param options - Optional fetch options (including AbortSignal for cancellation)
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new ApiError(`API request failed: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    // Re-throw abort errors as-is so they can be caught specifically
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Fetches a paginated list of shows
 * @param page - Page number (0-indexed), each page contains 250 shows
 * @returns Array of shows
 */
export async function getShows(page: number = 0): Promise<Show[]> {
  return fetchApi<Show[]>(`/shows?page=${page}`)
}

/**
 * Fetches multiple pages of shows concurrently
 * @param pages - Number of pages to fetch (default: 3, ~750 shows)
 * @returns Combined array of shows from all pages
 */
export async function getShowsMultiplePages(pages: number = 3): Promise<Show[]> {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i)

  try {
    const results = await Promise.all(pageNumbers.map((page) => getShows(page)))
    return results.flat()
  } catch (error) {
    // If we get a 404, it means we've reached the end of available pages
    // Return what we have so far
    console.warn('Some pages may not be available:', error)
    return []
  }
}

/**
 * Fetches a single show by ID
 * @param id - Show ID
 * @returns Show details
 */
export async function getShowById(id: number): Promise<Show> {
  return fetchApi<Show>(`/shows/${id}`)
}

/**
 * Searches for shows by name
 * @param query - Search query
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Array of search results with scores
 */
export async function searchShows(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }
  return fetchApi<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}`, { signal })
}
