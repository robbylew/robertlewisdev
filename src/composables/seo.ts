import type { PageFrontmatter } from '~/types'
import { absoluteUrl, headline, normalizePath, OG_IMAGE_SIZE, ogImageUrl, site } from '~/site'

const PERSON_ID = `${site.url}/#person`
const WEBSITE_ID = `${site.url}/#website`

function person() {
  const school = (current: boolean) => site.education
    .filter(entry => entry.current === current)
    .map(entry => ({ '@type': 'CollegeOrUniversity', 'name': entry.name, 'url': entry.url }))
  const alumniOf = school(false)
  const affiliation = school(true)
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    'name': site.name,
    'url': `${site.url}/`,
    'email': `mailto:${site.email}`,
    'jobTitle': site.jobTitle,
    'worksFor': { '@type': 'Organization', 'name': site.employer.name, 'url': site.employer.url },
    'description': site.description,
    'sameAs': site.socials.map(social => social.url),
    'knowsAbout': [...site.knowsAbout],
    ...(alumniOf.length ? { alumniOf } : {}),
    ...(affiliation.length ? { affiliation } : {}),
  }
}

function sectionCrumb(path: string): { name: string, path: string } | undefined {
  if (path.startsWith('/posts/'))
    return { name: 'Blog', path: '/blogs' }
}

/** Serializes JSON-LD safely for inline `<script>` usage. */
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * Sets every head tag a page needs for search engines and link previews
 * (iMessage, Slack, Discord, LinkedIn, X, ...).
 */
export function useSeo(frontmatter: PageFrontmatter, routePath: string): void {
  const path = normalizePath(routePath)
  const isHome = path === '/'
  const isArticle = path.startsWith('/posts/') && Boolean(frontmatter.date)
  const noindex = Boolean(frontmatter.noindex || frontmatter.draft)

  const pageTitle = String(frontmatter.title ?? site.name)
  const title = frontmatter.seoTitle ?? (isHome ? `${site.name} · ${headline}` : `${pageTitle} · ${site.name}`)
  const socialTitle = isHome || frontmatter.seoTitle ? title : pageTitle
  const description = String(frontmatter.description ?? site.description)
  const url = absoluteUrl(path)
  const customImage = typeof frontmatter.image === 'string' ? absoluteUrl(frontmatter.image) : undefined
  // Preview images are only generated for indexable pages.
  const image = customImage ?? ogImageUrl(noindex ? '/' : path)
  const imageAlt = String(frontmatter.imageAlt ?? (isHome
    ? `${site.name} — ${headline}`
    : `${pageTitle} — ${site.name}`))

  useSeoMeta({
    title,
    description,
    author: site.name,
    robots: noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: isArticle ? 'article' : 'website',
    ogSiteName: site.name,
    ogLocale: site.locale,
    ogUrl: url,
    ogTitle: socialTitle,
    ogDescription: description,
    ogImage: customImage
      ? { url: image, alt: imageAlt }
      : { url: image, secureUrl: image, type: 'image/png', width: OG_IMAGE_SIZE.width, height: OG_IMAGE_SIZE.height, alt: imageAlt },
    twitterCard: 'summary_large_image',
    twitterSite: site.twitter,
    twitterCreator: site.twitter,
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: imageAlt,
    ...(isArticle
      ? {
          articlePublishedTime: frontmatter.date,
          articleModifiedTime: frontmatter.updated ?? frontmatter.date,
          articleAuthor: [`${site.url}/`],
          articleTag: frontmatter.tags,
        }
      : {}),
  })

  if (noindex)
    return

  const webPageId = `${url}#webpage`
  const crumbs = [
    { name: 'Home', path: '/' },
    sectionCrumb(path),
    isHome ? undefined : { name: pageTitle, path },
  ].filter(crumb => crumb !== undefined)

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      'url': `${site.url}/`,
      'name': site.name,
      'description': site.description,
      'inLanguage': site.lang,
      'publisher': { '@id': PERSON_ID },
    },
    person(),
    {
      '@type': isHome ? 'ProfilePage' : ['/blogs', '/projects'].includes(path) ? 'CollectionPage' : 'WebPage',
      '@id': webPageId,
      'url': url,
      'name': title,
      'description': description,
      'inLanguage': site.lang,
      'isPartOf': { '@id': WEBSITE_ID },
      'primaryImageOfPage': { '@type': 'ImageObject', 'url': image },
      ...(isHome
        ? { mainEntity: { '@id': PERSON_ID } }
        : { about: { '@id': PERSON_ID }, breadcrumb: { '@id': `${url}#breadcrumb` } }),
    },
  ]

  if (!isHome) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      'itemListElement': crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': absoluteUrl(crumb.path),
      })),
    })
  }

  if (isArticle) {
    const minutes = Number.parseInt(String(frontmatter.readingTime ?? ''), 10)
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      'headline': pageTitle,
      'description': description,
      'url': url,
      'image': [image],
      'datePublished': frontmatter.date,
      'dateModified': frontmatter.updated ?? frontmatter.date,
      'author': { '@type': 'Person', '@id': PERSON_ID, 'name': site.name, 'url': `${site.url}/` },
      'publisher': { '@id': PERSON_ID },
      'mainEntityOfPage': { '@id': webPageId },
      'isPartOf': { '@id': WEBSITE_ID },
      'inLanguage': site.lang,
      ...(frontmatter.tags?.length ? { keywords: frontmatter.tags.join(', ') } : {}),
      ...(Number.isFinite(minutes) ? { timeRequired: `PT${minutes}M` } : {}),
    })
  }

  useHead({
    link: [{ rel: 'canonical', href: url }],
    script: [{
      key: 'jsonld',
      type: 'application/ld+json',
      innerHTML: toJsonLd({ '@context': 'https://schema.org', '@graph': graph }),
    }],
  })
}
