<script setup lang="ts">
import { site } from '~/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 pb-8 pt-10 md:px-7 print:hidden">
    <!-- Width is set at the base font size so `ch` matches the prose column above. -->
    <div class="mx-auto max-w-[65ch]">
      <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-base pt-6 text-sm color-muted">
        <p class="leading-relaxed">
          © {{ site.since }}–{{ year }} {{ site.name }}
          <span class="mx-1 opacity-60" aria-hidden="true">·</span>
          <a class="footer-link" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="license noopener noreferrer">CC BY-NC-SA 4.0</a>
          <span class="mx-1 opacity-60" aria-hidden="true">·</span>
          <a class="footer-link" :href="site.repo" target="_blank" rel="noopener noreferrer">Source</a>
        </p>
        <SocialLinks class="-mr-1 flex-nowrap" rss email />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  text-decoration: underline;
  text-decoration-color: var(--c-border);
  text-underline-offset: 3px;
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease;
}

.footer-link:hover {
  color: var(--c-fg);
  text-decoration-color: currentColor;
}
</style>
