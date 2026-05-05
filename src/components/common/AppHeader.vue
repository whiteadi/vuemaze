<script setup lang="ts">
/**
 * AppHeader Component
 * Application header with logo and search functionality
 */

import { RouterLink } from 'vue-router'

defineProps<{
  showSearch?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <RouterLink to="/" class="app-header__logo">
        <svg
          class="app-header__logo-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm0 4h2v2H6v-2zm4-4h8v2h-8V8zm0 4h8v2h-8v-2z"
          />
        </svg>
        <span class="app-header__logo-text">VueMaze</span>
      </RouterLink>

      <div v-if="showSearch" class="app-header__search">
        <svg
          class="app-header__search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          class="app-header__search-input"
          placeholder="Search shows..."
          @input="handleSearchInput"
          aria-label="Search TV shows"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.app-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  max-width: var(--container-max-width);
  height: var(--header-height);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.app-header__logo:hover {
  color: var(--color-primary);
}

.app-header__logo:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
}

.app-header__logo-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
}

.app-header__logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.app-header__search {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.app-header__search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.app-header__search-input {
  width: 100%;
  height: 44px;
  padding: 0 var(--spacing-md) 0 calc(var(--spacing-md) + 28px);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  outline: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.app-header__search-input::placeholder {
  color: var(--color-text-muted);
}

.app-header__search-input:hover {
  border-color: var(--color-border-hover);
}

.app-header__search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* Clear button for search */
.app-header__search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cline x1='18' y1='6' x2='6' y2='18'/%3E%3Cline x1='6' y1='6' x2='18' y2='18'/%3E%3C/svg%3E")
    center/contain no-repeat;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .app-header__logo-text {
    display: none;
  }

  .app-header__search {
    max-width: none;
  }
}
</style>
