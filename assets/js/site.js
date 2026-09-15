(function () {
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden if the observer misses (e.g. font swap or bfcache restore).
    setTimeout(function () { items.forEach(function (el) { el.classList.add('in'); }); }, 1600);
  }

  var expandAll = document.querySelector('[data-expand-all]');
  if (expandAll) {
    var details = document.querySelectorAll('.tenure details');
    expandAll.addEventListener('click', function () {
      var open = expandAll.getAttribute('data-open') !== 'true';
      details.forEach(function (d) { d.open = open; });
      expandAll.setAttribute('data-open', open ? 'true' : 'false');
      expandAll.textContent = open ? (expandAll.getAttribute('data-label-close') || 'Collapse all') : (expandAll.getAttribute('data-label-open') || 'Expand all');
    });
  }

  var links = document.querySelectorAll('.nav-links a[href^="/#"]');
  var targets = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(2));
    if (el) targets.push({ a: a, el: el });
  });
  if (targets.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var t = targets.find(function (x) { return x.el === e.target; });
        if (t) t.a.classList.toggle('active', e.isIntersecting);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { so.observe(t.el); });
  }

  document.querySelectorAll('[data-share]').forEach(function (bar) {
    var url = bar.getAttribute('data-url') || location.href;
    var title = bar.getAttribute('data-title') || document.title;
    var copy = bar.querySelector('[data-copy]');
    if (copy && navigator.clipboard) {
      copy.addEventListener('click', function () {
        navigator.clipboard.writeText(url).then(function () {
          var was = copy.textContent; copy.textContent = 'Copied'; copy.classList.add('done');
          setTimeout(function () { copy.textContent = was; copy.classList.remove('done'); }, 1800);
        });
      });
    }
    var native = bar.querySelector('[data-native]');
    if (native && navigator.share) {
      native.hidden = false;
      native.addEventListener('click', function () { navigator.share({ title: title, url: url }).catch(function () {}); });
    }
  });

  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();
