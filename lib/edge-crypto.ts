const encoder = new TextEncoder()
const decoder = new TextDecoder()

function bytesToBase64(bytes: Uint8Array) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64")
  }
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export function base64ToBytes(base64: string) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"))
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function encodeUtf8(input: string) {
  return encoder.encode(input)
}

export function decodeUtf8(bytes: Uint8Array) {
  return decoder.decode(bytes)
}

export function base64UrlEncode(input: string | Uint8Array) {
  const bytes = typeof input === "string" ? encodeUtf8(input) : input
  return bytesToBase64(bytes).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

export function base64UrlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  return base64ToBytes(base64)
}

export async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encodeUtf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encodeUtf8(data))
  return new Uint8Array(signature)
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0
}
