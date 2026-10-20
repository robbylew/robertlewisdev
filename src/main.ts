import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { onIdle } from './logics'
import '@fontsource-variable/inter/wght.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import '@unocss/reset/tailwind.css'
import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'

import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'
import 'uno.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, from, savedPosition) {
      // Skip entrance animations when restoring a scroll position (back/forward).
      if (typeof document !== 'undefined')
        document.documentElement.classList.toggle('no-sliding', Boolean(savedPosition))
      if (savedPosition)
        return savedPosition
      if (to.hash)
        return { el: decodeURIComponent(to.hash), top: 80 }
      if (to.path !== from.path)
        return { top: 0 }
    },
  },
  ({ router }) => {
    if (import.meta.env.SSR)
      return

    NProgress.configure({ showSpinner: false, trickleSpeed: 120 })
    let timer: ReturnType<typeof setTimeout> | undefined
    router.beforeEach((to, from) => {
      // Only show the bar when a navigation is noticeably slow.
      if (to.path !== from.path)
        timer = setTimeout(() => NProgress.start(), 150)
    })
    router.afterEach(() => {
      clearTimeout(timer)
      NProgress.done()
    })
    router.onError(() => {
      clearTimeout(timer)
      NProgress.done()
    })

    // Warm up every page chunk once idle so client-side navigation is instant.
    router.isReady().then(() => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }).connection
      if (connection?.saveData || /2g/.test(connection?.effectiveType ?? ''))
        return
      onIdle(() => {
        for (const route of router.getRoutes()) {
          for (const component of Object.values(route.components ?? {})) {
            if (typeof component !== 'function')
              continue
            try {
              Promise.resolve((component as () => unknown)()).catch(() => {})
            }
            catch {}
          }
        }
      }, 4000)
    })
  },
  { hydration: true },
)
