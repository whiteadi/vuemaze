/**
 * Search composable
 * Handles search functionality with debouncing
 * Uses Vue best practices: computed for derived state, AbortController for cleanup
 */

import { ref, watch, computed, onWatcherCleanup, type Ref, type ComputedRef } from 'vue'
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
  hasResults: ComputedRef<boolean>
  clearSearch: () => void
} {
  const query = ref('')
  const results = ref<Show[]>([])
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  // Derived state should be computed, not manually synced (Vue best practice)
  const hasResults = computed(() => results.value.length > 0)

  // Debounce the query to avoid too many API calls
  const debouncedQuery = useDebouncedRef(query, 300)

  // Watch for debounced query changes with cleanup for cancelled requests
  watch(debouncedQuery, async (newQuery) => {
    const trimmedQuery = newQuery.trim()

    // Clear results if query is empty
    if (!trimmedQuery) {
      results.value = []
      error.value = null
      return
    }

    // Don't search for very short queries
    if (trimmedQuery.length < 2) {
      return
    }

    // Create AbortController for this request
    const controller = new AbortController()

    // Cleanup function - called before next watch trigger (Vue 3.5+ best practice)
    // This cancels pending requests when user types fast
    onWatcherCleanup(() => {
      controller.abort()
    })

    isSearching.value = true
    error.value = null

    try {
      const searchResults = await searchShows(trimmedQuery)

      // Check if this request was aborted before updating state
      if (!controller.signal.aborted) {
        results.value = searchResults.map((result) => result.show)
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      if (!controller.signal.aborted) {
        error.value = err instanceof Error ? err.message : 'Search failed'
        results.value = []
        console.error('Search error:', err)
      }
    } finally {
      if (!controller.signal.aborted) {
        isSearching.value = false
      }
    }
  })

  /**
   * Clears the search query and results
   */
  function clearSearch(): void {
    query.value = ''
    results.value = []
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
