import type { Router } from 'vue-router'
import type { Post } from '~/types'

/** Published posts of the given type(s), newest first. */
export function getPosts(router: Router, type = 'blog'): Post[] {
  return router.getRoutes()
    .filter((route) => {
      const fm = route.meta.frontmatter
      return route.path.startsWith('/posts/')
        && Boolean(fm?.date)
        && !fm?.draft
        && (fm?.type ?? 'blog').split('+').includes(type)
    })
    .map((route) => {
      const fm = route.meta.frontmatter!
      return {
        path: route.path,
        title: String(fm.title ?? route.path),
        date: fm.date!,
        description: fm.description,
        readingTime: fm.readingTime,
        tags: fm.tags,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}
