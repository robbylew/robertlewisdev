<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()
</script>

<template>
  <component
    :is="project.link ? 'a' : 'div'"
    v-bind="project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {}"
    class="project-card card h-full"
    :class="project.link ? 'card-hover focus-ring' : ''"
  >
    <div class="flex items-start gap-3.5">
      <span :class="project.icon" class="project-icon mt-0.5 shrink-0 text-2xl" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <h3 class="project-name">
          {{ project.name }}
          <span v-if="project.link" class="project-arrow i-ri-arrow-right-up-line ml-0.5 text-sm" aria-hidden="true" />
          <span v-if="project.link" class="sr-only">(opens in a new tab)</span>
        </h3>
        <p class="mt-1.5 text-sm leading-relaxed color-muted">
          {{ project.description }}
        </p>
        <ul v-if="project.tags?.length || project.private" class="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
          <li v-if="project.private" class="tag gap-1">
            <span class="i-ri-lock-line text-[0.8em]" aria-hidden="true" />Private
          </li>
          <li v-for="tag in project.tags" :key="tag" class="tag">
            {{ tag }}
          </li>
        </ul>
      </div>
    </div>
  </component>
</template>

<style scoped>
.project-card {
  display: block;
  padding: 1rem 1.125rem 1.125rem;
  color: inherit;
  text-decoration: none !important;
  border-bottom-width: 1px !important;
}

.project-icon {
  color: var(--c-fg-muted);
  transition: color 0.2s ease;
}

.project-arrow {
  opacity: 0.5;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

a.project-card:hover .project-icon {
  color: var(--c-fg);
}

a.project-card:hover .project-arrow {
  opacity: 1;
  transform: translate(1px, -1px);
}

.project-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--c-fg);
}

.project-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card ul > li {
  margin: 0;
  padding: 0.125rem 0.5rem;
}

.project-card ul > li::before {
  display: none;
}
</style>
