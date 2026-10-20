<script setup lang="ts">
import { site } from '~/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 pb-10 pt-12 md:px-7 print:hidden">
    <div class="prose mx-auto">
      <p class="footer-line m-0! text-sm color-faint">
        <span>© {{ site.since }}–{{ year }} {{ site.name }}</span>
        <a class="footer-link" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="license noopener noreferrer">CC BY-NC-SA 4.0</a>
        <a class="footer-link" href="/feed.xml">RSS</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0;
}

.footer-line > *:not(:last-child)::after {
  content: '·';
  margin: 0 0.6rem;
  opacity: 0.6;
}

.footer-link {
  color: inherit;
  font-weight: inherit;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--c-fg);
}
</style>
