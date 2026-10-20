// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: {
      css: true,
      html: true,
      markdown: false,
    },
    ignores: [
      'auto-imports.d.ts',
      'components.d.ts',
      'typed-router.d.ts',
      'public/**',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': 'off',
      'node/prefer-global/process': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
)
