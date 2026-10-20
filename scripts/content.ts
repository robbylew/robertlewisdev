import type { PageFrontmatter } from '../src/types.ts'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ContentPage {
  file: string
  path: string
  frontmatter: PageFrontmatter
  content: string
}

export type { PageFrontmatter }

const WORDS_PER_MINUTE = 230

function toDateString(value: unknown): string | undefined {
  if (value == null || value === '')
    return undefined
  if (value instanceof Date)
    return value.toISOString().slice(0, 10)
  const str = String(value)
  return /^\d{4}-\d{2}-\d{2}/.test(str) ? str.slice(0, 10) : str
}

export function estimateReadingMinutes(markdown: string): number {
  const codeBlocks = markdown.match(/```[\s\S]*?```/g) ?? []
  const codeLines = codeBlocks.reduce((sum, block) => sum + Math.max(0, block.split('\n').length - 2), 0)
  const images = (markdown.match(/!\[[^\]]*\]\([^)]*\)/g) ?? []).length
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .split(/\s+/)
    .filter(word => /\w/.test(word))
    .length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE + codeLines / 50 + images * 0.2))
}

function formatDuration(duration: unknown): string {
  const minutes = String(duration).match(/^\s*(\d+)\s*(?:(?:m|min|mins|minutes?)\s*)?$/i)?.[1]
  return minutes ? `${minutes} min read` : String(duration)
}

/**
 * Normalizes raw frontmatter so the router meta, the page component and the
 * build scripts all see the same values (e.g. dates as `YYYY-MM-DD` strings
 * instead of UTC `Date`s, which would render as the previous day in the Americas).
 */
export function normalizeFrontmatter(data: Record<string, any>, content: string): PageFrontmatter {
  const frontmatter: PageFrontmatter = { ...data }
  frontmatter.date = toDateString(data.date)
  frontmatter.updated = toDateString(data.updated)
  if (typeof data.tags === 'string')
    frontmatter.tags = data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
  if (frontmatter.date) {
    frontmatter.readingTime = data.duration
      ? formatDuration(data.duration)
      : `${estimateReadingMinutes(content)} min read`
  }
  for (const key of Object.keys(frontmatter)) {
    if (frontmatter[key] === undefined)
      delete frontmatter[key]
  }
  return frontmatter
}

export function readPageFile(file: string): { frontmatter: PageFrontmatter, content: string } {
  const { data, content } = matter(fs.readFileSync(file, 'utf-8'))
  return { frontmatter: normalizeFrontmatter(data, content), content }
}

/** `pages/posts/shazam.md` -> `/posts/shazam`; returns `undefined` for dynamic routes. */
export function routePathFromFile(file: string, pagesDir: string): string | undefined {
  const relative = path.relative(pagesDir, file).replace(/\\/g, '/').replace(/\.(?:md|vue)$/, '')
  if (relative.includes('['))
    return undefined
  const segments = relative.split('/')
  if (segments.at(-1) === 'index')
    segments.pop()
  return `/${segments.join('/')}`
}

export function loadPages(pagesDir: string): ContentPage[] {
  return fs.readdirSync(pagesDir, { recursive: true, encoding: 'utf-8' })
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(pagesDir, file))
    .flatMap((file) => {
      const routePath = routePathFromFile(file, pagesDir)
      if (!routePath)
        return []
      return [{ file, path: routePath, ...readPageFile(file) }]
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

export function isPost(page: Pick<ContentPage, 'path' | 'frontmatter'>): boolean {
  return page.path.startsWith('/posts/') && Boolean(page.frontmatter.date)
}

export function isIndexable(page: Pick<ContentPage, 'frontmatter'>): boolean {
  return !page.frontmatter.noindex && !page.frontmatter.draft
}
