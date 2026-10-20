<script setup lang="ts">
import { site } from '~/site'

const route = useRoute()
const mounted = useMounted()
const { y } = useWindowScroll()

// Guarded by `mounted` so server and hydration renders match.
const scrolled = computed(() => mounted.value && y.value > 8)
const showToTop = computed(() => mounted.value && y.value > 600)

const links = [
  { to: '/blogs', label: 'Blog', icon: 'i-ri-article-line', match: (path: string) => path === '/blogs' || path.startsWith('/posts/') },
  { to: '/projects', label: 'Projects', icon: 'i-ri-folder-5-line', match: (path: string) => path.startsWith('/projects') },
  { to: '/resume', label: 'Resume', icon: 'i-ri-file-user-line', match: (path: string) => path.startsWith('/resume') },
]

function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <header class="site-header sticky top-0 z-40 print:hidden" :class="{ 'is-scrolled': scrolled }">
    <nav class="mx-auto flex h-16 items-center justify-between gap-3 px-5 md:px-7" aria-label="Main">
      <RouterLink to="/" class="brand group focus-ring" :aria-label="`${site.name}, home`">
        <Logo class="h-8 w-8 shrink-0" />
      </RouterLink>

      <div class="flex items-center gap-0.5 sm:gap-1.5">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'is-active': link.match(route.path) }"
          :aria-current="link.match(route.path) ? 'page' : undefined"
          :title="link.label"
        >
          <span :class="link.icon" class="text-lg md:hidden" aria-hidden="true" />
          <span class="sr-only md:not-sr-only">{{ link.label }}</span>
        </RouterLink>

        <span class="mx-1.5 hidden h-4 w-px bg-neutral-300 md:block dark:bg-neutral-700" aria-hidden="true" />

        <a
          v-for="social in site.socials"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="me noopener noreferrer"
          class="icon-btn hidden text-lg md:inline-flex"
          :title="social.name"
        >
          <span :class="social.icon" aria-hidden="true" />
          <span class="sr-only">{{ social.name }} (opens in a new tab)</span>
        </a>

        <ToggleTheme />
      </div>
    </nav>
  </header>

  <button
    type="button"
    class="icon-btn fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full border border-base bg-base text-lg shadow-sm transition-all duration-300 print:hidden"
    :class="showToTop ? 'opacity-80 hover:opacity-100' : 'pointer-events-none translate-y-2 opacity-0'"
    :tabindex="showToTop ? 0 : -1"
    :aria-hidden="!showToTop"
    aria-label="Scroll to top"
    title="Scroll to top"
    @click="toTop"
  >
    <span class="i-ri-arrow-up-line" aria-hidden="true" />
  </button>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid transparent;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    backdrop-filter 0.3s ease;
}

.site-header.is-scrolled {
  background-color: color-mix(in srgb, var(--c-bg) 78%, transparent);
  border-bottom-color: var(--c-border);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin: -0.25rem;
  padding: 0.25rem;
  border-radius: 0.75rem;
  color: var(--c-fg);
  text-decoration: none;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--c-fg-muted);
  text-decoration: none;
  transition: color 0.2s ease;
  outline: none;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--c-fg);
}

.nav-link:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.nav-link.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -0.15rem;
  width: 1rem;
  height: 2px;
  border-radius: 999px;
  background: var(--c-accent);
  transform: translateX(-50%);
}
</style>
