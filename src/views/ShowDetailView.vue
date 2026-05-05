<script setup lang="ts">
/**
 * Show Detail View
 * Displays comprehensive information about a single TV show
 */

import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useShows, formatRating, stripHtml, formatDate, getYear } from '@/composables/useShows'
import AppHeader from '@/components/common/AppHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import type { Show } from '@/types/show'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { getShowById } = useShows()

const show = ref<Show | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

/** Fetch show data */
async function fetchShow() {
  isLoading.value = true
  error.value = null

  try {
    const showId = parseInt(props.id, 10)
    if (isNaN(showId)) {
      throw new Error('Invalid show ID')
    }
    show.value = await getShowById(showId)
    if (!show.value) {
      throw new Error('Show not found')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load show'
  } finally {
    isLoading.value = false
  }
}

// Fetch on mount and when ID changes
onMounted(fetchShow)
watch(() => props.id, fetchShow)

/** Computed properties */
const backgroundImage = computed(() => {
  return show.value?.image?.original || show.value?.image?.medium || null
})

const rating = computed(() => {
  return formatRating(show.value?.rating?.average ?? null)
})

const summary = computed(() => {
  return stripHtml(show.value?.summary ?? '')
})

const premiered = computed(() => {
  return show.value?.premiered ? formatDate(show.value.premiered) : 'Unknown'
})

const ended = computed(() => {
  return show.value?.ended ? formatDate(show.value.ended) : null
})

const year = computed(() => {
  return getYear(show.value?.premiered ?? null)
})

const scheduleDisplay = computed(() => {
  if (!show.value?.schedule) return 'N/A'
  const { days, time } = show.value.schedule
  if (days.length === 0 && !time) return 'N/A'
  const dayStr = days.length > 0 ? days.join(', ') : ''
  const timeStr = time ? ` at ${time}` : ''
  return dayStr + timeStr || 'N/A'
})

const networkDisplay = computed(() => {
  if (show.value?.network) {
    return show.value.network.name
  }
  if (show.value?.webChannel) {
    return show.value.webChannel.name
  }
  return 'N/A'
})

/** Navigate back */
function goBack() {
  router.back()
}

/** Handle search from header */
function handleSearch(query: string) {
  if (query.trim()) {
    router.push({ name: 'dashboard', query: { search: query } })
  }
}
</script>

<template>
  <div class="show-detail">
    <AppHeader @search="handleSearch" />

    <!-- Loading State -->
    <div v-if="isLoading" class="show-detail__loading">
      <LoadingSpinner size="lg" text="Loading show details..." />
    </div>

    <!-- Error State -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      title="Failed to load show"
      @retry="fetchShow"
    />

    <!-- Show Content -->
    <template v-else-if="show">
      <!-- Hero Section with Background -->
      <div
        class="show-detail__hero"
        :style="backgroundImage ? { '--bg-image': `url(${backgroundImage})` } : {}"
      >
        <div class="show-detail__hero-overlay"></div>
        <div class="show-detail__hero-content">
          <button class="show-detail__back-btn" @click="goBack" aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div class="show-detail__hero-info">
            <!-- Poster -->
            <div class="show-detail__poster">
              <img
                v-if="show.image?.medium"
                :src="show.image.medium"
                :alt="`${show.name} poster`"
                class="show-detail__poster-image"
              />
              <div v-else class="show-detail__poster-placeholder">
                <span>No Image</span>
              </div>
            </div>

            <!-- Info -->
            <div class="show-detail__info">
              <h1 class="show-detail__title">{{ show.name }}</h1>

              <div class="show-detail__meta">
                <span v-if="year !== 'Unknown'" class="show-detail__year">{{ year }}</span>
                <span v-if="show.rating?.average" class="show-detail__rating">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                  {{ rating }}
                </span>
                <span
                  class="show-detail__status"
                  :class="`show-detail__status--${show.status.toLowerCase()}`"
                >
                  {{ show.status }}
                </span>
              </div>

              <div v-if="show.genres.length > 0" class="show-detail__genres">
                <span v-for="genre in show.genres" :key="genre" class="show-detail__genre-tag">
                  {{ genre }}
                </span>
              </div>

              <p v-if="summary" class="show-detail__summary">{{ summary }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="show-detail__details">
        <div class="show-detail__details-grid">
          <div class="show-detail__detail-item">
            <span class="show-detail__detail-label">Network</span>
            <span class="show-detail__detail-value">{{ networkDisplay }}</span>
          </div>

          <div class="show-detail__detail-item">
            <span class="show-detail__detail-label">Schedule</span>
            <span class="show-detail__detail-value">{{ scheduleDisplay }}</span>
          </div>

          <div class="show-detail__detail-item">
            <span class="show-detail__detail-label">Runtime</span>
            <span class="show-detail__detail-value">
              {{ show.runtime ? `${show.runtime} min` : 'N/A' }}
            </span>
          </div>

          <div class="show-detail__detail-item">
            <span class="show-detail__detail-label">Premiered</span>
            <span class="show-detail__detail-value">{{ premiered }}</span>
          </div>

          <div v-if="ended" class="show-detail__detail-item">
            <span class="show-detail__detail-label">Ended</span>
            <span class="show-detail__detail-value">{{ ended }}</span>
          </div>

          <div class="show-detail__detail-item">
            <span class="show-detail__detail-label">Language</span>
            <span class="show-detail__detail-value">{{ show.language || 'N/A' }}</span>
          </div>

          <div class="show-detail__detail-item">
            <span class="show-detail__detail-label">Type</span>
            <span class="show-detail__detail-value">{{ show.type }}</span>
          </div>
        </div>

        <!-- External Links -->
        <div v-if="show.officialSite || show.externals.imdb" class="show-detail__links">
          <a
            v-if="show.officialSite"
            :href="show.officialSite"
            target="_blank"
            rel="noopener noreferrer"
            class="show-detail__link"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Official Site
          </a>
          <a
            v-if="show.externals.imdb"
            :href="`https://www.imdb.com/title/${show.externals.imdb}`"
            target="_blank"
            rel="noopener noreferrer"
            class="show-detail__link"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.815c.27 0 .44-.06.5-.165.06-.105.095-.345.095-.72V10.46c0-.36-.03-.595-.085-.71-.047-.105-.147-.162-.09-.162zm-3.45.005c-.083 0-.143.02-.18.06-.04.04-.06.105-.06.197v4.31c0 .1.02.17.06.21.04.04.1.06.18.06.07 0 .125-.02.16-.06.035-.04.055-.11.055-.21V9.85c0-.09-.02-.157-.055-.197-.035-.04-.09-.06-.16-.06zm-2.01-.13h.92v5.074h-.92V9.463z"
              />
              <path
                d="M3 3h18v18H3V3zm7.5 12.4c0 .27-.01.48-.03.63-.02.15-.07.285-.14.405a.718.718 0 01-.3.27c-.12.06-.28.09-.47.09h-1.5V7.265h1.5c.18 0 .34.03.47.09a.7.7 0 01.3.27c.07.12.12.255.14.405.02.15.03.36.03.63v6.74zm1.5-6.74c.48 0 .84.135 1.08.405.24.27.36.675.36 1.215v3.65c0 .54-.12.945-.36 1.215-.24.27-.6.405-1.08.405h-1.5V9.265h1.5c.24 0 .48.03.72.09-.24-.09-.48-.135-.72-.135-.18 0-.34.03-.47.09a.7.7 0 00-.3.27c-.07.12-.12.255-.14.405-.02.15-.03.36-.03.63v6.12c0 .09.03.165.09.225.06.06.135.09.225.09h.225c.09 0 .165-.03.225-.09.06-.06.09-.135.09-.225V9.265h.72v7.2c0 .27-.01.48-.03.63-.02.15-.07.285-.14.405a.718.718 0 01-.3.27c-.12.06-.28.09-.47.09h-1.5V7.265h1.5c.48 0 .84.135 1.08.405.24.27.36.675.36 1.215v.615c0 .54-.12.945-.36 1.215-.24.27-.6.405-1.08.405h-.72v1.74z"
              />
            </svg>
            IMDb
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.show-detail {
  min-height: 100vh;
  background-color: var(--color-background);
}

.show-detail__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
}

/* Hero Section */
.show-detail__hero {
  position: relative;
  min-height: 500px;
  background-color: var(--color-background-soft);
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center top;
}

.show-detail__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.7) 0%,
    rgba(15, 23, 42, 0.9) 60%,
    var(--color-background) 100%
  );
}

