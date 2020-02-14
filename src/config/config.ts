export const HOST = (function () {
  if (process.env.REACT_APP_HOST) {
    return `${process.env.REACT_APP_HOST}`
  }

  return `${window.location.protocol}//${window.location.hostname}:4300`
}())
