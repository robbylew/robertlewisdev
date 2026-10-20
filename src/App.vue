<script setup lang="ts">
import { isDark } from '~/logics'
import { site } from '~/site'

const preview = ref<{ src: string, alt: string }>()

useHead({
  meta: [
    { name: 'theme-color', content: computed(() => isDark.value ? site.themeColor.dark : site.themeColor.light) },
  ],
})

// Click any content image (or an image marked `data-zoomable`) to view it full screen.
useEventListener('click', async (event) => {
  const path = event.composedPath()
  const target = path[0]
  if (!(target instanceof HTMLImageElement) || target.classList.contains('no-preview'))
    return
  if (path.some(el => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName)))
    return
  const zoomable = target.hasAttribute('data-zoomable')
    || path.some(el => el instanceof HTMLElement && el.classList.contains('prose'))
  if (!zoomable)
    return

  // Ignore taps on images that are still moving (e.g. hover transforms on touch devices).
  const before = target.getBoundingClientRect()
  await new Promise(resolve => setTimeout(resolve, 50))
  const after = target.getBoundingClientRect()
  if (before.left !== after.left || before.top !== after.top)
    return

  preview.value = { src: target.currentSrc || target.src, alt: target.alt }
})

onKeyStroke('Escape', (event) => {
  if (preview.value) {
    preview.value = undefined
    event.preventDefault()
  }
})

// Always print in the light theme.
let printingFromDark = false
useEventListener('beforeprint', () => {
  printingFromDark = document.documentElement.classList.contains('dark')
  document.documentElement.classList.remove('dark')
})
useEventListener('afterprint', () => {
  if (printingFromDark)
    document.documentElement.classList.add('dark')
})
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <NavBar />
  <main id="main" tabindex="-1" class="relative overflow-x-clip px-6 pb-10 pt-8 outline-none md:px-7 md:pt-10">
    <RouterView />
  </main>
  <Footer />
  <Transition name="fade">
    <div
      v-if="preview"
      role="dialog"
      aria-modal="true"
      :aria-label="preview.alt || 'Image preview'"
      class="fixed inset-0 z-500 cursor-zoom-out backdrop-blur-md"
      @click="preview = undefined"
    >
      <div class="absolute inset-0 z--1 bg-black/60" />
      <img :src="preview.src" :alt="preview.alt" class="no-preview h-full w-full object-contain p-4 md:p-10">
      <button
        type="button"
        class="icon-btn absolute right-4 top-4 text-2xl text-white!"
        aria-label="Close image preview"
        @click.stop="preview = undefined"
      >
        <span class="i-ri-close-line" aria-hidden="true" />
      </button>
    </div>
  </Transition>
</template>
