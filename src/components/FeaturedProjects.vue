<script setup lang="ts">
import { featuredProjects } from '~/data/projects'
</script>

<template>
  <div class="not-prose">
    <ul class="featured-grid">
      <li v-for="project in featuredProjects" :key="project.name">
        <ProjectCard :project="project" />
      </li>
    </ul>
    <p class="mt-4 text-sm">
      <RouterLink to="/projects" class="inline-link">
        All projects <span class="i-ri-arrow-right-line" aria-hidden="true" />
      </RouterLink>
    </p>
  </div>
</template>

<style scoped>
.featured-grid {
  display: grid;
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.featured-grid > li {
  margin: 0;
  padding: 0;
}

.featured-grid > li::before {
  display: none;
}
</style>
