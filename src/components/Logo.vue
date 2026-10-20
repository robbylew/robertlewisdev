<script setup lang="ts">
import { useId } from 'vue'
import { LOGO_KNOCKOUT } from '~/logo'

const gradientId = `${useId()}-logo-accent`
</script>

<template>
  <svg class="logo" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2dd4bf" />
        <stop offset="1" stop-color="#818cf8" />
      </linearGradient>
    </defs>
    <path fill="currentColor" fill-rule="evenodd" :d="LOGO_KNOCKOUT" />
    <path class="logo-accent" :fill="`url(#${gradientId})`" fill-rule="evenodd" :d="LOGO_KNOCKOUT" />
  </svg>
</template>

<style scoped>
.logo {
  overflow: visible;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-accent {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.group:hover .logo,
.group:focus-visible .logo {
  transform: rotate(-8deg) scale(1.06);
}

.group:hover .logo-accent,
.group:focus-visible .logo-accent {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .logo {
    transition: none;
  }

  .group:hover .logo,
  .group:focus-visible .logo {
    transform: none;
  }
}
</style>
