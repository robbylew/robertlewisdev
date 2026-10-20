// Shared by the Vue app *and* the build scripts (OG images, sitemap, feeds),
// so keep this file free of Vue/browser imports.

export interface SocialLink {
  name: string
  url: string
  icon: string
  handle: string
}

export const site = {
  name: 'Robert Lewis',
  url: 'https://robertlewis.dev',
  domain: 'robertlewis.dev',
  jobTitle: 'Machine Learning Engineer',
  description: 'Robert Lewis is a machine learning engineer focused on model deployment and MLOps. M.S. CS student at Georgia Tech, B.S. Statistics & Data Science from UCLA.',
  email: 'contact@robertlewis.dev',
  lang: 'en',
  locale: 'en_US',
  twitter: '@roberthedev',
  repo: 'https://github.com/robbylew/robertlewisdev-v2',
  since: 2024,
  themeColor: {
    dark: '#050505',
    light: '#ffffff',
  },
  socials: [
    { name: 'GitHub', handle: 'robbylew', url: 'https://github.com/robbylew', icon: 'i-ri-github-line' },
    { name: 'LinkedIn', handle: 'robbylew', url: 'https://www.linkedin.com/in/robbylew/', icon: 'i-ri-linkedin-box-line' },
    { name: 'X', handle: '@roberthedev', url: 'https://x.com/roberthedev', icon: 'i-ri-twitter-x-line' },
  ] satisfies SocialLink[],
  education: [
    { name: 'Georgia Institute of Technology', url: 'https://www.gatech.edu', current: true },
    { name: 'University of California, Los Angeles', url: 'https://www.ucla.edu', current: false },
  ],
  knowsAbout: [
    'Machine Learning',
    'MLOps',
    'Data Engineering',
    'Deep Learning',
    'Computer Vision',
    'Large Language Models',
    'Python',
    'Go',
    'SQL',
    'TypeScript',
    'Amazon Web Services',
    'Google Cloud Platform',
    'Microsoft Azure',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Apache Airflow',
    'Apache Spark',
    'Apache Kafka',
    'PostgreSQL',
    'MongoDB',
  ],
} as const

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

/** Normalizes a route path: no trailing slash (except root), no query/hash. */
export function normalizePath(path: string): string {
  const clean = path.split(/[?#]/)[0] || '/'
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/'
}

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path))
    return path
  const normalized = normalizePath(path.startsWith('/') ? path : `/${path}`)
  return normalized === '/' ? `${site.url}/` : `${site.url}${normalized}`
}

/** File name (without directory) of the auto-generated Open Graph image for a route. */
export function ogImageName(path: string): string {
  const normalized = normalizePath(path)
  return normalized === '/'
    ? 'index.png'
    : `${normalized.slice(1).replace(/\//g, '-')}.png`
}

export function ogImageUrl(path: string): string {
  return `${site.url}/og/${ogImageName(path)}`
}
