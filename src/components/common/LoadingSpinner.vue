<script setup lang="ts">
/**
 * LoadingSpinner Component
 * Displays a loading indicator
 */

defineProps<{
  size?: 'sm' | 'md' | 'lg'
  text?: string
}>()
</script>

<template>
  <div class="loading-spinner" :class="`loading-spinner--${size || 'md'}`">
    <svg class="loading-spinner__icon" viewBox="0 0 50 50" aria-hidden="true">
      <circle class="loading-spinner__circle" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
    </svg>
    <span v-if="text" class="loading-spinner__text">{{ text }}</span>
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.loading-spinner__icon {
  animation: rotate 1s linear infinite;
}

.loading-spinner--sm .loading-spinner__icon {
  width: 24px;
  height: 24px;
}

.loading-spinner--md .loading-spinner__icon {
  width: 40px;
  height: 40px;
}

.loading-spinner--lg .loading-spinner__icon {
  width: 60px;
  height: 60px;
}

.loading-spinner__circle {
  stroke: var(--color-primary);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.loading-spinner__text {
  color: var(--color-text-soft);
  font-size: var(--font-size-sm);
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
