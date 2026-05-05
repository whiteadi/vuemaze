/**
 * Search composable
 * Handles search functionality with debouncing
 */

import { ref, watch, type Ref } from 'vue'
import { searchShows } from '@/services/tvmazeApi'
import { useDebouncedRef } from './useDebounce'
import type { Show } from '@/types/show'

/**
 * Composable for searching TV shows
 */
export function useSearch(): {
  query: Ref<string>
  results: Ref<Show[]>
  isSearching: Ref<boolean>
  error: Ref<string | null>
  hasResults: Ref<boolean>
  clearSearch: () => void
} {
  const query = ref('')
  const results = ref<Show[]>([])
  const isSearching = ref(false)
  const error = ref<string | null>(null)
  const hasResults = ref(false)

  // Debounce the query to avoid too many API calls
  const debouncedQuery = useDebouncedRef(query, 300)

  // Watch for debounced query changes
  watch(debouncedQuery, async (newQuery) => {
    const trimmedQuery = newQuery.trim()

    // Clear results if query is empty
    if (!trimmedQuery) {
      results.value = []
      hasResults.value = false
      error.value = null
      return
    }

    // Don't search for very short queries
    if (trimmedQuery.length < 2) {
      return
    }

    isSearching.value = true
    error.value = null

    try {
      const searchResults = await searchShows(trimmedQuery)
      results.value = searchResults.map((result) => result.show)
      hasResults.value = results.value.length > 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Search failed'
      results.value = []
      hasResults.value = false
      console.error('Search error:', err)
    } finally {
      isSearching.value = false
    }
  })

  /**
   * Clears the search query and results
   */
  function clearSearch(): void {
    query.value = ''
    results.value = []
    hasResults.value = false
    error.value = null
  }

  return {
    query,
    results,
    isSearching,
    error,
    hasResults,
    clearSearch,
  }
}