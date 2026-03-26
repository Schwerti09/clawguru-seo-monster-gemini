// Lightweight React 18 compatibility shim for legacy imports expecting react-dom render/hydrate
// This maps render/hydrate to createRoot/hydrateRoot so that old code paths won't crash at runtime.

const ReactDOMClient = require('react-dom/client')

function render(element, container, callback) {
  if (!container) return
  const root = ReactDOMClient.createRoot(container)
  const res = root.render(element)
  if (typeof callback === 'function') callback()
  return res
}

function hydrate(element, container, callback) {
  if (!container) return
  const res = ReactDOMClient.hydrateRoot(container, element)
  if (typeof callback === 'function') callback()
  return res
}

module.exports = {
  ...ReactDOMClient,
  render,
  hydrate,
  // keep default for consumers doing `import ReactDOM from 'react-dom'`
  default: {
    ...ReactDOMClient,
    render,
    hydrate,
  },
}
