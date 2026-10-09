/**
 * Magadh Enterprises — product category filters.
 *
 * A tab bar in #product-filters filters the real product cards rendered
 * below it on a catalogue page. The markup is static and crawlable, so this
 * file only ever *narrows* what is already in the HTML: every card is visible
 * without scripting and nothing is fetched or generated.
 *
 * Data flow:
 *   - index.html  renders .product-card[data-category] for every product.
 *   - products.js holds the same products as structured data, each with the
 *     `category` slug these tabs filter on.
 * The DOM is treated as the source of truth here (it is what the visitor sees);
 * main.js's catalogue check independently warns if the two drift apart.
 *
 * Progressive enhancement:
 *   - #product-filters ships with the `hidden` attribute. It is revealed only
 *     after the wiring below succeeds, so a failed or blocked script leaves the
 *     page showing all products and no dead controls.
 *   - The tabs are a group of toggle buttons (aria-pressed), not ARIA tabs:
 *     they filter one region rather than swapping panels, so focus is never
 *     trapped and arrow keys are a convenience, not a requirement.
 */
(function () {
  'use strict';

  var GUTTER = 16; /* breathing room between the sticky header and the target */

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ready(function () {
    var bar = document.getElementById('product-filters');
    if (!bar) return;

    var tabs = Array.prototype.slice.call(bar.querySelectorAll('[data-product-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.product-card[data-category]'));
    if (!tabs.length || !cards.length) return;

    var countEl = document.getElementById('product-filter-count');
    var header = document.querySelector('.site-header');
    var total = cards.length;

    /* Group the cards by their brand section so a section with nothing left in
       it can be hidden wholesale; otherwise a filtered-out brand would leave an
       orphaned "MYK Arment" heading above an empty grid. */
    var sections = [];
    cards.forEach(function (card) {
      var section = card.closest('section[id]');
      if (!section) return;
      var known = sections.some(function (entry) { return entry.el === section; });
      if (!known) sections.push({ el: section, cards: [] });
      sections.filter(function (entry) { return entry.el === section; })[0].cards.push(card);
    });

    /* Bring the first matching card into view when the results are off-screen.
       The full-bleed promo banner sits between the tab bar and the grids, so a
       click can otherwise appear to do nothing. Only scrolls when the target is
       genuinely outside the viewport, which keeps an already-visible result
       perfectly still. */
    function reveal(target) {
      var rect = target.getBoundingClientRect();
      var top = rect.top;
      var bottom = rect.bottom;
      var visible = top >= 0 && bottom <= window.innerHeight;

      /* Already on screen: leave the scroll position alone. */
      if (visible) return;

      var offset = (header ? header.offsetHeight : 0) + GUTTER;
      /* When the card sits below the fold, align it under the sticky header.
         When it sits above, bring its own top there instead. */
      var destination = top > 0
        ? rect.top + window.pageYOffset - offset
        : rect.bottom + window.pageYOffset - window.innerHeight;

      window.scrollTo({
        top: Math.max(0, Math.round(destination)),
        behavior: reduceMotion() ? 'auto' : 'smooth'
      });
    }

    function apply(filter, opts) {
      var firstMatch = null;
      var shown = 0;

      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !match;
        if (match) {
          shown += 1;
          if (!firstMatch) firstMatch = card;
        }
      });

      sections.forEach(function (entry) {
        var anyVisible = entry.cards.some(function (card) { return !card.hidden; });
        entry.el.hidden = !anyVisible;
      });

      tabs.forEach(function (tab) {
        var active = tab.getAttribute('data-product-filter') === filter;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      if (countEl) {
        countEl.textContent = filter === 'all'
          ? 'Showing all ' + total + ' products'
          : 'Showing ' + shown + ' of ' + total + ' products';
      }

      if (opts && opts.reveal && firstMatch) reveal(firstMatch);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        apply(tab.getAttribute('data-product-filter'), { reveal: true });
      });

      /* Arrow keys move between tabs, matching the visual order. This is a
         convenience only: every tab stays a normal tab stop and responds to
         Enter and Space, so the group is fully usable without it. */
      tab.addEventListener('keydown', function (event) {
        var step = 0;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') step = 1;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') step = -1;
        else if (event.key === 'Home') step = 'first';
        else if (event.key === 'End') step = 'last';
        else return;

        event.preventDefault();

        var next;
        if (step === 'first') next = 0;
        else if (step === 'last') next = tabs.length - 1;
        else next = (index + step + tabs.length) % tabs.length;

        tabs[next].focus();
        apply(tabs[next].getAttribute('data-product-filter'), { reveal: false });
      });
    });

    /* Establish the initial state before the bar becomes visible, so the first
       paint of the tabs already matches the grid. */
    apply('all', { reveal: false });
    bar.hidden = false;
  });
})();