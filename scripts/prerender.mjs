#!/usr/bin/env node
// Bake each page's React output into dist/*.html so crawlers and link-preview
// bots get real content without running JavaScript. The client still mounts
// with createRoot, which replaces this markup, so behaviour is unchanged.
//
//   node scripts/prerender.mjs     (runs after `vite build`)
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const dist = resolve('dist')
// Inside the project so the bundle can resolve react from node_modules.
const ssrDir = resolve('.prerender-ssr')

const pages = [
  { file: 'index.html', path: '/', render: (m) => m.renderApp() },
  { file: 'ai-agents.html', path: '/ai-agents', render: (m) => m.renderApp() },
  { file: 'forward-deployed-engineering.html', path: '/forward-deployed-engineering', render: (m) => m.renderApp() },
  { file: 'privacy.html', path: '/privacy', render: (m) => m.renderLegal('privacy') },
  { file: 'terms.html', path: '/terms', render: (m) => m.renderLegal('terms') },
]

try {
  await build({
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.jsx', outDir: ssrDir, emptyOutDir: true, rollupOptions: { output: { format: 'esm' } } },
  })
  const mod = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)

  for (const { file, path, render } of pages) {
    globalThis.location = { pathname: path }
    const markup = render(mod)
      // The edge CSP has no 'unsafe-inline' for styles; React re-applies these on mount.
      .replace(/\sstyle="[^"]*"/g, '')
    const target = join(dist, file)
    const html = readFileSync(target, 'utf8')
    if (!html.includes('<div id="root"></div>')) throw new Error(`${file}: empty #root not found`)
    writeFileSync(target, html.replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`))
    console.log(`prerendered ${file} (${markup.length} bytes)`)
  }
} finally {
  delete globalThis.location
  rmSync(ssrDir, { recursive: true, force: true })
}
