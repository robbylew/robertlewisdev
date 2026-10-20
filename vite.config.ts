import type MarkdownIt from 'markdown-it'
import type { CodeToHastOptions } from 'shiki'
import type { Plugin } from 'vite'
import type { RouteRecordRaw } from 'vue-router'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownExitShiki from '@shikijs/markdown-exit'
import { transformerMetaHighlight, transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import Vue from '@vitejs/plugin-vue'
import anchor from 'markdown-it-anchor'
import GitHubAlerts from 'markdown-it-github-alerts'
import LinkAttributes from 'markdown-it-link-attributes'
// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'
import { readPageFile } from './scripts/content.ts'
import { transformerCodeBlock } from './scripts/markdown/code-block.ts'
import { MarkdownImageAttrs } from './scripts/markdown/image-attrs.ts'
import { shikiContrastReplacements } from './scripts/markdown/shiki-contrast.ts'
import { generateSeoAssets } from './scripts/seo/index.ts'
import { slugify } from './scripts/slugify.ts'

const root = fileURLToPath(new URL('.', import.meta.url))

/** Static paths of routes that actually render a page (skips pass-through parents like `/posts`). */
function renderablePaths(routes: Readonly<RouteRecordRaw[]>, parent = ''): string[] {
  return routes.flatMap((route) => {
    const joined = route.path.startsWith('/') ? route.path : `${parent.replace(/\/$/, '')}/${route.path}`
    const full = joined.replace(/\/+$/, '') || '/'
    const hasView = Boolean(route.component || route.components)
    const self = hasView && !full.includes(':') ? [full] : []
    return [...self, ...renderablePaths(route.children ?? [], full)]
  })
}

const stylesheetCache = new Map<string, string>()

/**
 * Inlines the site's single stylesheet into each page. Most visitors land once,
 * so removing the render-blocking request beats separate caching (repeat visits
 * still revalidate HTML cheaply via ETag).
 */
function inlineStylesheets(html: string, outDir: string): string {
  return html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g, (_tag, href: string) => {
    const file = path.join(outDir, href)
    if (!stylesheetCache.has(file))
      stylesheetCache.set(file, fs.readFileSync(file, 'utf-8'))
    return `<style>${stylesheetCache.get(file)}</style>`
  })
}

/** Preloads the primary text font so the first paint uses Inter instead of a fallback. */
function PreloadFonts(pattern: RegExp): Plugin {
  return {
    name: 'robertlewis:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter(file => pattern.test(file))
          .map(file => ({
            tag: 'link',
            attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

export default defineConfig({
  resolve: {
    alias: [{ find: '~/', replacement: `${path.resolve(root, 'src')}/` }],
  },

  server: {
    port: 3333,
  },

  define: {
    // `DEBUG_HYDRATION=true pnpm build` to log hydration mismatch details in production builds.
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: process.env.DEBUG_HYDRATION === 'true',
  },

  plugins: [
    VueRouter({
      routesFolder: 'pages',
      extensions: ['.vue', '.md'],
      dts: 'typed-router.d.ts',
      extendRoute(route) {
        const file = route.components.get('default')
        if (file?.endsWith('.md'))
          route.addToMeta({ frontmatter: readPageFile(file).frontmatter })
      },
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Markdown({
      headEnabled: false,
      exposeFrontmatter: false,
      exportFrontmatter: false,
      wrapperComponent: 'WrapperPost',
      wrapperClasses: (_id, code) => code.includes('@layout-full-width')
        ? ''
        : 'prose m-auto slide-enter-content',
      // Same normalization as the route meta (dates, reading time, tags).
      frontmatterPreprocess: (_frontmatter, _options, id) => ({
        head: {},
        frontmatter: readPageFile(id.split('?')[0]).frontmatter,
      }),
      markdownOptions: {
        html: true,
        linkify: true,
        typographer: true,
        quotes: '""\'\'',
      },
      async markdownSetup(md) {
        // `colorReplacements` is forwarded to Shiki at runtime but missing from the integration's option type.
        const shikiOptions: Parameters<typeof MarkdownExitShiki>[0] & Pick<CodeToHastOptions, 'colorReplacements'> = {
          themes: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
          },
          defaultColor: false,
          cssVariablePrefix: '--s-',
          colorReplacements: shikiContrastReplacements,
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerMetaHighlight(),
            transformerCodeBlock(),
          ],
        }
        md.use(MarkdownExitShiki(shikiOptions))

        // markdown-it plugins run unchanged on markdown-exit, but are typed against markdown-it.
        const mdIt = md as unknown as MarkdownIt

        mdIt.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            // Decorative for mouse users; kept out of the tab order and accessibility tree.
            renderAttrs: () => ({ 'aria-hidden': 'true', 'tabindex': '-1' }),
          }),
        })

        mdIt.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        })

        mdIt.use(TOC, {
          includeLevel: [2, 3],
          slugify,
          containerHeaderHtml: '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill"></div></div>',
        })

        mdIt.use(GitHubAlerts)

        md.use(MarkdownImageAttrs, { publicDir: path.join(root, 'public') })
      },
    }),

    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
        { '@unhead/vue': ['useHead', 'useSeoMeta'] },
      ],
      dirs: ['src/composables'],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
    }),

    Components({
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'components.d.ts',
    }),

    UnoCSS(),

    PreloadFonts(/inter-latin-wght-normal-[\w-]+\.woff2$/),
  ],

  build: {
    // One stylesheet for the whole site (inlined into every page below).
    cssCodeSplit: false,
  },

  ssgOptions: {
    // Vue's SSR output is already compact; minifying it would collapse whitespace and break hydration.
    formatting: 'none',
    dirStyle: 'flat',
    // Render every static page plus a real `404.html` (served by Cloudflare Pages with a 404 status).
    includedRoutes: (_paths, routes) => [...new Set([...renderablePaths(routes), '/404'])],
    onPageRendered: (_route, html) => inlineStylesheets(html, path.join(root, 'dist')),
    async onFinished() {
      await generateSeoAssets({ root, outDir: path.join(root, 'dist') })
    },
  },
})
