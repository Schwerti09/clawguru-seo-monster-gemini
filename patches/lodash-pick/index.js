/**
 * Safe native replacement for lodash.pick.
 * Uses Object.prototype.hasOwnProperty.call() to prevent prototype pollution.
 *
 * Note: Only flat string keys are supported (no nested path notation like 'a.b').
 * This covers all usages by @react-three/drei, which is the only consumer.
 *
 * @param {Object} object - Source object
 * @param {string|string[]} paths - Key(s) to pick
 * @returns {Object}
 */
function pick(object, paths) {
  if (object == null) return {}
  const keys = Array.isArray(paths) ? paths : [paths]
  const result = {}
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key]
    }
  }
  return result
}

module.exports = pick
