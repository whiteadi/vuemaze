<script setup lang="ts">
/**
 * Show Detail View
 * Displays comprehensive information about a single TV show
 */

defineProps<{
  id: string
}>()
</script>

<template>
  <main class="show-detail">
    <h1>Show Details</h1>
    <p>Show ID: {{ id }}</p>
    <p>Coming soon: Full show information</p>
  </main>
</template>

<style scoped>
.show-detail {
  padding: var(--spacing-xl);
}

.show-detail h1 {
  margin-bottom: var(--spacing-md);
}
</style>