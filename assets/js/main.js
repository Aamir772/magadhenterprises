/**
 * Magadh Enterprises — site behaviour.
 *
 * Scope is deliberately limited to what the baseline did, plus accessibility
 * and keyboard handling:
 *   1. Sticky-header elevation on scroll
 *   2. Mobile navigation overlay (open/close, Escape, focus management, scroll lock)
 *   3. Prefilled WhatsApp enquiry links
 *   4. Smooth in-page hash navigation with sticky-header offset
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
    var links = document.querySelectorAll('a[href^="#"]');

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function (event) {
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
      rendered[section.id + '|' + nameEl.textContent.trim()] = {
        image: img.getAttribute('src'),
        description: descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '',
        width: Number(img.getAttribute('width')),
        height: Number(img.getAttribute('height'))
      };
    });

    var problems = [];

    Object.keys(expected).forEach(function (key) {
      var item = expected[key];
      var out = rendered[key];
      if (!out) { problems.push('missing from markup: ' + key); return; }
      if (out.image !== item.image) problems.push('image mismatch: ' + key);
      if (out.description !== item.description) problems.push('description mismatch: ' + key);
      if (out.width !== item.width || out.height !== item.height) problems.push('dimensions mismatch: ' + key);
    });

    Object.keys(rendered).forEach(function (key) {
      if (!expected[key]) problems.push('not in catalogue: ' + key);
    });

    if (problems.length) {
      console.warn('Magadh: products.js and index.html are out of sync.\n' + problems.join('\n'));
    }
  }

  /* 6. Year stamp ----------------------------------------------------------- */
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
    initYear();
    initCatalogueCheck();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();