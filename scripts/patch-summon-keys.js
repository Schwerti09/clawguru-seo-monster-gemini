const fs = require('fs');
const path = require('path');
function load(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function save(p, obj){ fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8'); }
function ensure(obj, k, v){ if (obj[k] === undefined) obj[k] = v; }
function patchSummon(dict, locale){
  if (!dict.summon) dict.summon = {};
  const s = dict.summon;
  ensure(s, 'error_load', locale==='ar' ? 'خطأ في التحميل.' : 'Load error.');
  ensure(s, 'summary_title', locale==='ar' ? 'الملخص' : 'Summary');
  ensure(s, 'view_link_label', locale==='ar' ? 'عرض →' : 'View →');
  ensure(s, 'callout_strong', locale==='ar' ? 'يمكن حل هذه المشكلة تلقائيًا مع Day Pass — بما في ذلك التنفيذ وإثبات المعالجة!' : 'This problem can be fixed automatically with a Day Pass — including execution and verification!');
  ensure(s, 'callout_button', locale==='ar' ? 'احصل على Day Pass' : 'Get Day Pass');
  ensure(s, 'example_queries_title', locale==='ar' ? 'استفسارات مثال' : 'Example Queries');
  ensure(s, 'example_queries_items', locale==='ar' ? ['AWS S3 Public Bucket','تهيئة RBAC في Kubernetes','تقوية SSH','Nginx TLS 1.3'] : ['AWS S3 Public Bucket','PostgreSQL Connection Pooling','Kubernetes RBAC','SSH Hardening','Nginx TLS 1.3']);
}

const root = path.join(__dirname, '..');
const enPath = path.join(root, 'dictionaries', 'en.json');
const arPath = path.join(root, 'dictionaries', 'ar.json');
const en = load(enPath);
const ar = load(arPath);
patchSummon(en, 'en');
patchSummon(ar, 'ar');
save(enPath, en);
save(arPath, ar);
console.log('patched summon keys in en/ar');
