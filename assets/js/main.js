/**
 * Magadh Enterprises — site behaviour.
 *
 * Scope is deliberately limited to what the baseline did, plus accessibility
 * and keyboard handling:
 *   1. Sticky-header elevation on scroll
 *   2. Mobile navigation overlay (open/close, Escape, focus management, scroll lock)
 *   3. Prefilled WhatsApp enquiry links
 *   3. Smooth in-page hash navigation with sticky-header offset
 *   4. Active navigation state as sections scroll past
 *
 * Everything is progressive enhancement: with JS disabled the page still renders,
 * every phone link still works and the product cards remain readable.
 */
(function () {
  'use strict';

  var config = window.MAGADH_CONFIG || {};
  var SCROLL_THRESHOLD = 40;
  var HEADER_OFFSET = 76;

  /* 1. Sticky header ------------------------------------------------------ */
  function initHeaderElevation() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* 2. Mobile navigation --------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById('hamburger');
    var nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var lastFocused = null;

    function isOpen() {
      return nav.classList.contains('open');
    }

    function focusables() {
      return links.concat(toggle);
    }

    function open() {
      lastFocused = document.activeElement;
      nav.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      nav.removeAttribute('inert');
      document.body.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
      if (links[0]) links[0].focus();
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      // `inert` (rather than aria-hidden) keeps the overlay's links out of the
      // tab order while it is closed without tripping hidden-focusable checks.
      nav.setAttribute('inert', '');
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      if (returnFocus) {
        (lastFocused || toggle).focus();
      }
      lastFocused = null;
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        close(true);
      } else {
        open();
      }
    });

    // Close after following a link inside the overlay.
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        close(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen()) return;

      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        close(true);
        return;
      }

      // Trap Tab inside the overlay while it is open.
      if (event.key === 'Tab') {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Returning to desktop width resets the overlay so the page is not left locked.
    var desktop = window.matchMedia('(min-width: 769px)');
    function onChange(event) {
      if (event.matches) close(false);
    }
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onChange);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onChange);
    }
  }

  /* 3. Prefilled WhatsApp links -------------------------------------------- */
  function initWhatsAppLinks() {
    var wa = config.whatsapp;
    if (!wa || !wa.base) return;

    var links = document.querySelectorAll('[data-wa]');

    Array.prototype.forEach.call(links, function (link) {
      var kind = link.getAttribute('data-wa');
      var template = wa.messages[kind];
      if (!template) return;

      var product = link.getAttribute('data-product');
      var text = product
        ? template.replace('{product}', product)
        : template;

      link.setAttribute('href', wa.base + '?text=' + encodeURIComponent(text));
    });
  }

  /* 4. Hash navigation with sticky-header offset ---------------------------- */
  function initHashNavigation() {
    /* Delegated on document rather than bound per link, so links whose href is
       set at runtime (e.g. the empty-state CTA in the tile filters) still get the
       sticky-header offset and the focus handling below. */
    document.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target;
      try {
        target = document.querySelector(hash);
      } catch (error) {
        return;
      }
      if (!target) return;

      event.preventDefault();

      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });

      // Keep the URL and keyboard focus in sync with the visual jump.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', hash);
      }

      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  }

  /* 5. Catalogue consistency check -----------------------------------------
     assets/js/products.js holds the product fields as structured data. The
     markup in index.html is the rendered, crawlable version of the same data.
     This check runs in the browser console only; it warns (never throws) if the
     two have drifted, so a product edit in one place cannot silently miss the
     other. Keep this quiet in production by removing the block if unwanted. */
  function initCatalogueCheck() {
    var catalogue = window.MAGADH_PRODUCTS;
    if (!catalogue || !catalogue.length) return;

    var expected = {};
    catalogue.forEach(function (group) {
      group.items.forEach(function (item) {
        expected[group.section + '|' + item.name] = item;
      });
    });

    var rendered = {};
    document.querySelectorAll('.product-card').forEach(function (card) {
      var section = card.closest('section[id]');
      var nameEl = card.querySelector('.product-name');
      var descEl = card.querySelector('.product-desc');
      var img = card.querySelector('img');
      if (!section || !nameEl || !img) return;
      /* A card serves a responsive variant, not the master file products.js
         records: src points at the small variant and srcset carries the rest
         up to the master. So the image check has to ask "is the master one of
         the candidates?" instead of "is src the master?", otherwise every
         correctly-built card reports a false mismatch. */
      var candidates = [img.getAttribute('src') || ''];
      (img.getAttribute('srcset') || '').split(',').forEach(function (entry) {
        var url = entry.trim().split(/\s+/)[0];
        if (url) candidates.push(url);
      });
      rendered[section.id + '|' + nameEl.textContent.trim()] = {
        candidates: candidates,
        description: descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '',
        width: Number(img.getAttribute('width')),
        height: Number(img.getAttribute('height')),
        category: card.getAttribute('data-category')
      };
    });

    var problems = [];

    Object.keys(expected).forEach(function (key) {
      var item = expected[key];
      var out = rendered[key];
      if (!out) { problems.push('missing from markup: ' + key); return; }
      if (out.candidates.indexOf(item.image) === -1) problems.push('image mismatch: ' + key);
      if (out.description !== item.description) problems.push('description mismatch: ' + key);
      /* width/height describe whichever variant sits in src, so compare shape
         rather than pixel count - the variants are the same crop at two sizes. */
      if (!item.height || !out.height ||
          Math.abs((out.width / out.height) - (item.width / item.height)) > 0.01) {
        problems.push('dimensions mismatch: ' + key);
      }
      /* The category tabs in #products filter on data-category, so a drift
         between the two would silently drop a product out of a tab. */
      if (out.category !== item.category) problems.push('category mismatch: ' + key);
    });

    Object.keys(rendered).forEach(function (key) {
      if (!expected[key]) problems.push('not in catalogue: ' + key);
    });

    /* Every tab must resolve to at least one rendered card, otherwise a tab
       would filter to an empty grid. This is what guarantees the tab bar can
       never advertise a category the page does not actually stock. */
    var categories = window.MAGADH_PRODUCT_CATEGORIES;
    if (categories) {
      categories.forEach(function (cat) {
        if (cat.id === 'all' || cat.count) return;
        problems.push('tab has no products: ' + cat.id);
      });

      var tabIds = Array.prototype.map.call(
        document.querySelectorAll('#product-filters [data-product-filter]'),
        function (tab) { return tab.getAttribute('data-product-filter'); }
      );
      categories.forEach(function (cat) {
        if (tabIds.indexOf(cat.id) === -1) problems.push('tab missing from markup: ' + cat.id);
      });
      tabIds.forEach(function (id) {
        if (!categories.some(function (cat) { return cat.id === id; })) {
          problems.push('tab not in products.js: ' + id);
        }
      });
    }

    if (problems.length) {
      console.warn('Magadh: products.js and index.html are out of sync.\n' + problems.join('\n'));
    }
  }

  /* 5. Active navigation state ---------------------------------------------
     Marks the nav item for the section currently on screen. Only in-page
     links participate, so "Tile Visualizer" (a separate page) never lights up
     on the homepage. */
  function initScrollSpy() {
    var nav = document.querySelector('.site-nav');
    if (!nav || !('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var map = {};
    var targets = [];

    links.forEach(function (link) {
      var section;
      try { section = document.querySelector(link.getAttribute('href')); } catch (e) { return; }
      if (!section) return;
      map[section.id] = link;
      targets.push(section);
    });
    if (!targets.length) return;

    var visible = {};

    function setActive(id) {
      links.forEach(function (link) {
        var on = id !== null && link === map[id];
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
        link.classList.toggle('is-current', !!on);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });

      // Prefer the first section on screen; otherwise fall back to the last one
      // scrolled past so the highlight is never blank between sections.
      var active = null;
      for (var i = 0; i < targets.length; i++) {
        if (visible[targets[i].id]) { active = targets[i].id; break; }
      }
      if (!active) {
        var best = null;
        targets.forEach(function (section) {
          var top = section.getBoundingClientRect().top;
          if (top <= HEADER_OFFSET && (best === null || top > best.top)) {
            best = { id: section.id, top: top };
          }
        });
        if (best) active = best.id;
      }
      setActive(active);
    }, { rootMargin: '-' + HEADER_OFFSET + 'px 0px -55% 0px', threshold: 0 });

    targets.forEach(function (section) { io.observe(section); });
  }

  /* 7. Scroll reveal -------------------------------------------------------
     Fades content up as it enters the viewport. Strictly an enhancement:
     without JS nothing is hidden, under prefers-reduced-motion the effect is
     skipped, and a timer reveals everything even if the observer misbehaves. */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.section .t-h2, .section .t-body, .cat-card, .tile-card, .product-card, ' +
      '.featured, .intro-card, .value-item'
    ));
    if (!targets.length) return;

    // Siblings cascade slightly instead of popping in together.
    targets.forEach(function (el) {
      var p = el.parentElement;
      if (!p) return;
      if (p.__revealN === undefined) p.__revealN = 0;
      var n = p.__revealN++;
      if (n > 0 && n < 6) el.style.transitionDelay = (n * 0.07) + 's';
      el.classList.add('reveal');
    });

    document.documentElement.classList.add('js-reveal');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    targets.forEach(function (el) { io.observe(el); });

    /* Safety net, driven by scrolling rather than a blanket timer: anything at
       or above the fold must be visible even if the observer is throttled
       (background tab, headless, or a reduced-motion toggle mid-session). A
       timer would have force-revealed the whole page and killed the effect for
       anyone still scrolling. */
    var pending = targets.slice();

    function sweep() {
      var limit = window.innerHeight;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-in');
          return false;
        }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }

    /* Deliberately not rAF-throttled: the list only ever shrinks, so each
       scroll event costs one cheap pass, and correctness does not depend on a
       frame callback ever being scheduled. */
    function onScroll() { sweep(); }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sweep();
  }

  /* 8. Year stamp ----------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-current-year]');
    if (!nodes.length) return;
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = year;
    });
  }

  function init() {
    initHeaderElevation();
    initMobileNav();
    initWhatsAppLinks();
    initHashNavigation();
    initScrollSpy();
    initReveal();
    initYear();
    initCatalogueCheck();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();