// node --test infra/modules/static-site/functions
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadHandler } from './load-function.mjs'

const viewerRequest = loadHandler(new URL('./viewer-request.js', import.meta.url))
const viewerResponse = loadHandler(new URL('./viewer-response.js', import.meta.url))

function request(uri, { host = 'weaiforge.com', querystring = {} } = {}) {
  return { request: { uri, querystring, headers: { host: { value: host } } } }
}

test('www redirects to the apex, keeping path and query', () => {
  const res = viewerRequest(request('/ai-agents', { host: 'www.weaiforge.com', querystring: { utm: { value: 'x' } } }))
  assert.equal(res.statusCode, 301)
  assert.equal(res.headers.location.value, 'https://weaiforge.com/ai-agents?utm=x')
  assert.match(res.headers['strict-transport-security'].value, /max-age=63072000/)
})

test('multi-value and valueless query parameters survive a redirect', () => {
  const qs = { a: { value: '1', multiValue: [{ value: '1' }, { value: '2' }] }, flag: { value: '' } }
  const res = viewerRequest(request('/privacy.html', { querystring: qs }))
  assert.equal(res.headers.location.value, '/privacy?a=1&a=2&flag')
})

test('.html, /index.html and trailing slashes redirect to clean URLs', () => {
  assert.equal(viewerRequest(request('/privacy.html')).headers.location.value, '/privacy')
  assert.equal(viewerRequest(request('/index.html')).headers.location.value, '/')
  assert.equal(viewerRequest(request('/terms/')).headers.location.value, '/terms')
})

test('clean URLs are served from their .html object', () => {
  assert.equal(viewerRequest(request('/')).uri, '/index.html')
  assert.equal(viewerRequest(request('/forward-deployed-engineering')).uri, '/forward-deployed-engineering.html')
})

test('files with extensions pass through unchanged', () => {
  for (const uri of ['/assets/App-BdBJfDR6.js', '/robots.txt', '/sitemap.xml', '/favicon.png']) {
    assert.equal(viewerRequest(request(uri)).uri, uri)
  }
})

test('viewer-response sets security headers and strips S3 headers', () => {
  const headers = { server: { value: 'AmazonS3' }, 'x-amz-version-id': { value: 'v1' }, 'content-type': { value: 'text/html' } }
  const res = viewerResponse({ response: { statusCode: 200, headers } })
  assert.equal(res.headers['x-frame-options'].value, 'DENY')
  assert.equal(res.headers['x-content-type-options'].value, 'nosniff')
  assert.match(res.headers['content-security-policy'].value, /^default-src 'self'; /)
  assert.match(res.headers['content-security-policy'].value, /frame-ancestors 'none'/)
  assert.equal(res.headers.server, undefined)
  assert.equal(res.headers['x-amz-version-id'], undefined)
  assert.equal(res.headers['content-type'].value, 'text/html')
})
