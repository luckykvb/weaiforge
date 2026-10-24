#!/usr/bin/env node
// Fail the build if a page loses what search engines rely on: real content in
// the HTML, one h1, a unique title/description, a correct canonical, valid
// structured data, no stray noindex, and a sitemap that matches the pages.
//
//   node scripts/check-seo.mjs [dist]      (run after `npm run build`)
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = process.argv[2] ?? 'dist'
const origin = 'https://weaiforge.com'
const problems = []
const fail = (page, msg) => problems.push(`${page}: ${msg}`)

const pages = readdirSync(dist).filter((f) => f.endsWith('.html'))
const urlFor = (file) => (file === 'index.html' ? `${origin}/` : `${origin}/${file.replace(/\.html$/, '')}`)
const meta = (html, re) => html.match(re)?.[1]?.trim()

const titles = new Map()
const descriptions = new Map()
const canonicals = new Set()

for (const page of pages) {
  const html = readFileSync(join(dist, page), 'utf8')
  const expected = urlFor(page)

  // Everything between the root div and the end of <body>: the app markup (plus any noscript fallback).
  const body = html.match(/<div id="root">([\s\S]*?)<\/body>/)?.[1] ?? ''
  if (body.length < 500) fail(page, 'prerendered content missing from #root (did scripts/prerender.mjs run?)')
  const h1s = (body.replace(/<noscript>[\s\S]*?<\/noscript>/g, '').match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(page, `expected exactly one <h1> in the prerendered HTML, found ${h1s}`)

  const title = meta(html, /<title>([^<]*)<\/title>/)
  if (!title || title.length > 70) fail(page, `title missing or over 70 characters (${title?.length ?? 0})`)
  if (title) titles.set(title, [...(titles.get(title) ?? []), page])

  const description = meta(html, /<meta\s+name="description"\s+content="([^"]*)"/)
  if (!description || description.length < 50 || description.length > 170) {
    fail(page, `meta description missing or outside 50-170 characters (${description?.length ?? 0})`)
  }
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), page])

  const canonical = meta(html, /<link\s+rel="canonical"\s+href="([^"]*)"/)
  if (canonical !== expected) fail(page, `canonical is ${canonical}, expected ${expected}`)
  canonicals.add(expected)

  const robots = meta(html, /<meta\s+name="robots"\s+content="([^"]*)"/)
  if (robots && /noindex|none/i.test(robots)) fail(page, `robots meta blocks indexing (${robots})`)

  if (!/<html[^>]*\slang="/.test(html)) fail(page, '<html> has no lang attribute')

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json) } catch (e) { fail(page, `invalid JSON-LD: ${e.message}`) }
  }

  const isLegal = page === 'privacy.html' || page === 'terms.html'
  if (!isLegal) {
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
      if (!new RegExp(`property="${prop}"\\s+content="https?://|property="${prop}"\\s+content="[^"]+"`).test(html)) fail(page, `missing ${prop}`)
    }
    if (!/property="og:image"\s+content="https:\/\//.test(html)) fail(page, 'og:image must be an absolute https URL')
    if (!/application\/ld\+json/.test(html)) fail(page, 'no structured data')
  }

  // Every internal link in the rendered page must land on a real page.
  for (const [, href] of body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) {
    const target = href === '/' ? 'index.html' : `${href.slice(1)}.html`
    if (!pages.includes(target)) fail(page, `internal link ${href} has no matching page`)
  }
}

for (const [label, map] of [['title', titles], ['description', descriptions]]) {
  for (const [value, owners] of map) if (owners.length > 1) problems.push(`duplicate ${label} on ${owners.join(', ')}: "${value}"`)
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
for (const url of canonicals) if (!locs.includes(url)) problems.push(`sitemap.xml is missing ${url}`)
for (const url of locs) if (!canonicals.has(url)) problems.push(`sitemap.xml lists ${url}, which is not a built page`)
for (const [, lastmod] of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) problems.push(`sitemap.xml has a malformed lastmod: ${lastmod}`)
}

const robotsTxt = readFileSync(join(dist, 'robots.txt'), 'utf8')
if (!robotsTxt.includes(`Sitemap: ${origin}/sitemap.xml`)) problems.push('robots.txt does not point to the sitemap')
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) problems.push('robots.txt disallows the whole site')

for (const problem of problems) console.log(`::error::${problem}`)
console.log(`seo check: ${pages.length} pages, ${problems.length} problems`)
process.exit(problems.length ? 1 : 0)
