/**
 * Dark by default; a visitor's explicit choice is persisted under the same
 * storage key that the inline script in `index.html` reads before first paint.
 */
export const isDark = useDark({
  storageKey: 'vueuse-color-scheme',
  initialValue: 'dark',
})

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Toggles the color scheme with a circular reveal (View Transitions API).
 * Credit to [@hooray](https://github.com/hooray), see https://github.com/vuejs/vitepress/pull/2347
 */
export function toggleDark(event?: MouseEvent): void {
  if (!document.startViewTransition || prefersReducedMotion()) {
    isDark.value = !isDark.value
    return
  }

  // Keyboard activation reports (0, 0); start from the button instead.
  let x = event?.clientX ?? innerWidth / 2
  let y = event?.clientY ?? 0
  if (event && event.detail === 0 && event.currentTarget instanceof Element) {
    const rect = event.currentTarget.getBoundingClientRect()
    x = rect.left + rect.width / 2
    y = rect.top + rect.height / 2
  }
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      { clipPath: isDark.value ? [...clipPath].reverse() : clipPath },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  })
}

/** Runs `fn` when the main thread is idle (falls back to a timeout where unsupported). */
export function onIdle(fn: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window)
    window.requestIdleCallback(fn, { timeout })
  else
    setTimeout(fn, 300)
}

const formatters = new Map<string, Intl.DateTimeFormat>()

/**
 * Formats a `YYYY-MM-DD` date in UTC so it renders as the same calendar day
 * everywhere (and identically during SSG and hydration).
 */
export function formatDate(date: string, withYear = true): string {
  const key = withYear ? 'y' : 'n'
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: withYear ? 'numeric' : undefined,
      timeZone: 'UTC',
    }))
  }
  const value = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date
  return formatters.get(key)!.format(new Date(value))
}
