const fs = require('fs');
const path = require('path');

const langDir = path.join(__dirname, 'app', '[lang]');

function getAllPageFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllPageFiles(fullPath));
    } else if (entry.name === 'page.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

let changed = 0;
const allFiles = getAllPageFiles(langDir);

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Table headers: bg-gray-50 -> bg-gray-800
  content = content.replace(/(<thead[^>]*className=")bg-gray-50/g, '$1bg-gray-800');
  content = content.replace(/className="bg-gray-50"/g, 'className="bg-gray-800"');
  
  // Table zebra rows: bg-gray-50 -> bg-gray-800/50
  content = content.replace(/(<tr[^>]*className=")bg-gray-50/g, '$1bg-gray-800/50');
  
  // Remaining bg-gray-50 (catch-all)
  content = content.replace(/bg-gray-50/g, 'bg-gray-800');
  
  // Remaining bg-yellow-50 (catch-all)
  content = content.replace(/bg-yellow-50/g, 'bg-amber-900');
  
  // Table bg-white -> bg-gray-900
  content = content.replace(/min-w-full bg-white/g, 'min-w-full bg-gray-900');
  
  // text-gray-900 in tables -> text-gray-100
  content = content.replace(/text-gray-900/g, 'text-gray-100');
  
  // text-gray-500 -> text-gray-400
  content = content.replace(/text-gray-500/g, 'text-gray-400');
  
  // text-green-600 -> text-green-400
  content = content.replace(/text-green-600/g, 'text-green-400');
  
  // text-yellow-600 -> text-yellow-400
  content = content.replace(/text-yellow-600/g, 'text-yellow-400');
  
  // text-red-600 in table cells -> text-red-400
  content = content.replace(/text-red-600/g, 'text-red-400');
  
  // text-orange-600 -> text-orange-400
  content = content.replace(/text-orange-600/g, 'text-orange-400');
  
  // text-blue-600 -> text-cyan-400
  content = content.replace(/text-blue-600/g, 'text-cyan-400');
  
  // bg-blue-50 -> bg-blue-900
  content = content.replace(/bg-blue-50/g, 'bg-blue-900');
  
  // bg-green-50 -> bg-green-900
  content = content.replace(/bg-green-50/g, 'bg-green-900');
  
  // bg-red-50 -> bg-red-900
  content = content.replace(/bg-red-50/g, 'bg-red-900');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    changed++;
    console.log(`FIXED: ${path.relative(__dirname, filePath)}`);
  }
}

console.log(`\nTotal files fixed: ${changed}`);
