/* ==========================================================================
   HUP · LP Gestão de obras. Interações e movimento base (vanilla).
   Scroll nativo (sem inércia). CTAs [data-cta] abrem o widget do CRM BuildV.
   ========================================================================== */
(function () {
  'use strict';
  window.__lpReady = true;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.setAttribute('data-motion', 'off');
  function motionOn() { return root.getAttribute('data-motion') === 'on'; }
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();

    // ---------- reveal por seção ----------
    var scopes = Array.prototype.slice.call(document.querySelectorAll('main > section, footer'));
    function reveal(scope) {
      if (scope.classList.contains('in-view')) return;
      scope.classList.add('in-view');
      var groups = new Map();
      scope.querySelectorAll('[data-reveal]').forEach(function (el) {
        var p = el.parentElement, i = groups.get(p) || 0; groups.set(p, i + 1);
        if (motionOn()) el.style.transitionDelay = Math.min(i, 6) * 80 + 'ms';
        el.classList.add('seen');
      });
    }
    if (!motionOn() || !('IntersectionObserver' in window)) scopes.forEach(reveal);
    else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      scopes.forEach(function (s) { io.observe(s); });
      // seção que já passou (âncora, refresh no meio da página) não fica escondida
      addEventListener('scroll', function () {
        scopes.forEach(function (s) { if (!s.classList.contains('in-view') && s.getBoundingClientRect().top < innerHeight * 0.6) reveal(s); });
      }, { passive: true });
    }

    // ---------- contadores ----------
    function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
    function count(el) {
      if (el.dataset.done) return; el.dataset.done = '1';
      var d = parseInt(el.getAttribute('data-dec') || '0', 10), target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var fin = fmt(target, d);
      el.textContent = fin;
      if (!motionOn()) return;
      el.style.display = 'inline-block'; el.style.textAlign = 'right';
      el.style.minWidth = Math.ceil(el.getBoundingClientRect().width) + 'px';
      var dur = 1400, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), d);
        if (p < 1) requestAnimationFrame(step); else el.textContent = fin;
      }
      requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c); });
    } else counters.forEach(count);

    // ---------- header, progresso, scrollspy, parallax, linha do tempo ----------
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('[data-progress]');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    var spy = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var timeline = document.querySelector('[data-timeline]');
    var steps = timeline ? Array.prototype.slice.call(timeline.querySelectorAll('.lp-step')) : [];
    var lastY = scrollY, ticking = false;

    function frame() {
      ticking = false;
      var sy = scrollY, vh = innerHeight;
      if (header) {
        header.setAttribute('data-solid', sy > 40 ? 'true' : 'false');
        if (sy > 260 && sy > lastY + 4) header.setAttribute('data-hidden', 'true');
        else if (sy < lastY - 4 || sy <= 260) header.setAttribute('data-hidden', 'false');
      }
      lastY = sy;
      if (progress) { var h = document.documentElement.scrollHeight - vh; progress.style.transform = 'scaleX(' + (h > 0 ? sy / h : 0) + ')'; }
      var cur = -1;
      spy.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= vh * 0.4) cur = i; });
      navLinks.forEach(function (a, i) { a.setAttribute('aria-current', i === cur ? 'true' : 'false'); });

      if (motionOn()) {
        parallax.forEach(function (el) {
          var scene = el.closest('[data-parallax-scene]') || el.parentElement;
          var r = scene.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) return;
          var f = parseFloat(el.getAttribute('data-parallax')) || 0.08;
          el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -f).toFixed(1) + 'px,0)';
        });
      }

      if (timeline) {
        var line = vh * 0.62;
        if (motionOn()) {
          var tr = timeline.getBoundingClientRect();
          var p = Math.max(0, Math.min(1, (line - tr.top) / tr.height));
          timeline.style.setProperty('--p', p.toFixed(3));
        }
        steps.forEach(function (s) { s.classList.toggle('on', !motionOn() || s.getBoundingClientRect().top < line); });
      }
    }
    // a espinha termina no centro do último marcador, não no fim do texto
    function layoutSpine() {
      if (!timeline) return;
      var spine = timeline.querySelector('.lp-steps__spine'), last = timeline.querySelector('.lp-step:last-child');
      var dot = last && last.querySelector('.lp-step__dot');
      if (!spine || !dot) return;
      // offsetTop ignora o translate da entrada (getBoundingClientRect mediria o passo ainda deslocado)
      var center = last.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
      spine.style.bottom = Math.max(0, timeline.clientHeight - center) + 'px';
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { layoutSpine(); onScroll(); });
    addEventListener('load', layoutSpine);
    layoutSpine();
    frame();

    // ---------- "Para quem é": a lista troca a foto ----------
    var fit = document.querySelector('[data-fit]');
    if (fit) {
      var items = Array.prototype.slice.call(fit.querySelectorAll('[data-fit-item]'));
      var imgs = Array.prototype.slice.call(fit.querySelectorAll('[data-fit-img]'));
      var setFit = function (k) {
        items.forEach(function (li) { li.classList.toggle('is-on', li.getAttribute('data-fit-item') === k); });
        imgs.forEach(function (f) { f.classList.toggle('is-on', f.getAttribute('data-fit-img') === k); });
      };
      items.forEach(function (li) { li.addEventListener('mouseenter', function () { setFit(li.getAttribute('data-fit-item')); }); });
      if ('IntersectionObserver' in window && !matchMedia('(hover:hover) and (pointer:fine)').matches) {
        var fio = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) setFit(e.target.getAttribute('data-fit-item')); });
        }, { rootMargin: '-45% 0px -45% 0px' });
        items.forEach(function (li) { fio.observe(li); });
      }
    }

    // ---------- drawer ----------
    var drawer = document.querySelector('[data-drawer]'), burger = document.querySelector('[data-burger]');
    function openDrawer() { drawer.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; var f = drawer.querySelector('a,button'); if (f) f.focus(); }
    function closeDrawer() { if (!drawer) return; drawer.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    if (drawer && burger) {
      burger.addEventListener('click', openDrawer);
      drawer.querySelectorAll('[data-drawer-close], [data-drawer-link]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
      addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('open')) { closeDrawer(); burger.focus(); } });
    }

    // ---------- CTAs abrem o widget do CRM BuildV (o .bv-launcher vive em shadow DOM) ----------
    function findLauncher() {
      var l = document.querySelector('.bv-launcher'); if (l) return l;
      var hosts = document.querySelectorAll('*');
      for (var i = 0; i < hosts.length; i++) {
        if (hosts[i].shadowRoot) { var x = hosts[i].shadowRoot.querySelector('.bv-launcher'); if (x) return x; }
      }
      return null;
    }
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cta]'); if (!t) return;
      e.preventDefault();
      (window.dataLayer = window.dataLayer || []).push({ event: 'cta_click', cta_local: t.getAttribute('data-cta') || 'cta' });
      closeDrawer();
      var tries = 0;
      (function open() {
        var l = findLauncher();
        if (l) { l.click(); return; }
        if (++tries < 12) setTimeout(open, 250); // o widget carrega async; espera até ~3s
      })();
    });

    // ---------- aviso de cookies (informativo, à esquerda) ----------
    (function () {
      var el = document.querySelector('[data-cookie]'); if (!el) return;
      var list = el.querySelector('[data-cookie-list]'), more = el.querySelector('[data-cookie-more]');
      var KEY = 'cookie_notice', seen = null;
      try { seen = localStorage.getItem(KEY); } catch (e) {}
      function show(open) {
        if (open) { list.hidden = false; more.setAttribute('aria-expanded', 'true'); }
        el.classList.add('show');
      }
      if (seen !== 'ok') setTimeout(function () { show(false); }, 900);
      el.querySelector('[data-cookie-ok]').addEventListener('click', function () {
        try { localStorage.setItem(KEY, 'ok'); } catch (e) {}
        el.classList.remove('show');
      });
      more.addEventListener('click', function () {
        var open = list.hidden; list.hidden = !open; more.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.querySelectorAll('[data-cookie-prefs]').forEach(function (b) { b.addEventListener('click', function () { show(true); }); });
    })();
  });
})();
