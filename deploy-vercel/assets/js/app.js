/* ==========================================================================
   HUP — motor de movimento + interações (vanilla, zero dependência)
   Calibragem da casa: deslocamento curto, easing longo, intensidade ~4/10.
   ========================================================================== */
(function () {
  'use strict';
  window.__hupReady = true;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var WA_NUMBER = '5511993353728'; // +55 11 99335-3728 (comercial HUP)

  if (reduce) root.setAttribute('data-motion', 'off');

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    // ---------- year ----------
    var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();

    // ---------- WhatsApp CTAs ----------
    var waBase = 'https://wa.me/' + WA_NUMBER + '?text=';
    document.querySelectorAll('[data-wa-btn]').forEach(function (b) {
      var origin = b.getAttribute('data-wa-btn') || 'Site';
      var msg = 'Ola HUP, vim pelo site (' + origin + '). Quero solicitar um orcamento de governanca para o meu projeto e obra.';
      b.setAttribute('href', waBase + encodeURIComponent(msg));
      b.setAttribute('target', '_blank'); b.setAttribute('rel', 'noopener');
    });

    // ---------- word-split titles ----------
    if (root.getAttribute('data-motion') === 'on') {
      document.querySelectorAll('[data-hero-h], .chapter h2, .cta h2, .break h2').forEach(function (h) {
        if (h.dataset.split) return;
        if (h.children.length && !h.querySelector('.accent,.k')) return; // pure text only, except allowed spans
        var walkOk = true;
        h.childNodes.forEach(function(n){ if(n.nodeType===1 && !n.classList.contains('accent') && !n.classList.contains('k')) walkOk=false; });
        if (!walkOk) return;
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
        // stagger the inner <i>
        h.querySelectorAll('.word-wrap i').forEach(function (i, idx) { i.style.transitionDelay = (idx * 42) + 'ms'; });
      });
    }

    // ---------- reveal engine ----------
    function revealGroup(scope) {
      scope.classList.add('in-view');
      var groups = new Map();
      scope.querySelectorAll('[data-reveal]').forEach(function (el) {
        var p = el.parentElement;
        if (!groups.has(p)) groups.set(p, 0);
        var idx = groups.get(p); groups.set(p, idx + 1);
        if (root.getAttribute('data-motion') === 'on')
          el.style.transitionDelay = Math.min(idx, 6) * 80 + 'ms';
        el.classList.add('seen');
      });
    }

    var sections = Array.prototype.slice.call(document.querySelectorAll('section, footer'));
    if (root.getAttribute('data-motion') === 'off') {
      sections.forEach(function (s) { s.classList.add('in-view'); s.querySelectorAll('[data-reveal]').forEach(function(e){e.classList.add('seen');}); });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { revealGroup(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
      sections.forEach(function (s) { io.observe(s); });
      // layer 1: first-screen by timer (observer may not fire in bg tabs)
      requestAnimationFrame(function () { setTimeout(function () {
        sections.forEach(function (s) {
          var r = s.getBoundingClientRect();
          if (r.top < innerHeight * 0.9 && r.bottom > 0) { revealGroup(s); if (io) io.unobserve(s); }
        });
      }, 140); });
      // layer 3: flush on jumps
      addEventListener('scroll', function () {
        sections.forEach(function (s) {
          if (s.classList.contains('in-view')) return;
          var r = s.getBoundingClientRect();
          if (r.bottom < innerHeight * 0.4) revealGroup(s);
        });
      }, { passive: true });
    } else {
      sections.forEach(revealGroup);
    }

    // ---------- counters ----------
    function animateCount(el) {
      if (el.dataset.done) return; el.dataset.done = '1';
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (root.getAttribute('data-motion') === 'off') { el.textContent = fmt(target, dec); return; }
      var dur = 1500, t0 = null;
      function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
      function step(ts) {
        if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased, dec);
        if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target, dec);
      }
      requestAnimationFrame(step);
      setTimeout(function () { el.textContent = fmt(target, dec); }, dur + 160); // headless safety
    }
    function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.querySelectorAll('[data-count]').forEach(animateCount); cio.unobserve(e.target); } });
      }, { threshold: 0.3 });
      document.querySelectorAll('.hero-ledger, .impact, .cases').forEach(function (s) { cio.observe(s); });
    } else {
      document.querySelectorAll('[data-count]').forEach(animateCount);
    }

    // ---------- header behaviour + progress + scrollspy ----------
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('[data-progress]');
    var lastY = 0;
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    var spyTargets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    function onScroll() {
      var sy = scrollY || pageYOffset;
      if (header) {
        header.setAttribute('data-solid', sy > 40 ? 'true' : 'false');
        if (sy > 260 && sy > lastY + 4) header.setAttribute('data-hidden', 'true');
        else if (sy < lastY - 4 || sy <= 260) header.setAttribute('data-hidden', 'false');
      }
      lastY = sy;
      if (progress) {
        var h = document.body.scrollHeight - innerHeight;
        progress.style.transform = 'scaleX(' + (h > 0 ? sy / h : 0) + ')';
      }
      // scrollspy
      var cur = -1;
      for (var i = 0; i < spyTargets.length; i++) {
        var t = spyTargets[i]; if (!t) continue;
        if (t.getBoundingClientRect().top <= innerHeight * 0.35) cur = i;
      }
      navLinks.forEach(function (a, i) { a.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      // parallax
      if (root.getAttribute('data-motion') === 'on' && !reduce) {
        document.querySelectorAll('[data-parallax]').forEach(function (el) {
          var scene = el.closest('[data-parallax-scene]') || el.parentElement;
          var r = scene.getBoundingClientRect();
          var f = parseFloat(el.getAttribute('data-parallax')) || 0.08;
          var mid = r.top + r.height / 2 - innerHeight / 2;
          el.style.transform = 'translate3d(0,' + (mid * f * -1).toFixed(1) + 'px,0) scale(1.06)';
        });
      }
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();

    // ---------- anchor smooth scroll ----------
    function headerH() { return header ? header.querySelector('.bar').offsetHeight + 8 : 80; }
    function smoothTo(y) {
      if (reduce) { scrollTo(0, y); return; }
      var start = scrollY, dist = y - start, t0 = null, dur = Math.min(1000, 380 + Math.abs(dist) * 0.32);
      function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3); scrollTo(0, start + dist * e); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href'); if (id === '#' || id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        ev.preventDefault();
        var delay = a.hasAttribute('data-drawer-link') ? 420 : 0;
        if (delay) closeDrawer();
        setTimeout(function () {
          smoothTo(Math.max(0, t.getBoundingClientRect().top + scrollY - headerH()));
          history.replaceState(null, '', id);
        }, delay);
      });
    });

    // ---------- drawer ----------
    var drawer = document.querySelector('[data-drawer]');
    var burger = document.querySelector('[data-burger]');
    function openDrawer() { if (!drawer) return; drawer.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; var f = drawer.querySelector('a,button'); if (f) f.focus(); }
    function closeDrawer() { if (!drawer) return; drawer.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false'); if (!document.querySelector('.lb.open')) document.body.style.overflow = ''; }
    if (burger) burger.addEventListener('click', openDrawer);
    document.querySelectorAll('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });

    // ---------- lightbox ----------
    var lb = document.querySelector('[data-lb]');
    var lbImg = document.querySelector('[data-lb-img]');
    var lbTitle = document.querySelector('[data-lb-title]');
    var lbCounter = document.querySelector('[data-lb-counter]');
    var lbPrev = document.querySelector('[data-lb-prev]');
    var lbNext = document.querySelector('[data-lb-next]');
    var gallery = [], gi = 0, lastFocus = null;
    function showImg() {
      if (!lbImg) return;
      lbImg.classList.remove('on');
      var url = gallery[gi];
      var pre = new Image(); pre.onload = function () { lbImg.src = url; lbImg.classList.add('on'); };
      pre.src = url; if (pre.complete) { lbImg.src = url; lbImg.classList.add('on'); }
      if (lbCounter) lbCounter.textContent = gallery.length > 1 ? (gi + 1) + ' / ' + gallery.length : '';
      var hide = gallery.length < 2;
      if (lbPrev) lbPrev.classList.toggle('hide', hide);
      if (lbNext) lbNext.classList.toggle('hide', hide);
    }
    function openLb(list, title) {
      gallery = list; gi = 0; lastFocus = document.activeElement;
      if (lbTitle) lbTitle.textContent = title || 'Projeto';
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; showImg();
      if (document.querySelector('[data-lb-close]')) document.querySelector('[data-lb-close]').focus();
    }
    function closeLb() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      if (!document.querySelector('.drawer.open')) document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    function move(d) { gi = (gi + d + gallery.length) % gallery.length; showImg(); }
    document.querySelectorAll('.pcard').forEach(function (card) {
      card.addEventListener('click', function () {
        var list = (card.getAttribute('data-gallery') || '').split('|').filter(Boolean);
        openLb(list, card.getAttribute('data-title'));
      });
    });
    if (lbPrev) lbPrev.addEventListener('click', function () { move(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { move(1); });
    document.querySelectorAll('[data-lb-close]').forEach(function (b) { b.addEventListener('click', closeLb); });
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('stage')) closeLb(); });

    // ---------- keyboard ----------
    addEventListener('keydown', function (e) {
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'Escape') closeLb();
        else if (e.key === 'ArrowLeft') move(-1);
        else if (e.key === 'ArrowRight') move(1);
        return;
      }
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
    });

    // ---------- swipe (lightbox) ----------
    if (lb) {
      var sx = 0;
      lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); }, { passive: true });
    }

    // ---------- cookie consent (LGPD) ----------
    (function () {
      var el = document.querySelector('[data-cookie]');
      if (!el) return;
      window.dataLayer = window.dataLayer || [];
      var KEY = 'hup_consent';
      var stored = null;
      try { stored = localStorage.getItem(KEY); } catch (e) {}
      function apply(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
        window.dataLayer.push({ event: 'consent_update', analytics_consent: v === 'all' ? 'granted' : 'denied' });
        el.classList.remove('show');
      }
      if (!stored) setTimeout(function () { el.classList.add('show'); }, 900);
      else window.dataLayer.push({ event: 'consent_update', analytics_consent: stored === 'all' ? 'granted' : 'denied' });
      var a = el.querySelector('[data-cookie-accept]'), r = el.querySelector('[data-cookie-reject]');
      if (a) a.addEventListener('click', function () { apply('all'); });
      if (r) r.addEventListener('click', function () { apply('essential'); });
    })();

    // ---------- wheel lerp (fine pointer only) ----------
    if (finePointer && !reduce && root.getAttribute('data-motion') === 'on') {
      var target = scrollY, current = scrollY, running = false;
      function scrollable(el) {
        while (el && el !== document.body) {
          var s = getComputedStyle(el);
          if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2) return true;
          el = el.parentElement;
        }
        return false;
      }
      function loop() {
        current += (target - current) * 0.10;
        if (Math.abs(target - current) < 0.5) { current = target; running = false; scrollTo(0, current); return; }
        scrollTo(0, current); requestAnimationFrame(loop);
      }
      addEventListener('wheel', function (e) {
        if (document.body.style.overflow === 'hidden') return;      // overlay open
        if (e.ctrlKey) return;
        if (scrollable(e.target)) return;
        e.preventDefault();
        var max = document.body.scrollHeight - innerHeight;
        target = Math.max(0, Math.min(max, target + e.deltaY));
        if (!running) { running = true; current = scrollY; requestAnimationFrame(loop); }
      }, { passive: false });
      addEventListener('scroll', function(){ if(!running){ target = scrollY; current = scrollY; } }, { passive: true });
    }
  });
})();
