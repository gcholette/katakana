import { isDarkMode } from './storage.js'
function isTouchDevice() {
  return window.ontouchstart !== undefined
}

export function themedClass(classes) {
  const hover = !isTouchDevice() ? 'hoverable' : ''
  const dark = isDarkMode() ? 'dark' : ''
  return `${classes} ${dark} ${hover} `
}
