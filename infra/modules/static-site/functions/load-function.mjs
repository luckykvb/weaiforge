// Loads a CloudFront Function source file the way the runtime sees it (a
// script defining a global `handler`), for unit tests and CI checks.
import { readFileSync } from 'node:fs'

export function loadHandler(fileUrl) {
  const source = readFileSync(fileUrl, 'utf8')
  return new Function(`${source}\nreturn handler;`)()
}
