/**
 * Magadh Enterprises — showroom gallery lightbox.
 *
 * Clicking (or keyboard-activating) a gallery tile opens the same photograph
 * full-screen with a caption, previous/next controls and Escape to close.
 * Built from scratch: no library, no <dialog> polyfill, no framework.
 *
 * Progressive enhancement: the <img> elements stay in the markup with their alt
 * text, so with JavaScript disabled the gallery is still a readable grid of
 * real photographs — the buttons simply degrade to plain containers.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    var buttons = Array.prototype.slice.call(grid.querySelectorAll('[data-gallery-open]'));
    if (!buttons.length) return;

    /* Read the caption and source from the button's own image so the lightbox
       can never drift out of sync with the grid. */
    var items = buttons.map(function (button) {
      var img = button.querySelector('img');
      return {
        button: button,
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : '',
        caption: button.getAttribute('data-gallery-caption') ||
          (img && img.getAttribute('alt')) || ''
      };
    });

    var lb = null;
    var lbImg = null;
    var lbCap = null;
    var lbIndex = null;
    var lbClose = null;
    var lbPrev = null;
    var lbNext = null;
    var lastFocused = null;

    function build() {
      if (lb) return;
      lb = document.createElement('div');
      lb.className = 'g-lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Showroom image viewer');
      lb.innerHTML =
        '<button type="button" class="g-lightbox-close" aria-label="Close image viewer">&times;</button>' +
        '<button type="button" class="g-lightbox-nav g-lightbox-prev" aria-label="Previous image">&#8249;</button>' +
        '<figure class="g-lightbox-figure">' +
          '<img alt="">' +
          '<figcaption>' +
            '<p class="t-label g-lightbox-label">Magadh Enterprises &middot; Showroom</p>' +
            '<p class="g-lightbox-cap"></p>' +
          '</figcaption>' +
        '</figure>' +
        '<button type="button" class="g-lightbox-nav g-lightbox-next" aria-label="Next image">&#8250;</button>';
      document.body.appendChild(lb);

      lbImg = lb.querySelector('img');
      lbCap = lb.querySelector('.g-lightbox-cap');
      lbClose = lb.querySelector('.g-lightbox-close');
      lbPrev = lb.querySelector('.g-lightbox-prev');
      lbNext = lb.querySelector('.g-lightbox-next');

      lbClose.addEventListener('click', close);
      lbPrev.addEventListener('click', function () { show(lbIndex - 1); });
      lbNext.addEventListener('click', function () { show(lbIndex + 1); });
      // Backdrop click closes; clicks inside the figure must not bubble out.
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    }

    function show(index) {
      var total = items.length;
      lbIndex = ((index % total) + total) % total;
      var item = items[lbIndex];
      lbImg.setAttribute('src', item.src);
      lbImg.setAttribute('alt', item.alt);
      lbCap.textContent = item.caption;
      var single = total < 2;
      lbPrev.hidden = single;
      lbNext.hidden = single;
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      var focusables = [lbClose, lbPrev, lbNext].filter(function (el) {
        return el && !el.hidden;
      });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function open(index, trigger) {
      build();
      lastFocused = trigger || null;
      show(index);
      lb.classList.add('open');
      document.body.classList.add('g-lightbox-open');
      lbClose.focus();
    }

    function close() {
      if (!lb || !lb.classList.contains('open')) return;
      lb.classList.remove('open');
      document.body.classList.remove('g-lightbox-open');
      lbImg.removeAttribute('src');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
      lastFocused = null;
    }

    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () { open(i, button); });
    });

    document.addEventListener('keydown', function (e) {
      if (!lb || !lb.classList.contains('open')) return;

      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        show(lbIndex - 1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        show(lbIndex + 1);
        return;
      }
      trapFocus(e);
    });

    // Leaving mobile width with the overlay open must not strand the scroll lock.
    var desktop = window.matchMedia('(min-width: 769px)');
    function onChange(e) { if (e.matches) close(); }
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onChange);
    }
  });
})();