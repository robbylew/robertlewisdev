<script setup lang="ts">
import type { Post } from '~/types'
import { formatDate } from '~/logics'
import { getPosts } from '~/logics/posts'

const props = withDefaults(defineProps<{ type?: string }>(), {
  type: 'blog',
})

const router = useRouter()

const posts = computed(() => getPosts(router, props.type))

const groups = computed(() => {
  const result: { year: string, posts: Post[] }[] = []
  for (const post of posts.value) {
    const year = post.date.slice(0, 4)
    if (result.at(-1)?.year !== year)
      result.push({ year, posts: [] })
    result.at(-1)!.posts.push(post)
  }
  return result
})
</script>

<template>
  <p v-if="!posts.length" class="py-2 color-faint">
    { nothing here yet }
  </p>

  <template v-else>
    <section
      v-for="(group, gidx) in groups"
      :key="group.year"
      class="post-group slide-enter"
      :style="{ '--enter-stage': gidx, '--enter-step': '60ms' }"
      :aria-labelledby="`year-${group.year}`"
    >
      <h2 :id="`year-${group.year}`" class="year-heading">
        <span class="year-text">{{ group.year }}</span>
      </h2>
      <ul class="post-list">
        <li
          v-for="(post, idx) in group.posts"
          :key="post.path"
          class="slide-enter"
          :style="{ '--enter-stage': gidx + idx + 1, '--enter-step': '60ms' }"
        >
          <RouterLink :to="post.path" class="post-link">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-meta">
              <time :datetime="post.date">{{ formatDate(post.date, false) }}</time>
              <template v-if="post.readingTime"> · {{ post.readingTime }}</template>
            </span>
            <span v-if="post.description" class="post-desc">{{ post.description }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </template>
</template>

<style scoped>
.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-list > li {
  margin: 0;
  padding: 0;
}

.post-list > li::before {
  display: none;
}

.post-link {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 1rem;
  margin: 0 -0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border-bottom: none !important;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.post-link:hover {
  background-color: rgb(136 136 136 / 0.08);
}

.post-link:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.post-title {
  font-size: 1.075rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--c-fg);
}

.post-meta {
  align-self: start;
  padding-top: 0.15rem;
  font-size: 0.875rem;
  white-space: nowrap;
  color: var(--c-fg-muted);
  font-variant-numeric: tabular-nums;
}

.post-desc {
  grid-column: 1 / -1;
  font-size: 0.925rem;
  line-height: 1.6;
  color: var(--c-fg-muted);
}

@media (max-width: 639px) {
  .post-link {
    grid-template-columns: 1fr;
  }
}

.year-heading {
  position: relative;
  height: 4.5rem;
  margin: 2.5rem 0 0 !important;
  font-size: 1rem !important;
  pointer-events: none;
  user-select: none;
}

.year-text {
  position: absolute;
  top: -1.25rem;
  left: -2.5rem;
  font-size: 7rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 2px #888;
  opacity: 0.16;
}

.post-group:first-child .year-heading {
  margin-top: 0 !important;
}

@media (max-width: 767px) {
  .year-text {
    left: -0.5rem;
    font-size: 5.5rem;
  }
}
</style>
