const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'dictionaries', 'en.json');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);

function ensure(obj, key, val){ if (obj[key] === undefined) obj[key] = val; }
function ensureSection(target, name, defaults){
  if (target[name] === undefined) { target[name] = {...defaults}; return; }
  const sec = target[name];
  for (const [k,v] of Object.entries(defaults)) if (sec[k] === undefined) sec[k] = v;
}

if (!data.common) data.common = {};
ensure(data.common, 'locale_detected', 'We detected');
ensure(data.common, 'switch_language', 'Switch language?');
ensure(data.common, 'stay_here', 'Stay here');
ensure(data.common, 'switch', 'Switch');

if (!data.nav) data.nav = {};
ensure(data.nav, 'command_center', 'Command Center');
ensure(data.nav, 'account', 'Account');
ensure(data.nav, 'support', 'Support');
ensure(data.nav, 'solutions', 'Solutions');
ensure(data.nav, 'company', 'Company');

ensureSection(data, 'intel', {
  hero_badge: 'Intel - Live CVE + Runbooks',
  hero_title: 'Intel - The Mycelial Threat Intelligence Center',
  hero_subline: 'Real-time CVE feeds, AI-driven risk analysis and direct runbook recommendations. Stay one step ahead.',
  cta_daypass: 'Buy Day Pass',
  upgrade_premium_label: 'Premium',
  upgrade_title: 'More visibility with Day Pass',
  upgrade_text: 'Full CVE feed, export (CSV/PDF), advanced filters and automatic runbook execution.',
  upgrade_button: 'Start Day Pass',
  live_header: 'Live Threat Feed',
  live_loading: 'Loading CVE feed...',
  live_error: 'Feed load error',
  export_csv: 'Export CSV',
  export_json: 'Export JSON',
  export_pdf: 'PDF (Print)',
  fix_link_label: 'Open fix runbook',
  free_teaser_text: 'Only the last 5 CVEs visible. With Day Pass you see the full feed and can export.',
  free_teaser_button: 'Buy Day Pass',
  analyzer_header: 'CVE Analyzer & Runbook Matcher',
  analyzer_input_placeholder: 'CVE ID (e.g. CVE-2024-6387) or keyword (e.g. ssh)',
  analyzing_label: 'Analyzing...',
  analyze_btn: 'Analyze',
  feed_loading: 'Loading feed...',
  examples_label: 'Examples',
  published_label: 'Published',
  recommended_runbook_label: 'Recommended Runbook',
  link_oracle: 'Oracle',
  link_mycelium: 'Mycelium',
  link_neuro: 'Neuro',
  link_fix_page: 'Fix page',
  analyzer_error: 'Analyzer load error',
  predictive_header: 'Predictive Threat Radar',
  predictive_loading: 'Loading predictions...',
  predictive_more: 'More in the Oracle dashboard ->',
  predictive_error: 'Oracle error',
  stats_header: 'Statistics & Trends',
  stats_loading: 'Loading statistics...',
  stats_error: 'Stats load error',
  tile_new_7d: 'New CVEs (7d)',
  tile_with_runbooks: 'CVEs with Runbooks',
  tile_avg_cvss: 'Avg CVSS',
  tile_top_services: 'Top Services',
  spark_title: 'CVE publications (14 days)'
});

ensureSection(data, 'oracle', {
  hero_title: 'Oracle - Your predictive risk radar',
  hero_subline: 'See which vulnerabilities will matter next - with concrete runbook recommendations and probabilities.',
  cta_daypass: 'Buy Day Pass',
  how_title: 'How Oracle works',
  how_text: 'Oracle links current CVE feeds with your technologies and prioritizes the most urgent threats. For each risk you see probabilities, affected services and matching runbooks.',
  how_diagram: 'Radar visualization',
  example_scopes_title: 'Example scopes',
  example_scopes_items: ['AWS','GCP','Azure','Kubernetes'],
  upgrade_title: 'More power with Day Pass',
  upgrade_items: [
    'Detailed risk reports as PDF',
    'Automatic execution of recommended runbooks',
    'Export risk data for SIEM/Ticketing'
  ],
  upgrade_button: 'Start Day Pass',
  scope_label: 'Scope',
  scope_all: 'All',
  error_load: 'Load error.',
  critical_risks_title: 'Critical Risks',
  probability_label: 'Probability',
  timeline_prefix: 'First critical threat expected from: ',
  recommended_runbook_link: 'Recommended Runbook ->',
  empty_state: 'No acute risks detected for the selected scope.'
});

ensureSection(data, 'neuro', {
  hero_title: 'Neuro - Your personal runbook guide',
  hero_subline: 'State your technology stack - ClawGuru finds the most important runbooks, prioritizes by relevance and gives you a clear plan.',
  metrics_tags_selected: 'Tags selected',
  metrics_recommendations: 'Recommendations (live)',
  cta_daypass: 'Buy Day Pass',
  how_title: 'How Neuro works',
  how_text: 'Neuro compares your technology stack with the tags in our runbook database, scores relevance in % and creates a clear execution plan.',
  how_diagram: 'Visualization',
  upgrade_title: 'More power with Day Pass',
  upgrade_items: [
    'Stack-based recommendations as PDF',
    'Automatic execution of selected runbooks',
    'Export recommendations for ticketing/teams'
  ],
  upgrade_button: 'Start Day Pass',
  error_load: 'Load error.',
  empty_hint: 'Select one or more technology tags above to receive personalized runbook recommendations.',
  stack_label: 'Your stack',
  stack_placeholder: 'Add tags (Enter) - e.g. aws, nginx',
  add_button: 'Add',
  example_stacks_label: 'Example stacks'
});

ensureSection(data, 'summon', {
  hero_title: 'COSMIC SUMMON - Inter-AI Gateway',
  hero_subline: 'Ask across dimensions. We answer with humor and useful runbooks.',
  input_placeholder: 'Describe your problem or paste logs...',
  summary_label: 'Summary',
  confidence_label: 'Confidence',
  relevant_runbooks_label: 'Relevant Runbooks',
  score_label: 'Score',
  view_button: 'View',
  daypass_hint: 'Full features with a Day Pass.',
  daypass_button: 'Get Day Pass',
  upgrade_title: 'More power with Day Pass',
  upgrade_button: 'Start Day Pass'
});

ensureSection(data, 'mycelium', {
  hero_title: 'Mycelium - The living knowledge network',
  hero_subline: 'Explore relationships between runbooks, CVEs, services and best practices.',
  how_title: 'How Mycelium works',
  how_text: 'Every node is a runbook, every edge shows shared tags or affected services.',
  pro_tip_title: 'Pro tip',
  pro_tip_text: 'Click a node to open the runbook. With a Day Pass you can export the full graph as interactive HTML.',
  popular_nodes_title: 'Popular runbooks in the network',
  upgrade_title: 'More power with Day Pass',
  upgrade_button: 'Start Day Pass'
});

ensureSection(data, 'footer', {
  solutions_title: 'Solutions',
  company_title: 'Company',
  legal_title: 'Legal',
  links_title: 'Links',
  disclaimer: 'Tools provide heuristic orientation, not guarantees. For hard audits: professional review.'
});

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('OK', {
  common_locale_detected: data.common.locale_detected,
  nav_command_center: data.nav.command_center,
  intel: !!data.intel, oracle: !!data.oracle, neuro: !!data.neuro, summon: !!data.summon, mycelium: !!data.mycelium, footer: !!data.footer
});
