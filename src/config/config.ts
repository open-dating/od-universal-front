export const HOST = (function () {
  // if exist host in env
  if (process.env.REACT_APP_HOST) {
    return `${process.env.REACT_APP_HOST}`
  }

  // if is running in development mode, or on localhost, try to find api on 4300
  if (window.location.port && window.location.port !== '80') {
    return `${window.location.protocol}//${window.location.hostname}:4300`
  }

  // if is running with domain, e.g. app.site.com
  return `${window.location.protocol}//${window.location.hostname}`
}())
