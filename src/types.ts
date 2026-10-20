export interface PageFrontmatter {
  title?: string
  /** Visible H1 when it should differ from the document title. */
  display?: string
  subtitle?: string
  description?: string
  /** Publish date, normalized to `YYYY-MM-DD`. */
  date?: string
  /** Last meaningful update, normalized to `YYYY-MM-DD`. */
  updated?: string
  /** Manual reading-time override, e.g. `20min`. */
  duration?: string
  /** Computed for dated pages (posts), e.g. `12 min read`. */
  readingTime?: string
  tags?: string[]
  /** Post type(s) used by `<ListPosts type="..." />`, joined with `+`. Defaults to `blog`. */
  type?: string
  draft?: boolean
  noindex?: boolean
  /** Custom social preview image (absolute URL or root-relative path). */
  image?: string
  imageAlt?: string
  /** Full `<title>` override (also used for social cards). Defaults to `{title} · Robert Lewis`. */
  seoTitle?: string
  /** Overrides the title on the generated social preview image. */
  ogTitle?: string
  /** Background art. Defaults to `random`. */
  art?: 'plum' | 'dots' | 'random' | 'none'
  wrapperClass?: string
  class?: string
  tocAlwaysOn?: boolean
  [key: string]: unknown
}

export interface Post {
  path: string
  title: string
  date: string
  description?: string
  readingTime?: string
  tags?: string[]
}

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter?: PageFrontmatter
  }
}
