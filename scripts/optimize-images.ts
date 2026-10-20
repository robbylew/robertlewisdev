/**
 * Converts images to WebP (resizing very large ones) for use in `public/`.
 *
 *   pnpm img public/images/chart.png            # writes public/images/chart.webp
 *   pnpm img public/photos/*.jpg --replace      # also deletes the originals
 *   pnpm img chart.png --max-width 1200 --quality 85
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import sharp from 'sharp'

const { values, positionals: files } = parseArgs({
  allowPositionals: true,
  options: {
    'max-width': { type: 'string', default: '1600' },
    'quality': { type: 'string', default: '82' },
    'replace': { type: 'boolean', default: false },
  },
})

const maxWidth = Number(values['max-width'])
const quality = Number(values.quality)

function kb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} kB`.padStart(10)
}

if (!files.length) {
  console.error('Usage: pnpm img <files...> [--max-width 1600] [--quality 82] [--replace]')
  process.exit(1)
}

for (const file of files) {
  const input = await fs.readFile(file)
  const image = sharp(input, { animated: true })
  const { width = 0, format } = await image.metadata()
  if (!['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'].includes(format ?? '')) {
    console.warn(`[skip] unsupported format ${format}: ${file}`)
    continue
  }

  const output = await image
    .rotate()
    .resize({ width: Math.min(width, maxWidth), withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer()

  const target = file.replace(/\.\w+$/, '.webp')
  await fs.writeFile(target, output)
  if (values.replace && path.resolve(target) !== path.resolve(file))
    await fs.unlink(file)

  const change = ((output.length - input.length) / input.length * 100).toFixed(1)
  console.log(`${kb(input.length)} -> ${kb(output.length)} (${change}%)  ${target}`)
}
