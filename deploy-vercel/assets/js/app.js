/* ==========================================================================
   HUP — motor de movimento + interações (vanilla). Direção "Monólito quente".
   Cenas travadas (pin+scrub) no hero e no portfólio horizontal.
   ========================================================================== */
(function () {
  'use strict';
  window.__hupReady = true;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var WA_NUMBER = '5511993353728';
  if (reduce) root.setAttribute('data-motion', 'off');
  var motionOn = function () { return root.getAttribute('data-motion') === 'on'; };

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();

    // ---------- WhatsApp ----------
    var waBase = 'https://wa.me/' + WA_NUMBER + '?text=';
    document.querySelectorAll('[data-wa-btn]').forEach(function (b) {
      var origin = b.getAttribute('data-wa-btn') || 'Site';
      b.setAttribute('href', waBase + encodeURIComponent('Ola HUP, vim pelo site (' + origin + '). Quero solicitar um orcamento de governanca para o meu projeto e obra.'));
      b.setAttribute('target', '_blank'); b.setAttribute('rel', 'noopener');
    });

    // ---------- word-split ----------
    if (motionOn()) {
      document.querySelectorAll('[data-hero-h], .chapter h2, .break h2').forEach(function (h) {
        if (h.dataset.split) return;
        var ok = true;
        h.childNodes.forEach(function (n) { if (n.nodeType === 1 && !n.classList.contains('gr') && !n.classList.contains('oc')) ok = false; });
        if (!ok) return;
        h.dataset.split = '1';
        var frag = document.createDocumentFragment();
        h.childNodes.forEach(function (node) {
          if (node.nodeType === 3) {
            node.textContent.split(/(\s+)/).forEach(function (tok) {
              if (tok.trim() === '') { frag.appendChild(document.createTextNode(tok)); return; }
              var w = document.createElement('span'); w.className = 'word-wrap';
              var i = document.createElement('i'); i.textContent = tok; w.appendChild(i); frag.appendChild(w);
            });
          } else {
            var w = document.createElement('span'); w.className = 'word-wrap';
            var i = document.createElement('i'); i.className = node.className; i.textContent = node.textContent;
            w.appendChild(i); frag.appendChild(w);
          }
        });
        h.innerHTML = ''; h.appendChild(frag);
        h.querySelectorAll('.word-wrap i').forEach(function (i, idx) { i.style.transitionDelay = (idx * 44) + 'ms'; });
      });
    }

    // ---------- reveal ----------
    function revealGroup(scope) {
      scope.classList.add('in-view');
      var groups = new Map();
      scope.querySelectorAll('[data-reveal]').forEach(function (el) {
        var p = el.parentElement;
        if (!groups.has(p)) groups.set(p, 0);
        var idx = groups.get(p); groups.set(p, idx + 1);
        if (motionOn()) el.style.transitionDelay = Math.min(idx, 6) * 80 + 'ms';
        el.classList.add('seen');
      });
    }
    var sections = Array.prototype.slice.call(document.querySelectorAll('section, footer'));
    if (!motionOn()) {
      sections.forEach(function (s) { s.classList.add('in-view'); s.querySelectorAll('[data-reveal]').forEach(function (e) { e.classList.add('seen'); }); });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { revealGroup(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      sections.forEach(function (s) { io.observe(s); });
      requestAnimationFrame(function () { setTimeout(function () {
        sections.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top < innerHeight * 0.92 && r.bottom > 0) { revealGroup(s); io.unobserve(s); } });
      }, 140); });
      addEventListener('scroll', function () {
        sections.forEach(function (s) { if (!s.classList.contains('in-view')) { if (s.getBoundingClientRect().bottom < innerHeight * 0.4) revealGroup(s); } });
      }, { passive: true });
    } else sections.forEach(revealGroup);

    // ---------- counters ----------
    function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
    function animateCount(el) {
      if (el.dataset.done) return; el.dataset.done = '1';
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10), target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var finalStr = fmt(target, dec);
      // trava a largura no valor final para o contador nao empurrar os elementos vizinhos
      el.textContent = finalStr;
      el.style.display = 'inline-block';
      el.style.textAlign = 'right';
      el.style.width = Math.ceil(el.getBoundingClientRect().width) + 'px';
      if (!motionOn()) { el.textContent = finalStr; return; }
      var dur = 1500, t0 = null;
      function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), dec); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target, dec); }
      requestAnimationFrame(step);
      setTimeout(function () { el.textContent = fmt(target, dec); }, dur + 160);
    }
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.querySelectorAll('[data-count]').forEach(animateCount); cio.unobserve(e.target); } }); }, { threshold: 0.3 });
      document.querySelectorAll('.hero-ledger, .impact, .cases').forEach(function (s) { cio.observe(s); });
    } else document.querySelectorAll('[data-count]').forEach(animateCount);

    // ---------- PIN scenes (hero + portfolio horizontal) ----------
    var heroScene = document.querySelector('[data-hero-scene]');
    var heroImg = document.querySelector('[data-hero-img]');
    var heroInners = document.querySelectorAll('[data-hero-inner]');
    var heroFx = document.querySelector('[data-hero-fx]');
    var pfScene = document.querySelector('[data-pf-scene]');
    var pfTrack = document.querySelector('[data-pf-track]');
    var HERO_MULT = 1.7;
    var pinActive = false, pfSpan = 0;

    function pinsEligible() { return motionOn() && !reduce && innerWidth >= 900 && innerHeight >= 560; }

    function layoutPins() {
      pinActive = pinsEligible();
      // hero
      if (heroScene) {
        if (pinActive) { heroScene.setAttribute('data-pin', 'on'); heroScene.style.height = (HERO_MULT * innerHeight) + 'px'; }
        else { heroScene.setAttribute('data-pin', 'off'); heroScene.style.height = ''; }
      }
      // portfolio
      if (pfScene && pfTrack) {
        if (pinActive) {
          pfTrack.style.transform = 'none';
          var span = pfTrack.scrollWidth - innerWidth;
          pfSpan = Math.max(0, span);
          pfScene.setAttribute('data-pin', 'on');
          pfScene.style.height = (innerHeight + pfSpan) + 'px';
        } else {
          pfScene.setAttribute('data-pin', 'off');
          pfScene.style.height = '';
          pfTrack.style.transform = 'none';
        }
      }
      updatePins();
    }
    function prog(scene) {
      var top = scene.getBoundingClientRect().top;         // relative to viewport
      var total = scene.offsetHeight - innerHeight;
      if (total <= 0) return 0;
      return Math.max(0, Math.min(1, -top / total));
    }
    function updatePins() {
      if (!pinActive) return;
      if (heroScene && heroImg) {
        var p = prog(heroScene);
        heroImg.style.transform = 'scale(' + (1.04 + p * 0.07).toFixed(4) + ')';
        if (heroFx) heroFx.style.opacity = (p * p * 0.55).toFixed(3);
        var q = Math.min(1, p * 1.3);
        heroInners.forEach(function (el) { el.style.transform = 'translateY(' + (-q * 66).toFixed(1) + 'px)'; el.style.opacity = (1 - q).toFixed(3); });
      }
      if (pfScene && pfTrack) {
        var pp = prog(pfScene);
        pfTrack.style.transform = 'translate3d(' + (-pfSpan * pp).toFixed(1) + 'px,0,0)';
      }
    }

    // ---------- header + progress + scrollspy + parallax ----------
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('[data-progress]');
    var lastY = 0;
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    var spy = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    function onScroll() {
      var sy = scrollY || pageYOffset;
      if (header) {
        header.setAttribute('data-solid', sy > 40 ? 'true' : 'false');
        if (sy > 260 && sy > lastY + 4) header.setAttribute('data-hidden', 'true');
        else if (sy < lastY - 4 || sy <= 260) header.setAttribute('data-hidden', 'false');
      }
      lastY = sy;
      if (progress) { var h = document.body.scrollHeight - innerHeight; progress.style.transform = 'scaleX(' + (h > 0 ? sy / h : 0) + ')'; }
      var cur = -1;
      for (var i = 0; i < spy.length; i++) { var t = spy[i]; if (t && t.getBoundingClientRect().top <= innerHeight * 0.4) cur = i; }
      navLinks.forEach(function (a, i) { a.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      updatePins();
      if (motionOn() && !reduce) {
        document.querySelectorAll('[data-parallax]').forEach(function (el) {
          var scene = el.closest('[data-parallax-scene]') || el.parentElement;
          var r = scene.getBoundingClientRect(), f = parseFloat(el.getAttribute('data-parallax')) || 0.08;
          var mid = r.top + r.height / 2 - innerHeight / 2;
          el.style.transform = 'translate3d(0,' + (mid * f * -1).toFixed(1) + 'px,0)';
        });
      }
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { layoutPins(); onScroll(); });
    layoutPins(); onScroll();
    // recompute after fonts/images settle (track width changes)
    setTimeout(layoutPins, 400); addEventListener('load', layoutPins);

    // ---------- portfolio filter (tipo de obra) ----------
    (function () {
      var fbar = document.querySelector('[data-pf-filter]');
      if (!fbar || !pfTrack) return;
      var cards = Array.prototype.slice.call(pfTrack.querySelectorAll('.pcard'));
      fbar.addEventListener('click', function (ev) {
        var b = ev.target.closest('.pf-f'); if (!b) return;
        var f = b.getAttribute('data-filter');
        fbar.querySelectorAll('.pf-f').forEach(function (x) {
          var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        cards.forEach(function (c) {
          c.classList.toggle('is-hidden', f !== 'all' && c.getAttribute('data-type') !== f);
        });
        layoutPins();
        if (pinActive && pfScene) scrollTo(0, Math.max(0, pfScene.offsetTop));
      });
    })();

    // ---------- anchor smooth scroll ----------
    function headerH() { return header ? header.querySelector('.bar').offsetHeight + 8 : 76; }
    function smoothTo(yy) {
      if (reduce) { scrollTo(0, yy); return; }
      var start = scrollY, dist = yy - start, t0 = null, dur = Math.min(1000, 380 + Math.abs(dist) * 0.3);
      function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); scrollTo(0, start + dist * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href'); if (id === '#' || id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        ev.preventDefault();
        var delay = a.hasAttribute('data-drawer-link') ? 420 : 0;
        if (delay) closeDrawer();
        setTimeout(function () { smoothTo(Math.max(0, t.getBoundingClientRect().top + scrollY - headerH())); history.replaceState(null, '', id); }, delay);
      });
    });

    // ---------- drawer ----------
    var drawer = document.querySelector('[data-drawer]'), burger = document.querySelector('[data-burger]');
    function openDrawer() { if (!drawer) return; drawer.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; var f = drawer.querySelector('a,button'); if (f) f.focus(); }
    function closeDrawer() { if (!drawer) return; drawer.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false'); if (!document.querySelector('.lb.open')) document.body.style.overflow = ''; }
    if (burger) burger.addEventListener('click', openDrawer);
    document.querySelectorAll('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });

    // ---------- lightbox ----------
    var lb = document.querySelector('[data-lb]'), lbImg = document.querySelector('[data-lb-img]'),
        lbTitle = document.querySelector('[data-lb-title]'), lbCounter = document.querySelector('[data-lb-counter]'),
        lbPrev = document.querySelector('[data-lb-prev]'), lbNext = document.querySelector('[data-lb-next]');
    var gallery = [], gi = 0, lastFocus = null;
    function showImg() {
      if (!lbImg) return; lbImg.classList.remove('on'); var url = gallery[gi];
      var pre = new Image(); pre.onload = function () { lbImg.src = url; lbImg.classList.add('on'); };
      pre.src = url; if (pre.complete) { lbImg.src = url; lbImg.classList.add('on'); }
      if (lbCounter) lbCounter.textContent = gallery.length > 1 ? (gi + 1) + ' / ' + gallery.length : '';
      var hide = gallery.length < 2; if (lbPrev) lbPrev.classList.toggle('hide', hide); if (lbNext) lbNext.classList.toggle('hide', hide);
    }
    function openLb(list, title) { gallery = list; gi = 0; lastFocus = document.activeElement; if (lbTitle) lbTitle.textContent = title || 'Projeto'; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; showImg(); var c = document.querySelector('[data-lb-close]'); if (c) c.focus(); }
    function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); if (!document.querySelector('.drawer.open')) document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    function move(d) { gi = (gi + d + gallery.length) % gallery.length; showImg(); }
    document.querySelectorAll('.pcard').forEach(function (card) { card.addEventListener('click', function () { openLb((card.getAttribute('data-gallery') || '').split('|').filter(Boolean), card.getAttribute('data-title')); }); });
    if (lbPrev) lbPrev.addEventListener('click', function () { move(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { move(1); });
    document.querySelectorAll('[data-lb-close]').forEach(function (b) { b.addEventListener('click', closeLb); });
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('stage')) closeLb(); });
    addEventListener('keydown', function (e) {
      if (lb && lb.classList.contains('open')) { if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowLeft') move(-1); else if (e.key === 'ArrowRight') move(1); return; }
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
    });
    if (lb) { var sx = 0; lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true }); lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); }, { passive: true }); }

    // ---------- cookie (LGPD) ----------
    (function () {
      var el = document.querySelector('[data-cookie]'); if (!el) return;
      window.dataLayer = window.dataLayer || []; var KEY = 'hup_consent', stored = null;
      try { stored = localStorage.getItem(KEY); } catch (e) {}
      function apply(v) { try { localStorage.setItem(KEY, v); } catch (e) {} window.dataLayer.push({ event: 'consent_update', analytics_consent: v === 'all' ? 'granted' : 'denied' }); el.classList.remove('show'); }
      if (!stored) setTimeout(function () { el.classList.add('show'); }, 900);
      else window.dataLayer.push({ event: 'consent_update', analytics_consent: stored === 'all' ? 'granted' : 'denied' });
      var a = el.querySelector('[data-cookie-accept]'), r = el.querySelector('[data-cookie-reject]');
      if (a) a.addEventListener('click', function () { apply('all'); });
      if (r) r.addEventListener('click', function () { apply('essential'); });
    })();

    // ---------- wheel lerp (fine pointer) ----------
    if (finePointer && !reduce && motionOn()) {
      var target = scrollY, current = scrollY, running = false;
      function scrollable(el) { while (el && el !== document.body) { var s = getComputedStyle(el); if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2) return true; el = el.parentElement; } return false; }
      function loop() { current += (target - current) * 0.10; if (Math.abs(target - current) < 0.5) { current = target; running = false; scrollTo(0, current); return; } scrollTo(0, current); requestAnimationFrame(loop); }
      addEventListener('wheel', function (e) {
        if (document.body.style.overflow === 'hidden') return; if (e.ctrlKey) return; if (scrollable(e.target)) return;
        e.preventDefault();
        var max = document.body.scrollHeight - innerHeight; target = Math.max(0, Math.min(max, target + e.deltaY));
        if (!running) { running = true; current = scrollY; requestAnimationFrame(loop); }
      }, { passive: false });
      addEventListener('scroll', function () { if (!running) { target = scrollY; current = scrollY; } }, { passive: true });
    }
  });
})();
