<script setup lang="ts">
import { site } from '~/site'

const profiles = site.socials.filter(social => social.name !== 'X')
</script>

<template>
  <div class="hero-actions">
    <RouterLink to="/resume" class="btn-primary">
      <span class="i-ri-file-user-line" aria-hidden="true" /> View resume
    </RouterLink>
    <a :href="`mailto:${site.email}`" class="btn">
      <span class="i-ri-mail-send-line" aria-hidden="true" /> Get in touch
    </a>
    <a
      v-for="profile in profiles"
      :key="profile.name"
      :href="profile.url"
      target="_blank"
      rel="me noopener noreferrer"
      class="btn"
    >
      <span :class="profile.icon" aria-hidden="true" /> {{ profile.name }}
    </a>
  </div>
</template>

<style scoped>
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: -0.5rem 0 2.25rem;
}
</style>
