/**
 * Manually notifies IndexNow search engines about every indexable page.
 * (Production builds on Cloudflare Pages already do this automatically.)
 *
 *   pnpm indexnow
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { absoluteUrl } from '../src/site.ts'
import { isIndexable, loadPages } from './content.ts'
import { submitToIndexNow } from './seo/indexnow.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const urls = loadPages(path.join(root, 'pages')).filter(isIndexable).map(page => absoluteUrl(page.path))
const status = await submitToIndexNow(urls)
console.log(`Submitted ${urls.length} URLs to IndexNow (HTTP ${status}):\n${urls.join('\n')}`)
