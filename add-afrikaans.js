const fs = require('fs');
const path = require('path');

const afrikaansTranslations = {
  // Generic fallbacks - can be overridden per file
  titles: {
    de: "German",
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    it: "Italian",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ar: "Arabic",
    nl: "Dutch",
    hi: "Hindi",
    tr: "Turkish",
    pl: "Polish",
    ko: "Korean",
    af: "Afrikaans",
  }
};

const filesToCheck = [
  'lib/content-ai-agent-threat-model-i18n.ts',
  'lib/content-api-key-leak-response-i18n.ts',
  'lib/content-check-methodology-i18n.ts',
  'lib/content-check-vs-pentest-i18n.ts',
  'lib/content-docker-reverse-proxy-hardening-i18n.ts',
  'lib/content-hetzner-vs-do-baseline-i18n.ts',
  'lib/content-nis2-controls-i18n.ts',
  'lib/content-runbook-vs-blog-i18n.ts',
  'lib/content-openclaw-misconfigs-i18n.ts',
  'lib/content-gateway-auth-10-steps-i18n.ts',
  'lib/homepage-cro-i18n.ts',
  'lib/landing-pages-i18n.ts',
  'lib/roast/prompt.ts',
  'app/[lang]/runbooks/page.tsx',
  'app/[lang]/roast-my-stack/opengraph-image.tsx',
  'app/[lang]/roast-my-moltbot/page.tsx',
  'components/layout/LanguageSwitcher.tsx',
  'components/i18n/I18nProvider.tsx',
];

let totalChanges = 0;

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Pattern to find Record<Locale, string> objects and add af: "..." before the closing brace
  // This handles both Record<Locale, string> and Partial<Record<Locale, string>>
  const recordPattern = /(\w+):\s*(?:Partial<)?Record<Locale,\s*string>?>?\s*=\s*\{([^}]+)\}/gs;
  
  content = content.replace(recordPattern, (match, varName, objContent) => {
    // Check if af: already exists
    if (objContent.includes('af:')) {
      return match; // Skip if already has af
    }

    // Find the last entry before the closing brace and add af after it
    const entries = objContent.trim().split('\n').map(line => line.trim()).filter(line => line);
    if (entries.length === 0) return match;

    const lastEntry = entries[entries.length - 1];
    const lastKey = lastEntry.split(':')[0].trim();
    
    // Add af entry with a generic fallback based on context
    let afValue = '"Afrikaans"';
    
    // Try to infer a better value from the last entry
    if (lastEntry.includes('|')) {
      // It's likely a title like "Account | ClawGuru"
      afValue = '"Afrikaans | ClawGuru"';
    } else if (lastEntry.includes('ClawGuru')) {
      afValue = lastEntry.replace(/"[^"]+"/, (match) => {
        const text = match.replace(/"/g, '');
        return `"${text} (Afrikaans)"`;
      });
    }

    const newContent = objContent.trim() + `,\n    af: ${afValue}`;
    return `${varName}: ${match.includes('Partial') ? 'Partial<Record<Locale, string>>' : 'Record<Locale, string>'} = {\n    ${newContent.replace(/\n/g, '\n    ')}\n  }`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    totalChanges++;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log(`\n📊 Total files updated: ${totalChanges}`);
