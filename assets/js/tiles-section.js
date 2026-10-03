/**
 * Magadh Enterprises — tile collection section behaviour.
 *
 * Two jobs, both progressive enhancements:
 *
 *   1. Pagination. Every card is present in the markup, so the section is
 *      crawlable and complete without JavaScript. On init this hides the cards
 *      beyond the first page and reveals one page at a time. Because the hidden
 *      cards are display:none, their `loading="lazy"` images are never fetched
 *      until the card is revealed.
 *
 *   2. Category filtering. The "Find Your Tile" chips filter the cards on their
 *      `data-category`. Where we hold no catalogue photography for a category,
 *      the grid shows an honest explanation plus a real next step instead of
 *      inventing products.
 *
 *   3. Lightbox. Clicking a card image or its "View tile" control opens a plain
 *      <dialog>-free overlay showing the full-size image, the product name and
 *      an enquiry call to action. No gallery library, no framework.
 *
 * Product data comes from assets/js/tile-collection.js (window.MAGADH_TILE_COLLECTION).
 */
(function () {
  'use strict';

  var PHONE = '+919661555733';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var data = window.MAGADH_TILE_COLLECTION;
    var grid = document.getElementById('tile-grid');
    if (!data || !data.tiles || !data.tiles.length || !grid) return;

    var tiles = data.tiles;
    var pageSize = data.pageSize || 8;
    var byId = {};
    tiles.forEach(function (t) { byId[t.id] = t; });

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.tile-card'));
    var moreBtn = document.getElementById('tile-load-more');
    var countEl = document.getElementById('tile-grid-count');
    var chipBar = document.getElementById('tile-filters');
    var emptyBox = document.getElementById('tile-empty');
    var emptyText = document.getElementById('tile-empty-text');
    var emptyCta = document.getElementById('tile-empty-cta');
    var filters = data.filters || [];
    var activeId = 'all';
    var shown = 0;

    /* ------------------------------------------------------------ filtering */
    function activeFilter() {
      for (var i = 0; i < filters.length; i++) {
        if (filters[i].id === activeId) return filters[i];
      }
      return null;
    }

    function matchingCards(filter) {
      if (!filter || filter.match === null || filter.match === undefined) return cards;
      return cards.filter(function (card) {
        return card.getAttribute('data-category') === filter.match;
      });
    }

    /* ------------------------------------------------- pagination + repaint */
    function paint() {
      var filter = activeFilter();
      var list = matchingCards(filter);
      var total = list.length;

      cards.forEach(function (card) {
        var i = list.indexOf(card);
        card.hidden = i === -1 || i >= shown;
      });

      var noun = filter && filter.id !== 'all' ? filter.label.toLowerCase() : 'tiles';

      if (countEl) {
        countEl.textContent = total === 0
          ? ''
          : (shown === total
              ? 'Showing all ' + total + ' ' + noun
              : 'Showing ' + shown + ' of ' + total + ' ' + noun);
      }
      if (moreBtn) {
        moreBtn.hidden = total === 0 || shown >= total;
        moreBtn.textContent = 'Load more ' + noun;
      }
      // A category we hold no catalogue photography for gets an honest
      // explanation and a real next step — never a fabricated product card.
      if (emptyBox) {
        emptyBox.hidden = total !== 0 || !filter;
        if (total === 0 && filter) {
          if (emptyText) {
            emptyText.textContent = filter.empty || 'No entries in this category yet.';
          }
          if (emptyCta) {
            var cta = filter.cta || { href: '#deals', label: 'See our showroom categories' };
            emptyCta.setAttribute('href', cta.href);
            emptyCta.textContent = cta.label;
          }
        }
      }
    }

    function showMore() {
      var total = matchingCards(activeFilter()).length;
      shown = Math.min(shown + pageSize, total);
      paint();
    }

    function applyFilter(id) {
      activeId = id;
      shown = Math.min(pageSize, matchingCards(activeFilter()).length);
      paint();
      if (chipBar) {
        Array.prototype.forEach.call(chipBar.querySelectorAll('.chip'), function (chip) {
          var on = chip.getAttribute('data-tile-filter') === activeId;
          chip.classList.toggle('is-active', on);
          chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
    }

    // Without JavaScript every card stays visible and the chips/button are inert.
    if (moreBtn) {
      moreBtn.hidden = false;
      moreBtn.addEventListener('click', showMore);
    }

    if (chipBar) {
      chipBar.addEventListener('click', function (e) {
        var chip = e.target.closest ? e.target.closest('.chip') : null;
        if (!chip) return;
        applyFilter(chip.getAttribute('data-tile-filter'));
      });
    }

    applyFilter('all');

    /* ------------------------------------------------------------ lightbox */
    var lb = null;
    var lbImg = null;
    var lbName = null;
    var lbLabel = null;
    var lbMeta = null;
    var lbClose = null;
    var lastFocused = null;

    function buildLightbox() {
      if (lb) return;
      lb = document.createElement('div');
      lb.className = 'tile-lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Tile preview');
      lb.innerHTML =
        '<div class="tile-lightbox-inner">' +
          '<button type="button" class="tile-lightbox-close" aria-label="Close preview">&times;</button>' +
          '<figure class="tile-lightbox-figure"><img alt=""></figure>' +
          '<div class="tile-lightbox-caption">' +
            '<p class="t-label" data-lb-label>Tile Collection</p>' +
            '<h3 class="tile-lightbox-name" data-lb-name></h3>' +
            '<p class="tile-lightbox-meta" data-lb-meta></p>' +
          '</div>' +
          '<div class="tile-lightbox-cta">' +
            '<a class="btn btn-light" data-lb-enquire href="tel:' + PHONE + '">Enquire</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(lb);
      lbImg = lb.querySelector('.tile-lightbox-figure img');
      lbName = lb.querySelector('[data-lb-name]');
      lbLabel = lb.querySelector('[data-lb-label]');
      lbMeta = lb.querySelector('[data-lb-meta]');
      lbClose = lb.querySelector('.tile-lightbox-close');

      lbClose.addEventListener('click', close);
      // Backdrop click closes; clicks inside the panel must not bubble out.
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      lb.addEventListener('keydown', trapFocus);
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      var focusables = [lbClose, lb.querySelector('[data-lb-enquire]')];
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

    function open(tile, trigger) {
      if (!tile) return;
      buildLightbox();
      lastFocused = trigger || null;
      lbImg.src = tile.image;
      lbImg.alt = tile.alt || tile.name;
      lbName.textContent = tile.name;
      if (lbLabel) lbLabel.textContent = tile.brand || tile.category || 'Tile Collection';
      // Never invent commercial detail: only show what the data actually holds.
      var bits = [];
      if (tile.size) bits.push(tile.size);
      if (tile.brand) bits.push(tile.brand);
      lbMeta.textContent = bits.length
        ? bits.join(' \u00b7 ')
        : 'Ask our team for finish, size and availability details.';
      lb.classList.add('open');
      document.body.classList.add('tiles-lightbox-open');
      lbClose.focus();
    }

    function close() {
      if (!lb) return;
      lb.classList.remove('open');
      document.body.classList.remove('tiles-lightbox-open');
      lbImg.removeAttribute('src');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
      lastFocused = null;
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb && lb.classList.contains('open')) close();
    });

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-tile-open]') : null;
      var card = e.target.closest ? e.target.closest('.tile-card') : null;
      if (btn) {
        e.preventDefault();
        open(byId[btn.getAttribute('data-tile-open')], btn);
        return;
      }
      // Clicking the photograph opens it too; the button remains the
      // keyboard-accessible path so no duplicate tab stop is introduced.
      if (card && e.target.tagName === 'IMG') {
        open(byId[card.getAttribute('data-tile')], null);
      }
    });
  });
})();