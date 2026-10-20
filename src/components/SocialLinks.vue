<script setup lang="ts">
import { site } from '~/site'

withDefaults(defineProps<{ labels?: boolean, rss?: boolean, email?: boolean }>(), {
  labels: false,
  rss: false,
  email: false,
})
</script>

<template>
  <ul class="flex flex-wrap items-center" :class="labels ? 'gap-2' : 'gap-0.5'">
    <li v-for="social in site.socials" :key="social.name">
      <a
        :href="social.url"
        target="_blank"
        rel="me noopener noreferrer"
        :class="labels ? 'btn' : 'icon-btn text-lg'"
        :title="labels ? undefined : social.name"
      >
        <span :class="social.icon" aria-hidden="true" />
        <span :class="labels ? '' : 'sr-only'">{{ social.name }}</span>
      </a>
    </li>
    <li v-if="email">
      <a :href="`mailto:${site.email}`" :class="labels ? 'btn' : 'icon-btn text-lg'" :title="labels ? undefined : 'Email'">
        <span class="i-ri-mail-line" aria-hidden="true" />
        <span :class="labels ? '' : 'sr-only'">Email</span>
      </a>
    </li>
    <li v-if="rss">
      <a href="/feed.xml" :class="labels ? 'btn' : 'icon-btn text-lg'" :title="labels ? undefined : 'RSS feed'">
        <span class="i-ri-rss-line" aria-hidden="true" />
        <span :class="labels ? '' : 'sr-only'">RSS feed</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
ul {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none;
}

li {
  margin: 0 !important;
  padding: 0 !important;
}

li::before {
  display: none !important;
}
</style>
