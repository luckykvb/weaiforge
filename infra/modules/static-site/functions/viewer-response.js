// CloudFront Function (cloudfront-js-2.0), viewer-response.
// Security headers live here rather than in a response headers policy because
// the CloudFront flat-rate Free plan only allows AWS-managed policies.
//
// script-src hashes cover the inline theme bootstrap in privacy.html/terms.html.
// infra/scripts/check-csp.mjs fails CI when the build has an inline script whose
// hash is missing here, so update both together.

var CSP = [
  "default-src 'self'",
  "script-src 'self' 'sha256-7PLvr3KkzWBoJK0cM9UoE7K3IzdReyukqVzwsY23fpQ='",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  'frame-src https://calendly.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

var SECURITY_HEADERS = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'content-security-policy': CSP,
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'cross-origin-opener-policy': 'same-origin',
};

// S3 implementation details the viewer doesn't need.
var STRIP_HEADERS = ['server', 'x-amz-server-side-encryption', 'x-amz-version-id'];

function handler(event) {
  var headers = event.response.headers;
  for (var name in SECURITY_HEADERS) {
    headers[name] = { value: SECURITY_HEADERS[name] };
  }
  for (var i = 0; i < STRIP_HEADERS.length; i++) {
    delete headers[STRIP_HEADERS[i]];
  }
  return event.response;
}
