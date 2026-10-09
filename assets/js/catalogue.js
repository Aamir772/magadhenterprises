/**
 * Magadh Enterprises — catalogue brand filter (tiles.html).
 *
 * Same progressive-enhancement pattern as assets/js/product-filters.js:
 * brand sections are static, crawlable markup; this file only narrows what
 * is already rendered. Sections carry data-brand ("crystal", "exxaro",
 * "vura") and the matching brand ids (crystal-ceramics, exxaro, vura) let
 * tiles.html#exxaro-style links preselect a brand without reloading.
 *
 * Guards: does nothing on pages without #brand-filters.
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
    var bar = document.getElementById('brand-filters');
    if (!bar) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-brand-filter]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-brand]'));
    if (!buttons.length || !groups.length) return;

    var countEl = document.getElementById('brand-filter-count');
    var header = document.querySelector('.site-header');

    function apply(key, opts) {
      var firstMatch = null;
      var shown = 0;

      groups.forEach(function (group) {
        var match = key === 'all' || group.getAttribute('data-brand') === key;
        group.hidden = !match;
        if (match) {
          shown += 1;
          if (!firstMatch) firstMatch = group;
        }
      });

      buttons.forEach(function (button) {
        var active = button.getAttribute('data-brand-filter') === key;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      if (countEl) {
        countEl.textContent = key === 'all'
          ? 'Showing all ' + shown + ' tile brands'
          : 'Showing ' + shown + ' of ' + groups.length + ' tile brands';
      }

      if (opts && opts.reveal && firstMatch && header) {
        var rect = firstMatch.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight) {
          var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({
            top: Math.max(0, rect.top + window.pageYOffset - header.offsetHeight - 16),
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        apply(button.getAttribute('data-brand-filter'), { reveal: true });
      });
    });

    /* Deep links (tiles.html#exxaro) preselect the matching brand on load. */
    var initial = 'all';
    if (window.location.hash) {
      var target = null;
      try { target = document.querySelector(window.location.hash); } catch (e) { target = null; }
      if (target && target.hasAttribute('data-brand')) {
        initial = target.getAttribute('data-brand');
      }
    }
    apply(initial, { reveal: false });
    bar.hidden = false;
  });
})();
