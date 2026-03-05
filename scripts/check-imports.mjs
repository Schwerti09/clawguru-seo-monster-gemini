#!/usr/bin/env node
/**
 * check-imports.mjs
 *
 * Scans every TypeScript / JavaScript source file in the project and verifies
 * that each `@/*` aliased import resolves to a real file on disk using a
 * case-sensitive comparison.  This catches the "Module not found" errors that
 * appear on Linux (Netlify) when a file was renamed with only a case change
 * and macOS silently accepted the old casing.
 *
 * Usage:
 *   node scripts/check-imports.mjs           # exits 0 if all imports resolve
 *   node scripts/check-imports.mjs --git     # also warn about untracked files
 *
 * The script is also wired up as the `check:imports` npm script and runs
 * automatically as part of the Netlify build (see netlify.toml).
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { resolve, join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '..');

// @/* maps to the project root (mirrors tsconfig.json "paths")
const ALIAS_PREFIX = '@/';
const ALIAS_TARGET = ROOT + '/';

// Ordered list of extensions to try when an import has no explicit extension
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

// Directories to skip entirely
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'out', '.turbo']);

// ── file discovery ──────────────────────────────────────────────────────────

/** Recursively collect all source files under `dir`. */
function collectSourceFiles(dir, results = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, results);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ── import extraction ───────────────────────────────────────────────────────

/** Extract every import/require specifier from `src`. */
function extractImportSpecifiers(src) {
  const specifiers = new Set();
  const patterns = [
    // static:  import ... from '...'  /  export ... from '...'
    /(?:^|[\r\n;])[ \t]*(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/gm,
    // dynamic: import('...') / require('...')
    /(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      specifiers.add(m[1]);
    }
  }
  return [...specifiers];
}

// ── case-sensitive path resolution ─────────────────────────────────────────

/**
 * Walk `filePath` segment-by-segment and confirm every component matches the
 * real directory listing exactly (case-sensitive).
 *
 * Returns:
 *   { exists: true }                        — file found with correct casing
 *   { exists: false, hint: string | null }  — not found; `hint` is the
 *                                             differently-cased path if one
 *                                             was detected
 */
function caseSensitiveExists(filePath) {
  // Normalize: strip the root prefix and split into path segments
  const rel = filePath.startsWith(ROOT) ? filePath.slice(ROOT.length) : filePath;
  const parts = rel.split('/').filter(Boolean);

  let current = ROOT;
  for (const part of parts) {
    let entries;
    try {
      entries = readdirSync(current);
    } catch {
      return { exists: false, hint: null };
    }

    // Exact (case-sensitive) match
    if (entries.includes(part)) {
      current = join(current, part);
      continue;
    }

    // Case-insensitive fallback — used only to generate a helpful hint
    const hint = entries.find((e) => e.toLowerCase() === part.toLowerCase());
    return {
      exists: false,
      hint: hint ? join(current, hint) : null,
    };
  }

  // Confirm the final path is a regular file, not a directory
  try {
    return { exists: statSync(current).isFile(), hint: null };
  } catch {
    return { exists: false, hint: null };
  }
}

/**
 * Try to resolve a bare path (no extension or could be a directory index) to
 * an actual file, probing each extension and an `index.*` fallback.
 * Returns the resolved path string, or `null` if nothing matched.
 */
function resolveWithExtensions(base) {
  // 1. Exact path (import already carries the extension)
  if (existsSync(base)) {
    try {
      if (statSync(base).isFile()) return base;
    } catch { /* fall through */ }
  }

  // 2. Append a known extension
  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    const { exists } = caseSensitiveExists(candidate);
    if (exists) return candidate;
  }

  // 3. Directory index
  for (const ext of EXTENSIONS) {
    const candidate = join(base, 'index' + ext);
    const { exists } = caseSensitiveExists(candidate);
    if (exists) return candidate;
  }

  return null;
}

// ── git tracking check ──────────────────────────────────────────────────────

/** Return the set of files tracked by git (relative to ROOT). */
function getTrackedFiles() {
  try {
    const out = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' });
    return new Set(out.trim().split('\n').filter(Boolean));
  } catch {
    return null; // git not available – skip the check
  }
}

// ── main ────────────────────────────────────────────────────────────────────

const checkGit = process.argv.includes('--git');

const sourceFiles = collectSourceFiles(ROOT);
const trackedFiles = checkGit ? getTrackedFiles() : null;

let checkedImports = 0;
const missingFiles = [];
const untrackedFiles = [];

for (const sourceFile of sourceFiles) {
  let src;
  try {
    src = readFileSync(sourceFile, 'utf8');
  } catch {
    continue;
  }

  const specifiers = extractImportSpecifiers(src);

  for (const specifier of specifiers) {
    // Only process alias-based imports (@/...)
    if (!specifier.startsWith(ALIAS_PREFIX)) continue;

    checkedImports++;
    const absoluteBase = ALIAS_TARGET + specifier.slice(ALIAS_PREFIX.length);
    const resolved = resolveWithExtensions(absoluteBase);

    if (!resolved) {
      // Attempt to find a differently-cased version for a helpful hint
      const { hint } = caseSensitiveExists(absoluteBase);
      const hintMsg = hint
        ? `\n      → Did you mean: ${hint.replace(ROOT + '/', '@/')}`
        : '';
      missingFiles.push({
        sourceFile: sourceFile.replace(ROOT + '/', ''),
        specifier,
        hintMsg,
      });
      continue;
    }

    // Optionally verify the resolved file is tracked in git
    if (trackedFiles) {
      const rel = resolved.replace(ROOT + '/', '');
      if (!trackedFiles.has(rel)) {
        untrackedFiles.push({
          sourceFile: sourceFile.replace(ROOT + '/', ''),
          specifier,
          resolvedFile: rel,
        });
      }
    }
  }
}

// ── output ──────────────────────────────────────────────────────────────────

console.log(
  `\nScanned ${sourceFiles.length} source file(s), ` +
    `checked ${checkedImports} @/* import(s).\n`
);

let exitCode = 0;

if (missingFiles.length === 0) {
  console.log('✅  All @/* imports resolve to existing files (case-sensitive check passed).');
} else {
  console.error(`❌  ${missingFiles.length} unresolved import(s) found:\n`);
  for (const { sourceFile, specifier, hintMsg } of missingFiles) {
    console.error(`  • ${sourceFile}\n      import: "${specifier}"${hintMsg}\n`);
  }
  exitCode = 1;
}

if (untrackedFiles.length > 0) {
  console.warn(`\n⚠️   ${untrackedFiles.length} import(s) point to files not tracked by git:\n`);
  for (const { sourceFile, specifier, resolvedFile } of untrackedFiles) {
    console.warn(`  • ${sourceFile}\n      import: "${specifier}"\n      file:   ${resolvedFile}\n`);
  }
  // Untracked files are a warning, not a hard failure, so we leave exitCode as-is
}

process.exit(exitCode);
