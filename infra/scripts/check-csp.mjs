#!/usr/bin/env node
// Fail if the built site needs something the edge Content-Security-Policy
// would block: an inline script without a matching sha256 in script-src, or an
// external script/stylesheet host that isn't allow-listed.
//
//   node infra/scripts/check-csp.mjs [dist]
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadHandler } from '../modules/static-site/functions/load-function.mjs'

const dist = process.argv[2] ?? 'dist'
const viewerResponse = loadHandler(new URL('../modules/static-site/functions/viewer-response.js', import.meta.url))
const csp = viewerResponse({ response: { headers: {} } }).headers['content-security-policy'].value

const directives = Object.fromEntries(
  csp.split(';').map((d) => d.trim().split(/\s+/)).map(([name, ...sources]) => [name, sources]),
)
const allowed = (directive) => directives[directive] ?? directives['default-src'] ?? []

const problems = []
const pages = readdirSync(dist).filter((f) => f.endsWith('.html'))

for (const page of pages) {
  // CI builds on Linux (LF); normalise so a Windows CRLF checkout hashes the same.
  const html = readFileSync(join(dist, page), 'utf8').replaceAll('\r\n', '\n')

  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const src = attrs.match(/\bsrc=["']([^"']+)/)?.[1]
    if (src) {
      if (/^https?:/.test(src) && !allowed('script-src').includes(new URL(src).origin)) {
        problems.push(`${page}: script ${src} is not allowed by script-src`)
      }
      continue
    }
    if (/type=["']application\/ld\+json["']/.test(attrs)) continue // data block, not executed
    const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`
    if (!allowed('script-src').includes(hash)) {
      problems.push(`${page}: inline script needs ${hash} in script-src (viewer-response.js)`)
    }
  }

  for (const [tag] of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/g)) {
    const href = tag.match(/\bhref=["']([^"']+)/)?.[1]
    if (href && /^https?:/.test(href) && !allowed('style-src').includes(new URL(href).origin)) {
      problems.push(`${page}: stylesheet ${href} is not allowed by style-src`)
    }
  }

  if (/\sstyle=["']/.test(html)) {
    problems.push(`${page}: inline style attribute is blocked by style-src (no 'unsafe-inline')`)
  }
}

for (const problem of problems) console.log(`::error::${problem}`)
console.log(`csp check: ${pages.length} pages, ${problems.length} problems`)
process.exit(problems.length ? 1 : 0)
