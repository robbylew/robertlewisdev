<script setup lang="ts">
import { projects } from '~/data/projects'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <p class="mb-10 text-center text-lg color-muted slide-enter">
      Things I've built — from ML systems and data pipelines to open source contributions.
    </p>
    <section
      v-for="(items, category, cidx) in projects"
      :key="category"
      class="project-section slide-enter"
      :style="{ '--enter-stage': cidx + 1 }"
      :aria-labelledby="slugify(String(category))"
    >
      <h2 :id="slugify(String(category))" class="category-heading">
        {{ category }}
      </h2>
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="project in items" :key="project.name">
          <ProjectCard :project="project" />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.project-section + .project-section {
  margin-top: 3.5rem;
}

.category-heading {
  margin: 0 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--c-fg);
  scroll-margin-top: 5rem;
}

.project-section > ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
