const fs = require('fs');
const path = require('path');

const langDir = path.join(__dirname, 'app', '[lang]');

// Directories to scan
const scanDirs = [
  path.join(langDir, 'moltbot'),
  path.join(langDir, 'openclaw'),
  path.join(langDir, 'solutions'),
  // Compare pages directly in [lang]
  langDir
];

// Files to skip (already perfect or not content pages)
const skipFiles = new Set([
  'page.tsx' // root [lang]/page.tsx
]);

// Only process page.tsx files that have the problematic classes
const REPLACEMENTS = [
  // Notice box
  ['bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm', 'bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100'],
  
  // Card backgrounds - outer containers
  [/className="bg-gray-100 p-6 rounded-lg"/g, 'className="bg-gray-800 p-6 rounded-lg border border-gray-700"'],
  
  // Card backgrounds - inner cards  
  [/className="bg-gray-100 p-4 rounded-lg"/g, 'className="bg-gray-800 p-4 rounded-lg border border-gray-700"'],
  
  // Card backgrounds - mb-4 variant
  [/className="bg-gray-100 p-4 rounded-lg mb-4"/g, 'className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700"'],
  
  // Link cards with hover
  [/block bg-gray-100 p-4 rounded-lg hover:bg-gray-200/g, 'block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors'],
  
  // Colored cards - blue
  [/bg-blue-100 p-4 rounded-lg/g, 'bg-blue-900 p-4 rounded-lg border border-blue-700'],
  [/bg-blue-50 p-4 rounded-lg/g, 'bg-blue-900 p-4 rounded-lg border border-blue-700'],
  
  // Colored cards - green
  [/bg-green-100 p-4 rounded-lg/g, 'bg-green-900 p-4 rounded-lg border border-green-700'],
  [/bg-green-50 p-4 rounded-lg/g, 'bg-green-900 p-4 rounded-lg border border-green-700'],
  
  // Colored cards - yellow
  [/bg-yellow-100 p-4 rounded-lg/g, 'bg-yellow-900 p-4 rounded-lg border border-yellow-700'],
  
  // Colored cards - red
  [/bg-red-100 p-4 rounded-lg/g, 'bg-red-900 p-4 rounded-lg border border-red-700'],
  [/bg-red-50 p-4 rounded-lg/g, 'bg-red-900 p-4 rounded-lg border border-red-700'],
  
  // Colored cards - purple
  [/bg-purple-100 p-4 rounded-lg/g, 'bg-purple-900 p-4 rounded-lg border border-purple-700'],
  [/bg-purple-50 p-4 rounded-lg/g, 'bg-purple-900 p-4 rounded-lg border border-purple-700'],
  
  // Colored cards - indigo
  [/bg-indigo-100 p-4 rounded-lg/g, 'bg-indigo-900 p-4 rounded-lg border border-indigo-700'],
  [/bg-indigo-50 p-4 rounded-lg/g, 'bg-indigo-900 p-4 rounded-lg border border-indigo-700'],
  
  // Colored cards - orange
  [/bg-orange-100 p-4 rounded-lg/g, 'bg-orange-900 p-4 rounded-lg border border-orange-700'],
  [/bg-orange-50 p-4 rounded-lg/g, 'bg-orange-900 p-4 rounded-lg border border-orange-700'],
  
  // Text colors - headings
  [/text-gray-800 mb-3/g, 'text-cyan-400 mb-3'],
  [/text-gray-800 mb-2/g, 'text-gray-100 mb-2'],
  
  // Text colors - body text
  [/text-sm text-gray-600/g, 'text-sm text-gray-300'],
  [/text-gray-600 mb-8/g, 'text-gray-300 mb-8'],
  [/text-gray-600 mb-4/g, 'text-gray-300 mb-4'],
  [/text-gray-600 mb-6/g, 'text-gray-300 mb-6'],
  [/text-gray-700 mb/g, 'text-gray-300 mb'],
  
  // Colored text replacements
  [/text-blue-800 mb-2/g, 'text-blue-300 mb-2'],
  [/text-blue-800 mb-3/g, 'text-blue-300 mb-3'],
  [/text-blue-700"/g, 'text-blue-200"'],
  [/text-blue-600"/g, 'text-cyan-400"'],
  
  [/text-green-800 mb-2/g, 'text-green-300 mb-2'],
  [/text-green-800 mb-3/g, 'text-green-300 mb-3'],
  [/text-green-700"/g, 'text-green-200"'],
  
  [/text-yellow-800 mb-2/g, 'text-yellow-300 mb-2'],
  [/text-yellow-800 mb-3/g, 'text-yellow-300 mb-3'],
  [/text-yellow-700"/g, 'text-yellow-200"'],
  
  [/text-red-800 mb-2/g, 'text-red-300 mb-2'],
  [/text-red-800 mb-3/g, 'text-red-300 mb-3'],
  [/text-red-700"/g, 'text-red-200"'],
  
  [/text-purple-800 mb-2/g, 'text-purple-300 mb-2'],
  [/text-purple-800 mb-3/g, 'text-purple-300 mb-3'],
  [/text-purple-700"/g, 'text-purple-200"'],
  
  [/text-indigo-800 mb-2/g, 'text-indigo-300 mb-2'],
  [/text-indigo-800 mb-3/g, 'text-indigo-300 mb-3'],
  [/text-indigo-700"/g, 'text-indigo-200"'],
  
  [/text-orange-800 mb-2/g, 'text-orange-300 mb-2'],
  [/text-orange-800 mb-3/g, 'text-orange-300 mb-3'],
  [/text-orange-700"/g, 'text-orange-200"'],
];

// Additional regex replacements for headings and lists that don't have dark text
const HEADING_REPLACEMENTS = [
  // h2 headings without text-gray-100
  [/(<h2 className="text-2xl font-semibold mb-4)(")/g, '$1 text-gray-100$2'],
  // h1 headings without text-gray-100
  [/(<h1 className="text-4xl font-bold mb-4)(")/g, '$1 text-gray-100$2'],
  // h3 headings with font-semibold mb-2 without light text
  [/(<h3 className="font-semibold mb-2)(")/g, '$1 text-gray-100$2'],
  // h3 headings with font-bold without light text
  [/(<h3 className="font-bold )(text-gray-800)/g, '$1text-cyan-400'],
  // ul lists without text-gray-300
  [/(<ul className="list-disc list-inside space-y-1)(")/g, '$1 text-gray-300$2'],
  [/(<ul className="space-y-2 text-sm)(")/g, '$1 text-gray-300$2'],
  // p tags with text-lg text-gray-600
  [/text-lg text-gray-600/g, 'text-lg text-gray-300'],
  // Notice box strong tag
  [/<strong>"Not a Pentest" Notice<\/strong>/g, '<strong className="text-amber-100">"Not a Pentest" Notice</strong>'],
  // div font-semibold without text color (in step cards)
  [/(<div className="font-semibold)(")/g, '$1 text-gray-100$2'],
];

function getAllPageFiles(dir, depth = 0) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // For langDir root, only go into specific compare/security page dirs, not moltbot/openclaw/solutions
      if (dir === langDir && ['moltbot', 'openclaw', 'solutions', 'admin', 'account', 'affiliate', 'academy', 'check', 'copilot', 'dashboard', 'intel', 'issue', 'neuro', 'oracle', 'pricing', 'provenance', 'runbook', 'runbooks', 'tools', 'waf-2027', 'compare', 'moltbot-vs-clawbot'].includes(entry.name)) {
        if (['moltbot', 'openclaw', 'solutions'].includes(entry.name)) {
          files.push(...getAllPageFiles(fullPath, depth + 1));
        }
        continue;
      }
      files.push(...getAllPageFiles(fullPath, depth + 1));
    } else if (entry.name === 'page.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

let totalChanged = 0;
let totalFiles = 0;
const changedFiles = [];

// Get all page.tsx files
const allFiles = getAllPageFiles(langDir);

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Skip files that don't have any of the problematic patterns
  if (!content.includes('bg-gray-100') && !content.includes('bg-yellow-50') && 
      !content.includes('text-gray-600') && !content.includes('text-gray-800') &&
      !content.includes('bg-blue-100') && !content.includes('bg-green-100') &&
      !content.includes('bg-red-100') && !content.includes('bg-purple-100')) {
    continue;
  }
  
  totalFiles++;
  
  // Apply all replacements
  for (const [search, replace] of REPLACEMENTS) {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  
  // Apply heading/list replacements
  for (const [search, replace] of HEADING_REPLACEMENTS) {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  
  // Fix any remaining bg-gray-100 that might be in other patterns
  // Replace hover:bg-gray-100 with hover:bg-gray-700
  content = content.replace(/hover:bg-gray-100/g, 'hover:bg-gray-700');
  content = content.replace(/hover:bg-gray-200/g, 'hover:bg-gray-700');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    const relPath = path.relative(__dirname, filePath);
    changedFiles.push(relPath);
    totalChanged++;
    console.log(`FIXED: ${relPath}`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Total files scanned with issues: ${totalFiles}`);
console.log(`Total files changed: ${totalChanged}`);
console.log(`\nChanged files:`);
changedFiles.forEach(f => console.log(`  - ${f}`));
