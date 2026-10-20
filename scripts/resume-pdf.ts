/**
 * Generates `public/Robert_Lewis_Resume.pdf` from the built `/resume` page, so the
 * PDF always matches the website (content lives in `src/data/resume.ts`).
 *
 *   pnpm build && pnpm resume:pdf
 *
 * Uses the locally installed Google Chrome (no browser download needed).
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = path.join(root, 'dist')
const output = path.join(root, 'public', 'Robert_Lewis_Resume.pdf')
const origin = 'http://resume.local'

// The site uses the variable Inter font, which Chrome can only embed in PDFs as Type 3 fonts
// (large, and poorly supported by some applicant tracking systems). Swap in the static
// Inter files for the PDF so text is embedded as regular TrueType fonts.
const fontFiles = path.join(path.dirname(createRequire(import.meta.url).resolve('@fontsource/inter/package.json')), 'files')
const staticFontCss = [400, 500, 600, 700, 800].flatMap(weight => (['normal', 'italic'] as const).map((style) => {
  const data = fs.readFileSync(path.join(fontFiles, `inter-latin-${weight}-${style}.woff2`)).toString('base64')
  return `@font-face{font-family:'Inter Static';font-style:${style};font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2')}`
})).join('\n')

if (!fs.existsSync(path.join(dist, 'resume.html'))) {
  console.error('dist/resume.html not found — run `pnpm build` first.')
  process.exit(1)
}

const browser = await chromium.launch({ channel: 'chrome' })
try {
  const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' })
  await context.addInitScript(() => localStorage.setItem('vueuse-color-scheme', 'light'))
  const page = await context.newPage()

  // Serve dist/ like Cloudflare Pages does (`/resume` -> `resume.html`) without starting a server.
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== origin)
      return route.abort()
    let file = path.join(dist, decodeURIComponent(url.pathname))
    if (url.pathname === '/')
      file = path.join(dist, 'index.html')
    else if (!path.extname(file))
      file += '.html'
    if (!file.startsWith(dist) || !fs.existsSync(file))
      return route.fulfill({ status: 404 })
    return route.fulfill({ path: file })
  })

  await page.goto(`${origin}/resume`, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  await page.addStyleTag({ content: `${staticFontCss}\n.resume { font-family: 'Inter Static', sans-serif !important; }` })
  await page.evaluate(() => document.fonts.ready)

  await page.pdf({
    path: output,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
    // Tagged PDFs are accessible and parse more reliably in applicant tracking systems.
    tagged: true,
    outline: true,
  })
}
finally {
  await browser.close()
}

console.log(`Wrote ${path.relative(root, output)} (${(fs.statSync(output).size / 1024).toFixed(1)} kB)`)
