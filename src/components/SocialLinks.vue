<script setup lang="ts">
import { site } from '~/site'
</script>

<template>
  <ul class="social-links">
    <li v-for="social in site.socials" :key="social.name">
      <a :href="social.url" target="_blank" rel="me noopener noreferrer">
        <span :class="social.icon" aria-hidden="true" />{{ social.name }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0.75rem 0 1.25rem !important;
  padding: 0 !important;
  list-style: none;
}

.social-links li {
  margin: 0 !important;
  padding: 0 !important;
}

.social-links li::before {
  display: none !important;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  font-weight: 500;
  color: var(--fg-deep);
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-links a:hover {
  color: var(--fg-deeper);
}

.social-links a > span {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.social-links a:hover > span {
  opacity: 1;
}
</style>
