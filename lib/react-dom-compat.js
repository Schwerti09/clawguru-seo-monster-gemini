// React 18/19 compatibility shim for legacy imports expecting `react-dom` to export `render`/`hydrate`.
// We expose `render` and `hydrate` backed by createRoot/hydrateRoot and re-export useful symbols.

// IMPORTANT: next.config.js aliases only the exact specifier 'react-dom' to this file.
// To avoid alias recursion and React 19 export map restrictions, import Next's compiled bundle.
let ReactDOM
try {
  ReactDOM = require('next/dist/compiled/react-dom')
} catch {
  ReactDOM = {}
}
let ReactDOMClient
try {
  ReactDOMClient = require('react-dom/client')
} catch {
  ReactDOMClient = {}
}

const ROOTS = new WeakMap()

function render(element, container, callback) {
  if (!container) return
  let root = ROOTS.get(container)
  if (!root) {
    root = ReactDOMClient.createRoot(container)
    ROOTS.set(container, root)
  }
  const res = root.render(element)
  if (typeof callback === 'function') callback()
  return res
}

function hydrate(element, container, callback) {
  if (!container) return
  // hydrateRoot attaches to existing SSR markup; no root caching is needed
  const res = ReactDOMClient.hydrateRoot(container, element)
  if (typeof callback === 'function') callback()
  return res
}

const merged = {
  ...ReactDOM,
  ...ReactDOMClient,
  render,
  hydrate,
}

module.exports = { ...merged, default: merged }
