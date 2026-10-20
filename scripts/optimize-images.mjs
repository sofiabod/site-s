import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'

// Originals stay untouched. Content hashes allow safe immutable CDN/browser caching.
const eventSource = await readFile('src/events.ts', 'utf8')
const photos = [...new Set([...eventSource.matchAll(/(?:src|cover): '([^']+)'/g)].map(match => match[1]))]
const publications = ['/price-of-meaning.png', '/geometry-of-forgetting.png']
const logos = ['/uwaterloo.png', '/uoft.png', '/convictional.png']
const directory = resolve('public/generated')
await rm(directory, { recursive: true, force: true })
await mkdir(directory, { recursive: true })
const images = {}
let originalBytes = 0
let largestAvifBytes = 0
for (const src of [...photos, ...publications, ...logos]) {
  const input = await readFile(`public${src}`)
  const metadata = await sharp(input).metadata()
  const { width, height } = metadata.autoOrient
  const logo = logos.includes(src)
  const widths = logo ? [Math.min(width, Math.ceil(width / height * 64))] : publications.includes(src) ? [180, 360, 540] : [320, 560, 840]
  const variants = {}
  for (const format of logo ? ['webp'] : ['avif', 'webp']) {
    variants[format] = []
    for (const target of [...new Set(widths.map(w => Math.min(width, w)))]) {
      const pipeline = sharp(input).rotate().resize({ width: target, withoutEnlargement: true })
      const output = await (format === 'avif' ? pipeline.avif({ quality: 62, effort: 5 }) : pipeline.webp(logo ? { lossless: true } : { quality: 84, effort: 5 })).toBuffer({ resolveWithObject: true })
      const hash = createHash('sha256').update(output.data).digest('hex').slice(0, 12)
      const name = `${basename(src, extname(src))}-${output.info.width}-${hash}.${format}`
      await writeFile(`${directory}/${name}`, output.data)
      variants[format].push({ src: `/generated/${name}`, width: output.info.width, bytes: output.info.size })
    }
  }
  images[src] = { width, height, src: variants.webp.at(-1).src, webp: variants.webp.map(v => `${v.src} ${v.width}w`).join(', '), avif: variants.avif?.map(v => `${v.src} ${v.width}w`).join(', ') }
  originalBytes += input.length
  largestAvifBytes += (variants.avif ?? variants.webp).at(-1).bytes
}
await writeFile('src/image-manifest.json', JSON.stringify(images, null, 2) + '\n')
console.log(`Optimized ${Object.keys(images).length} images: ${originalBytes.toLocaleString()} original bytes → ${largestAvifBytes.toLocaleString()} bytes for the largest AVIF/logo variants.`)
