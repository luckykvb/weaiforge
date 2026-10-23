// CloudFront Function (cloudfront-js-2.0), viewer-request.
//   www.<apex>/path?q  -> 301 https://<apex>/path?q
//   /index.html, /x.html, /x/ -> 301 to the clean URL (/, /x)
//   /x (no extension)  -> served from /x.html (Vercel-style cleanUrls)
// Redirects are generated at the edge and never reach the viewer-response
// function, so they carry HSTS themselves.

var HSTS = 'max-age=63072000; includeSubDomains';

function querySuffix(querystring) {
  var parts = [];
  for (var key in querystring) {
    var param = querystring[key];
    var values = param.multiValue ? param.multiValue : [param];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i].value === '' ? key : key + '=' + values[i].value);
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location },
      'strict-transport-security': { value: HSTS },
      'cache-control': { value: 'public, max-age=3600' },
    },
  };
}

function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value.toLowerCase() : '';
  var uri = request.uri;

  if (host.indexOf('www.') === 0) {
    return redirect('https://' + host.slice(4) + uri + querySuffix(request.querystring));
  }

  if (uri === '/index.html') {
    return redirect('/' + querySuffix(request.querystring));
  }
  if (uri.length > 5 && uri.slice(-5) === '.html') {
    return redirect(uri.slice(0, -5) + querySuffix(request.querystring));
  }
  if (uri.length > 1 && uri.slice(-1) === '/') {
    return redirect(uri.replace(/\/+$/, '') + querySuffix(request.querystring));
  }

  if (uri === '/') {
    request.uri = '/index.html';
  } else if (uri.slice(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    request.uri = uri + '.html';
  }
  return request;
}
