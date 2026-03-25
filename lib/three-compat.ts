// Compatibility shim for 'three' imports. We simply re-export from 'three'.
// Keeping this layer allows us to polyfill/migrate symbols centrally if ever needed.
export * from "three"
import * as THREE from "three"
export default THREE
