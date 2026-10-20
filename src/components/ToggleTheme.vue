<script setup lang="ts">
import { isDark, toggleDark } from '~/logics'

const mounted = useMounted()
</script>

<template>
  <button
    type="button"
    class="icon-btn text-lg"
    title="Toggle color scheme"
    aria-label="Dark mode"
    :aria-pressed="mounted ? isDark : undefined"
    @click="toggleDark"
  >
    <span class="i-ri-sun-line dark:i-ri-moon-line" aria-hidden="true" />
  </button>
</template>
