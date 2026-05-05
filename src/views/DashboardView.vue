<script setup lang="ts">
/**
 * Dashboard View
 * Main page displaying TV shows organized by genre
 */

import { onMounted } from 'vue'
import { useShows } from '@/composables/useShows'
import { useSearch } from '@/composables/useSearch'
import AppHeader from '@/components/common/AppHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import GenreRow from '@/components/shows/GenreRow.vue'
import ShowCard from '@/components/shows/ShowCard.vue'

const { genreGroups, isLoading, error, fetchShows } = useShows()
const { query, results, isSearching, hasResults } = useSearch()

// Fetch shows on mount
onMounted(() => {
  fetchShows()
})

function handleSearch(searchQuery: string) {
  query.value = searchQuery
}

function handleRetry() {
  fetchShows()
}
</script>

<template>
  <div class="dashboard">
    <AppHeader show-search @search="handleSearch" />

    <main class="dashboard__content">
      <!-- Search Results -->
      <section v-if="query.trim()" class="dashboard__search-results">
        <h2 class="dashboard__section-title">
          Search results for "{{ query }}"
        </h2>

        <div v-if="isSearching" class="dashboard__loading">
          <LoadingSpinner size="md" text="Searching..." />
        </div>

        <div v-else-if="hasResults" class="dashboard__search-grid">
          <ShowCard v-for="show in results" :key="show.id" :show="show" />
        </div>

        <p v-else-if="query.trim().length >= 2" class="dashboard__no-results">
          No shows found for "{{ query }}". Try a different search term.
        </p>

        <p v-else class="dashboard__no-results">
          Enter at least 2 characters to search.
        </p>
      </section>

      <!-- Genre Rows (Main Dashboard) -->
      <template v-else>
        <!-- Loading State -->
        <div v-if="isLoading" class="dashboard__loading">
          <LoadingSpinner size="lg" text="Loading shows..." />
        </div>

        <!-- Error State -->
        <ErrorMessage
          v-else-if="error"
          :message="error"
          title="Failed to load shows"
          @retry="handleRetry"
        />

        <!-- Shows by Genre -->
        <div v-else class="dashboard__genres">
          <GenreRow
            v-for="group in genreGroups"
            :key="group.name"
            :title="group.name"
            :shows="group.shows"
          />
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard__content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.dashboard__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.dashboard__section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg);
  padding: 0 var(--spacing-md);
}

.dashboard__search-results {
  padding: 0 var(--spacing-md);
}

.dashboard__search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
}

.dashboard__no-results {
  text-align: center;
  color: var(--color-text-soft);
  font-size: var(--font-size-lg);
  padding: var(--spacing-3xl) var(--spacing-md);
}

.dashboard__genres {
  display: flex;
  flex-direction: column;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard__content {
    padding: var(--spacing-md) 0;
  }

  .dashboard__section-title {
    font-size: var(--font-size-xl);
    padding: 0 var(--spacing-sm);
  }

  .dashboard__search-results {
    padding: 0 var(--spacing-sm);
  }
}
</style>