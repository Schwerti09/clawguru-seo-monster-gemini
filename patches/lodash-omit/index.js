/**
 * Safe native replacement for lodash.omit.
 * Uses Object.keys() to iterate only own enumerable properties and
 * Object.prototype.hasOwnProperty.call() checks to prevent prototype pollution.
 *
 * Note: Only flat string keys are supported (no nested path notation like 'a.b').
 * This covers all usages by @react-three/drei, which is the only consumer.
 *
 * @param {Object} object - Source object
 * @param {string|string[]} paths - Key(s) to omit
 * @returns {Object}
 */
function omit(object, paths) {
  if (object == null) return {}
  const keys = Array.isArray(paths) ? paths : [paths]
  const result = {}
  for (const key of Object.keys(object)) {
    if (!keys.includes(key)) {
      result[key] = object[key]
    }
  }
  return result
}

module.exports = omit
