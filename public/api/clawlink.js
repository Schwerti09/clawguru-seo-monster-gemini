/*! ClawLink Magic Connector v∞ | (c) ClawGuru.org */
(function(){
  try {
    var s = document.currentScript || (function(){
      var list = document.getElementsByTagName('script');
      return list[list.length - 1];
    })();
    var siteId = s && s.getAttribute('data-site-id');
    var universe = (s && s.getAttribute('data-universe')) || 'false';

    // Minimal global API for future expansion
    window.ClawLink = window.ClawLink || {
      version: 'infinity',
      init: function(cfg){
        if (cfg && cfg.siteId) siteId = cfg.siteId;
        if (cfg && typeof cfg.universe !== 'undefined') universe = String(cfg.universe);
        log('re-init with cfg', cfg);
      }
    };

    function log(){
      try { (console && console.debug) && console.debug('[ClawLink]', [].slice.call(arguments)); } catch(_){}
    }

    function injectAnchor(){
      if (document.getElementById('clawlink-anchor')) return;
      var el = document.createElement('div');
      el.id = 'clawlink-anchor';
      el.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483647;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.6);color:#00ff9d;font:600 11px/1.2 system-ui,Segoe UI,Arial;box-shadow:0 0 24px rgba(0,255,157,0.08)';
      el.title = 'ClawLink Connected';
      el.textContent = 'ClawLink ✓';
      document.body.appendChild(el);
    }

    function ready(fn){
      if (document.readyState === 'complete' || document.readyState === 'interactive') return fn();
      document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function(){
      log('init', { siteId: siteId, universe: universe });
      injectAnchor();
    });
  } catch (e) {
    try { console.error('[ClawLink] failed to initialize:', e); } catch(_){ }
  }
})();
