<script setup lang="ts">
import { featuredSkills } from '~/data/resume'
</script>

<template>
  <div>
    <ul class="skill-chips" aria-label="Skills">
      <li v-for="skill in featuredSkills" :key="skill" class="tag">
        {{ skill }}
      </li>
    </ul>
    <p class="mt-4 text-sm">
      <RouterLink to="/resume" class="inline-link">
        Full resume <span class="i-ri-arrow-right-line" aria-hidden="true" />
      </RouterLink>
    </p>
  </div>
</template>

<style scoped>
.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none;
}

.skill-chips > li {
  margin: 0;
  padding: 0.2rem 0.65rem;
  font-size: 0.85rem;
}

.skill-chips > li::before {
  display: none;
}
</style>
