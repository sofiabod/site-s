import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// Keep the React component API with Preact's smaller browser runtime.
const aliases = [
  { find: 'react-dom/client', replacement: 'preact/compat/client' },
  { find: 'react-dom/server', replacement: 'preact-render-to-string' },
  { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
  { find: 'react/jsx-dev-runtime', replacement: 'preact/jsx-dev-runtime' },
  { find: 'react-dom', replacement: 'preact/compat' },
  { find: 'react', replacement: 'preact/compat' },
]

export default defineConfig({
  plugins: [preact()],
  resolve: { alias: aliases },
  // Apply the same runtime to the build-time renderer and browser bundle.
  ssr: { noExternal: ['react', 'react-dom', 'preact', 'preact-render-to-string'] },
})
