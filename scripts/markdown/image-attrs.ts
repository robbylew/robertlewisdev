import type { MarkdownExit } from 'markdown-exit'
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'

interface Options {
  /** Directory that root-relative image URLs (e.g. `/images/a.webp`) resolve to. */
  publicDir: string
}

const cache = new Map<string, { width: number, height: number } | null>()

function readSize(file: string): { width: number, height: number } | null {
  if (!cache.has(file)) {
    try {
      const { width, height } = imageSize(fs.readFileSync(file))
      cache.set(file, width && height ? { width, height } : null)
    }
    catch {
      cache.set(file, null)
    }
  }
  return cache.get(file)!
}

/**
 * Adds intrinsic `width`/`height` (prevents layout shift) plus lazy loading
 * and async decoding to images in markdown.
 */
export function MarkdownImageAttrs(md: MarkdownExit, { publicDir }: Options): void {
  const render = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const src = token.attrGet('src') ?? ''
    if (src.startsWith('/') && !src.startsWith('//') && !token.attrGet('width')) {
      const size = readSize(path.join(publicDir, decodeURIComponent(src.split(/[?#]/)[0])))
      if (size) {
        token.attrSet('width', String(size.width))
        token.attrSet('height', String(size.height))
      }
    }
    if (!token.attrGet('loading'))
      token.attrSet('loading', 'lazy')
    if (!token.attrGet('decoding'))
      token.attrSet('decoding', 'async')
    return render(tokens, idx, options, env, self)
  }
}
