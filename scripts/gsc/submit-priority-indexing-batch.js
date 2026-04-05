try {
  require('dotenv').config();
  require('dotenv').config({ path: '.env.local' });
} catch {}

const D4_CITIES = [
  'warsaw',
  'krakow',
  'wroclaw',
  'budapest',
  'bucharest',
  'sofia',
  'athens',
  'thessaloniki',
  'bratislava',
  'zagreb',
  'ljubljana',
  'belgrade',
];

const CORE_PRIORITY_PATHS = [
  '/de/openclaw',
  '/en/openclaw',
  '/de/check',
  '/en/check',
  '/de/runbooks',
  '/en/runbooks',
  '/de/moltbot-hardening',
  '/en/ai-agent-security',
];

function getArg(name, fallback = '') {
  const arg = process.argv.find((x) => x.startsWith(`--${name}=`));
  if (!arg) return fallback;
  return arg.split('=').slice(1).join('=');
}

function normalizeBase(raw) {
  return String(raw || 'https://clawguru.org').replace(/\/+$/, '');
}

function buildD4Urls(base) {
  return D4_CITIES.flatMap((city) => [
    `${base}/de/${city}/openclaw-risk-2026`,
    `${base}/en/${city}/openclaw-exposed`,
  ]);
}

function buildCoreUrls(base) {
  return CORE_PRIORITY_PATHS.map((path) => `${base}${path}`);
}

function selectUrls(base, batch) {
  const d4Urls = buildD4Urls(base);
  const coreUrls = buildCoreUrls(base);
  if (batch === 'd4') return { urls: d4Urls, d4Urls, coreUrls };
  if (batch === 'core') return { urls: coreUrls, d4Urls, coreUrls };
  return { urls: [...d4Urls, ...coreUrls], d4Urls, coreUrls };
}

async function main() {
  const mode = getArg('mode', 'dry-run');
  const batch = getArg('batch', 'all');
  const base = normalizeBase(
    getArg('base', process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://clawguru.org')
  );

  if (!['dry-run', 'live'].includes(mode)) {
    throw new Error(`Unsupported mode: ${mode}`);
  }
  if (!['all', 'd4', 'core'].includes(batch)) {
    throw new Error(`Unsupported batch: ${batch}`);
  }

  const { urls, d4Urls, coreUrls } = selectUrls(base, batch);
  const payload = {
    mode,
    batch,
    base,
    total: urls.length,
    tiers: {
      d4: d4Urls,
      core: coreUrls,
    },
    urls,
  };

  if (mode === 'dry-run') {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const token = process.env.ADMIN_API_TOKEN || '';
  if (!token) {
    throw new Error('ADMIN_API_TOKEN missing');
  }

  const endpoint = `${base}/api/admin/index-urls`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-token': token,
      'user-agent': 'clawguru-gsc-priority-batch/1.0',
    },
    body: JSON.stringify({ urls }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`Indexing request failed (${res.status}): ${JSON.stringify(json)}`);
  }

  console.log(
    JSON.stringify(
      {
        ...payload,
        endpoint,
        response: json,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
