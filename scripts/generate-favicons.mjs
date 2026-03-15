import { readFile, writeFile, access, mkdir } from 'fs/promises'
import path from 'node:path'
import url from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const pub = path.join(root, 'public')

async function ensureDir(p) {
  try {
    await mkdir(p, { recursive: true })
  } catch {}
}

async function fileExists(p) {
  try { await access(p); return true } catch { return false }
}

async function generate() {
  await ensureDir(pub)
  const srcSvg = path.join(pub, 'favicon.svg')
  const hasSvg = await fileExists(srcSvg)
  if (!hasSvg) {
    // Minimal fallback SVG if missing
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#06070b"/><circle cx="32" cy="32" r="20" fill="#00b8ff"/></svg>`
    await writeFile(srcSvg, fallback)
  }

  const svg = await readFile(srcSvg)

  const pngSizes = [16, 32, 48, 192, 512]
  for (const s of pngSizes) {
    const out = path.join(pub, `favicon-${s}.png`)
    const buf = await sharp(svg).resize(s, s, { fit: 'contain' }).png({ compressionLevel: 9 }).toBuffer()
    await writeFile(out, buf)
    console.log('wrote', path.relative(root, out))
  }

  // Apple touch icon 180x180
  const appleOut = path.join(pub, 'apple-touch-icon.png')
  const appleBuf = await sharp(svg).resize(180, 180, { fit: 'contain', background: { r: 6, g: 7, b: 11, alpha: 1 } }).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(appleOut, appleBuf)
  console.log('wrote', path.relative(root, appleOut))

  // ICO (multi-size)
  const icoSizes = [16, 32, 48, 64, 128, 256, 512]
  const icoPngs = await Promise.all(
    icoSizes.map((s) => sharp(svg).resize(s, s, { fit: 'contain' }).png({ compressionLevel: 9 }).toBuffer())
  )
  const icoBuf = await pngToIco(icoPngs)
  const icoOut = path.join(pub, 'favicon.ico')
  await writeFile(icoOut, icoBuf)
  console.log('wrote', path.relative(root, icoOut))
}

generate().catch((e) => { console.error(e); process.exit(1) })
