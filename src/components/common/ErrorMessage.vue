<script setup lang="ts">
/**
 * ErrorMessage Component
 * Displays an error message with optional retry action
 */

defineProps<{
  message: string
  title?: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="error-message" role="alert">
    <svg class="error-message__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      />
    </svg>
    <div class="error-message__content">
      <h3 v-if="title" class="error-message__title">{{ title }}</h3>
      <p class="error-message__text">{{ message }}</p>
    </div>
    <button class="error-message__retry" @click="emit('retry')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M1 4v6h6" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
      Try Again
    </button>
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  text-align: center;
}

.error-message__icon {
  width: 48px;
  height: 48px;
  color: var(--color-error);
}

.error-message__content {
  max-width: 400px;
}

.error-message__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.error-message__text {
  font-size: var(--font-size-base);
  color: var(--color-text-soft);
  margin: 0;
}

.error-message__retry {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.error-message__retry:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border-hover);
}

.error-message__retry:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.error-message__retry svg {
  width: 18px;
  height: 18px;
}
</style>