.show-detail__hero-content {
  position: relative;
  z-index: 1;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

.show-detail__back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
  transition: background-color var(--transition-fast);
}

.show-detail__back-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.show-detail__back-btn svg {
  width: 20px;
  height: 20px;
}

.show-detail__hero-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

/* Poster */
.show-detail__poster {
  flex-shrink: 0;
  width: 250px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.show-detail__poster-image {
  width: 100%;
  height: auto;
  display: block;
}

.show-detail__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  color: var(--color-text-muted);
}

/* Info */
.show-detail__info {
  flex: 1;
  padding-top: var(--spacing-md);
}

.show-detail__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.show-detail__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.show-detail__year {
  font-size: var(--font-size-lg);
  color: var(--color-text-soft);
}

.show-detail__rating {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(245, 158, 11, 0.2);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
}

.show-detail__rating svg {
  width: 16px;
  height: 16px;
}

.show-detail__status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.show-detail__status--running {
  background-color: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}

.show-detail__status--ended {
  background-color: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.show-detail__genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.show-detail__genre-tag {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-soft);
}

.show-detail__summary {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-soft);
  max-width: 700px;
}

/* Details Section */
.show-detail__details {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.show-detail__details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.show-detail__detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.show-detail__detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.show-detail__detail-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

/* Links */
.show-detail__links {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.show-detail__link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.show-detail__link:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border-hover);
  color: var(--color-primary);
}

.show-detail__link svg {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .show-detail__hero {
    min-height: auto;
  }

  .show-detail__hero-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .show-detail__poster {
    width: 180px;
  }

  .show-detail__info {
    padding-top: 0;
  }

  .show-detail__title {
    font-size: var(--font-size-2xl);
  }

  .show-detail__meta {
    justify-content: center;
  }

  .show-detail__genres {
    justify-content: center;
  }

  .show-detail__summary {
    text-align: left;
  }

  .show-detail__details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .show-detail__links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .show-detail__details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
