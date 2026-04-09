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
  
  // Fix bg-yellow-50 notice boxes -> bg-amber-900
  content = content.replace(/bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm/g, 
    'bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100');
  
  // Fix remaining bg-yellow-50 (other contexts)
  content = content.replace(/bg-yellow-50 border-l-4 border-yellow-400/g, 
    'bg-amber-900 border-l-4 border-amber-500 text-amber-100');
  
  // Fix bg-blue-50 notice boxes
  content = content.replace(/bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-sm/g,
    'bg-blue-900 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-100');
    
  // Fix remaining bg-*-50 cards
  content = content.replace(/bg-blue-50 p-6 rounded-lg border border-blue-200/g, 'bg-blue-900 p-6 rounded-lg border border-blue-700');
  content = content.replace(/bg-blue-50 p-4 rounded-lg/g, 'bg-blue-900 p-4 rounded-lg border border-blue-700');
  content = content.replace(/bg-green-50 p-6 rounded-lg/g, 'bg-green-900 p-6 rounded-lg border border-green-700');
  content = content.replace(/bg-green-50 p-4 rounded-lg/g, 'bg-green-900 p-4 rounded-lg border border-green-700');
  content = content.replace(/bg-red-50 p-6 rounded-lg/g, 'bg-red-900 p-6 rounded-lg border border-red-700');
  content = content.replace(/bg-red-50 p-4 rounded-lg/g, 'bg-red-900 p-4 rounded-lg border border-red-700');
  content = content.replace(/bg-yellow-50 p-6 rounded-lg/g, 'bg-yellow-900 p-6 rounded-lg border border-yellow-700');
  content = content.replace(/bg-yellow-50 p-4 rounded-lg/g, 'bg-yellow-900 p-4 rounded-lg border border-yellow-700');
  content = content.replace(/bg-purple-50 p-4 rounded-lg/g, 'bg-purple-900 p-4 rounded-lg border border-purple-700');
  content = content.replace(/bg-gray-50 p-4 rounded-lg/g, 'bg-gray-800 p-4 rounded-lg border border-gray-700');
  content = content.replace(/bg-gray-50 border/g, 'bg-gray-800 border');
  
  // Fix remaining text-gray-600 and text-gray-800
  content = content.replace(/text-gray-600"/g, 'text-gray-300"');
  content = content.replace(/text-gray-800"/g, 'text-gray-100"');
  content = content.replace(/text-blue-800"/g, 'text-blue-300"');
  content = content.replace(/text-green-800"/g, 'text-green-300"');
  content = content.replace(/text-red-800"/g, 'text-red-300"');
  content = content.replace(/text-yellow-800"/g, 'text-yellow-300"');
  
  // Fix border-*-200 -> border-*-700
  content = content.replace(/border-blue-200/g, 'border-blue-700');
  content = content.replace(/border-green-200/g, 'border-green-700');
  content = content.replace(/border-red-200/g, 'border-red-700');
  content = content.replace(/border-yellow-200/g, 'border-yellow-700');
  content = content.replace(/border-gray-200/g, 'border-gray-700');
  content = content.replace(/border-purple-200/g, 'border-purple-700');
  content = content.replace(/border-orange-200/g, 'border-orange-700');
  
  // Fix "Not a Pentest" strong without className
  content = content.replace(/<strong>"Not a Pentest"([^<]*)<\/strong>/g, (match) => {
    if (match.includes('className')) return match;
    return match.replace('<strong>', '<strong className="text-amber-100">');
  });
  
  // Fix remaining hover:bg-gray-200
  content = content.replace(/hover:bg-gray-200/g, 'hover:bg-gray-700');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    changed++;
    console.log(`FIXED: ${path.relative(__dirname, filePath)}`);
  }
}

console.log(`\nTotal files fixed: ${changed}`);
