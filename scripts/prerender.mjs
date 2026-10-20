import { build } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'

await build({ build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr' } })
const { render } = await import('../dist-ssr/entry-server.js')
let template = await readFile('dist/index.html', 'utf8')
// The entire stylesheet is only ~4 KB compressed. Inline it so first paint
// does not wait for a separate render-blocking stylesheet request.
for (const match of template.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)) {
  const css = await readFile(`dist${match[1]}`, 'utf8')
  template = template.replace(match[0], `<style>${css}</style>`)
}
if (!template.includes('<div id="root"></div>')) throw new Error('Missing prerender root')
await writeFile('dist/index.html', template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
await rm('dist-ssr', { recursive: true, force: true })
console.log('Pre-rendered the homepage to static HTML.')
