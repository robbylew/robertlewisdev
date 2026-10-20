import type { ShikiTransformer } from 'shiki'

type Root = Parameters<NonNullable<ShikiTransformer['root']>>[0]
type ElementContent = Exclude<Root['children'][number], { type: 'doctype' }>

/**
 * Wraps highlighted code in a container with a language label and a copy
 * button. The click handling lives in `WrapperPost.vue` (event delegation).
 */
export function transformerCodeBlock(): ShikiTransformer {
  return {
    name: 'robertlewis:code-block',
    root(root) {
      const lang = this.options.lang
      const children = root.children.filter((node): node is ElementContent => node.type !== 'doctype')
      return {
        type: 'root',
        children: [{
          type: 'element',
          tagName: 'div',
          properties: {
            'class': 'code-block',
            'data-lang': lang && lang !== 'text' ? lang : undefined,
          },
          children: [
            ...children,
            {
              type: 'element',
              tagName: 'button',
              properties: {
                'type': 'button',
                'class': 'copy-code',
                'aria-label': 'Copy code to clipboard',
                'title': 'Copy code',
              },
              children: [],
            },
          ],
        }],
      }
    },
  }
}
