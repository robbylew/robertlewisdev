<script setup lang="ts">
/** `inset`: shrink logos that have no background of their own so they don't touch the tile edges. */
defineProps<{ href: string, logo: string, inset?: boolean }>()
</script>

<template>
  <a class="org-link" :href="href" target="_blank" rel="noopener noreferrer">
    <span class="org-logo" :class="{ inset }"><img :src="logo" alt="" width="16" height="16" decoding="async"></span><slot />
  </a>
</template>

<style scoped>
.org-link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4em;
  font-weight: 500;
  color: var(--fg-deep);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.org-link:hover {
  color: var(--fg-deeper);
}

.org-logo {
  display: inline-flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: 1.25em;
  height: 1.25em;
  overflow: hidden;
  border-radius: 0.3em;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
  transition: transform 0.25s ease;
}

.org-link:hover .org-logo {
  transform: translateY(-1px) scale(1.06);
}

.org-logo img {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  object-fit: contain;
}

.org-logo.inset img {
  width: 72%;
  height: 72%;
}

@media (prefers-reduced-motion: reduce) {
  .org-link:hover .org-logo {
    transform: none;
  }
}
</style>
