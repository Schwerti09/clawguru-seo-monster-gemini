const fs = require('fs');
const path = require('path');

function fixBrokenFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixBrokenFiles(fullPath);
    } else if (file.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if file is broken (missing closing brace)
      if (content.includes('alternates: { }') && !content.includes('alternates: { }')) {
        console.log(`Fixing broken file: ${fullPath}`);
        
        // Fix the broken alternates object
        content = content.replace(
          /alternates: { \}/g,
          "alternates: { canonical: `/${locale}/" + file.name.replace('.tsx', '') + "` }"
        );
        
        // Add missing closing brace for generateMetadata function
        content = content.replace(
          /alternates: \{ canonical: `.*` \}\n(\nexport default)/,
          "alternates: { canonical: `$1` }\n  }\n$2"
        );
        
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

const langDir = path.join(__dirname, 'app/[lang]');
fixBrokenFiles(langDir);
console.log('Done fixing broken files!');
