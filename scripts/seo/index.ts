import type { ContentPage } from '../content.ts'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Feed } from 'feed'
import { createMarkdownExit } from 'markdown-exit'
import { absoluteUrl, headline, ogImageName, ogImageUrl, site } from '../../src/site.ts'
import { isIndexable, isPost, loadPages } from '../content.ts'
import { INDEXNOW_KEY, submitToIndexNow } from './indexnow.ts'
import { renderOgImage } from './og-image.ts'

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;' }[char]!))
}

async function writeOgImages(pages: ContentPage[], outDir: string): Promise<number> {
  const dir = path.join(outDir, 'og')
  await fs.mkdir(dir, { recursive: true })
  const targets = pages.filter(page => isIndexable(page) && !page.frontmatter.image)
  await Promise.all(targets.map(async (page) => {
    const { frontmatter } = page
    const title = String(frontmatter.ogTitle ?? frontmatter.title ?? site.name)
    const subtitle = isPost(page) && frontmatter.date
      ? [formatDate(frontmatter.date), frontmatter.readingTime].filter(Boolean).join(' · ')
      : page.path === '/' ? headline : `${site.name} · ${headline}`
    const png = await renderOgImage({
      title,
      subtitle,
      url: `${site.domain}${page.path === '/' ? '' : page.path}`,
    })
    await fs.writeFile(path.join(dir, ogImageName(page.path)), png)
  }))
  return targets.length
}

function latestPostDate(pages: ContentPage[]): string | undefined {
  return pages
    .filter(page => isPost(page) && isIndexable(page))
    .map(page => page.frontmatter.updated ?? page.frontmatter.date!)
    .sort()
    .at(-1)
}

async function writeSitemap(pages: ContentPage[], outDir: string): Promise<number> {
  const newestPost = latestPostDate(pages)
  const entries = pages.filter(isIndexable).map((page) => {
    const lastmod = isPost(page)
      ? page.frontmatter.updated ?? page.frontmatter.date
      : page.path === '/blogs' ? newestPost : undefined
    return [
      '  <url>',
      `    <loc>${escapeXml(absoluteUrl(page.path))}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
      '  </url>',
    ].filter(Boolean).join('\n')
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
  await fs.writeFile(path.join(outDir, 'sitemap.xml'), xml)
  return entries.length
}

async function writeFeeds(pages: ContentPage[], outDir: string): Promise<number> {
  const md = createMarkdownExit({ html: true, linkify: true, typographer: true })
  const posts = pages
    .filter(page => isPost(page) && isIndexable(page))
    .sort((a, b) => b.frontmatter.date!.localeCompare(a.frontmatter.date!))

  const author = { name: site.name, email: site.email, link: site.url }
  const feed = new Feed({
    id: `${site.url}/`,
    link: `${site.url}/`,
    title: site.name,
    description: `Writing on machine learning, MLOps and engineering by ${site.name}.`,
    language: site.lang,
    image: ogImageUrl('/'),
    favicon: `${site.url}/favicon-32x32.png`,
    copyright: `CC BY-NC-SA 4.0 ${site.since}-PRESENT © ${site.name}`,
    updated: new Date(`${latestPostDate(pages) ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`),
    generator: site.domain,
    feedLinks: {
      rss: `${site.url}/feed.xml`,
      atom: `${site.url}/atom.xml`,
    },
    author,
  })

  for (const post of posts) {
    const { frontmatter } = post
    const url = absoluteUrl(post.path)
    const source = post.content
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/^\[\[toc\]\]\s*$/gim, '')
    const html = md.render(source)
      .replace(/\s(href|src)="\/(?!\/)/g, ` $1="${site.url}/`)
    feed.addItem({
      title: String(frontmatter.title),
      id: url,
      link: url,
      date: new Date(`${frontmatter.updated ?? frontmatter.date}T00:00:00Z`),
      published: new Date(`${frontmatter.date}T00:00:00Z`),
      description: frontmatter.description,
      content: html,
      author: [author],
      image: frontmatter.image ? absoluteUrl(frontmatter.image) : ogImageUrl(post.path),
      category: (frontmatter.tags ?? []).map(name => ({ name })),
    })
  }

  await Promise.all([
    fs.writeFile(path.join(outDir, 'feed.xml'), feed.rss2()),
    fs.writeFile(path.join(outDir, 'atom.xml'), feed.atom1()),
  ])
  return posts.length
}

/** Generates social preview images, `sitemap.xml` and RSS/Atom feeds into the build output. */
export async function generateSeoAssets({ root, outDir }: { root: string, outDir: string }): Promise<void> {
  const started = performance.now()
  const pages = loadPages(path.join(root, 'pages'))
  const [images, urls, posts] = await Promise.all([
    writeOgImages(pages, outDir),
    writeSitemap(pages, outDir),
    writeFeeds(pages, outDir),
  ])
  await fs.writeFile(path.join(outDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY)
  const ms = Math.round(performance.now() - started)
  console.log(`[seo] ${images} social images, sitemap with ${urls} URLs, feeds with ${posts} posts (${ms}ms)`)

  // Cloudflare Pages production builds announce the (re)deployed pages to search engines.
  if (process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH === 'main') {
    const list = pages.filter(isIndexable).map(page => absoluteUrl(page.path))
    try {
      const status = await submitToIndexNow(list)
      console.log(`[seo] IndexNow: submitted ${list.length} URLs (HTTP ${status})`)
    }
    catch (error) {
      console.warn(`[seo] IndexNow submission skipped: ${String(error)}`)
    }
  }
}
