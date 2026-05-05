<script setup lang="ts">
/**
 * ShowCard Component
 * Displays a single TV show as a card with poster, title, and rating
 * Reusable across dashboard and search results
 */

import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Show } from '@/types/show'
import { formatRating } from '@/composables/useShows'

const props = defineProps<{
  show: Show
}>()

/** Computed image URL with fallback */
const imageUrl = computed(() => {
  return props.show.image?.medium || props.show.image?.original || null
})

/** Computed rating display */
const rating = computed(() => {
  return formatRating(props.show.rating?.average ?? null)
})

/** Has valid rating */
const hasRating = computed(() => {
  return props.show.rating?.average !== null && props.show.rating?.average !== undefined
})
</script>

<template>
  <RouterLink
    :to="{ name: 'show-detail', params: { id: show.id } }"
    class="show-card"
    :aria-label="`View details for ${show.name}`"
  >
    <div class="show-card__image-container">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="`${show.name} poster`"
        class="show-card__image"
        loading="lazy"
      />
      <div v-else class="show-card__placeholder">
        <span class="show-card__placeholder-text">No Image</span>
      </div>

      <!-- Rating badge -->
      <div v-if="hasRating" class="show-card__rating">
        <svg
          class="show-card__rating-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
        <span class="show-card__rating-value">{{ rating }}</span>
      </div>
    </div>

    <div class="show-card__content">
      <h3 class="show-card__title">{{ show.name }}</h3>
      <p v-if="show.premiered" class="show-card__year">
        {{ new Date(show.premiered).getFullYear() }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped>
.show-card {
  display: block;
  width: var(--card-width);
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-fast);
}

.show-card:hover {
  transform: scale(1.05);
}

.show-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-md);
}

.show-card__image-container {
  position: relative;
  width: 100%;
  height: var(--card-height);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.show-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity var(--transition-fast);
}

.show-card:hover .show-card__image {
  opacity: 0.9;
}

.show-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-background-soft) 0%,
    var(--color-background-muted) 100%
  );
}

.show-card__placeholder-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.show-card__rating {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.show-card__rating-icon {
  width: 14px;
  height: 14px;
  color: var(--color-accent);
}

.show-card__rating-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.show-card__content {
  padding: var(--spacing-sm) var(--spacing-xs);
}

.show-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  line-height: var(--line-height-tight);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.show-card__year {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
  margin-bottom: 0;
}
</style>
