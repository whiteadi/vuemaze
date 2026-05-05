<script setup lang="ts">
import { RouterView } from 'vue-router'
import { provideShows } from '@/composables/useShows'

// Provide shows state to all child components (like React Context.Provider)
provideShows()
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
