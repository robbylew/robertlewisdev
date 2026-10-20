import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(?:vue|md|html)(?:$|\?)/,
        // Data/config modules reference icon classes as strings.
        /[\\/]src[\\/].+\.ts(?:$|\?)/,
      ],
    },
  },
  shortcuts: [
    {
      'bg-base': 'bg-white dark:bg-[#050505]',
      'color-base': 'text-neutral-800 dark:text-neutral-200',
      'color-muted': 'text-neutral-600 dark:text-neutral-400',
      'color-faint': 'text-neutral-500 dark:text-neutral-500',
      'border-base': 'border-neutral-200 dark:border-neutral-800',
      'focus-ring': 'outline-none focus-visible:(outline-2 outline-offset-2 outline-solid outline-[var(--c-accent)])',
      'card': 'rounded-xl border border-base bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm transition duration-200',
      'card-hover': 'hover:(border-neutral-300 bg-white/90 shadow-sm) dark:hover:(border-neutral-700 bg-neutral-900/70)',
      'tag': 'inline-flex items-center rounded-full border border-base px-2 py-0.5 text-xs leading-5 color-muted whitespace-nowrap',
      'btn': 'inline-flex items-center gap-1.5 rounded-lg border border-base px-3 py-1.5 text-sm font-medium no-underline! color-base transition duration-200 hover:(border-neutral-400 bg-neutral-100) dark:hover:(border-neutral-600 bg-neutral-900) focus-ring',
      'btn-primary': 'btn border-transparent! bg-neutral-900 text-white! hover:bg-neutral-700! dark:(bg-neutral-100 text-neutral-900!) dark:hover:bg-neutral-300!',
      'icon-btn': 'inline-flex items-center justify-center rounded-md p-1 color-muted transition duration-200 hover:(color-base bg-neutral-500/10) focus-ring',
    },
  ],
  rules: [
    [/^slide-enter-(\d+)$/, ([_, n]) => ({
      '--enter-stage': n,
    })],
  ],
  theme: {
    fontFamily: {
      sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"DM Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
