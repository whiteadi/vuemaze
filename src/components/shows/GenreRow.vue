<script setup lang="ts">
/**
 * GenreRow Component
 * Displays a horizontal scrollable row of shows for a specific genre
 */

import { ref } from 'vue'
import type { Show } from '@/types/show'
import ShowCard from './ShowCard.vue'

defineProps<{
  title: string
  shows: Show[]
}>()

const scrollContainer = ref<HTMLElement | null>(null)

/** Scroll amount for navigation buttons */
const SCROLL_AMOUNT = 600

function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: 'smooth',
    })
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <section class="genre-row">
    <div class="genre-row__header">
      <h2 class="genre-row__title">{{ title }}</h2>
      <div class="genre-row__controls">
        <button
          class="genre-row__nav-btn"
          @click="scrollLeft"
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          class="genre-row__nav-btn"
          @click="scrollRight"
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <div ref="scrollContainer" class="genre-row__scroll-container">
      <div class="genre-row__shows">
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.genre-row {
  margin-bottom: var(--spacing-2xl);
}

.genre-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding: 0 var(--spacing-md);
}

.genre-row__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.genre-row__controls {
  display: flex;
  gap: var(--spacing-sm);
}

.genre-row__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  color: var(--color-text);
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.genre-row__nav-btn:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.genre-row__nav-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.genre-row__nav-btn svg {
  width: 20px;
  height: 20px;
}

.genre-row__scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}

.genre-row__scroll-container::-webkit-scrollbar {
  display: none;
}

.genre-row__shows {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* Allow cards to snap when scrolling */
.genre-row__shows > * {
  scroll-snap-align: start;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .genre-row__header {
    padding: 0 var(--spacing-sm);
  }

  .genre-row__shows {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .genre-row__controls {
    display: none;
  }
}
</style>