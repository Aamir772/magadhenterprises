/**
 * Magadh Enterprises — Tile Visualizer behaviour.
 *
 * Responsibilities:
 *   1. Render the tile picker and the space picker from window.MAGADH_TILES
 *   2. Swap the ACTUAL TILE and INSTALLED LOOK panels for the current selection
 *   3. Render an honest empty state when a tile has no genuine photograph for
 *      the chosen space — never a substitute image, never a broken <img>
 *   4. Mirror selection into the URL (?tile=…&space=…) and restore from it
 *   5. Keep the WhatsApp enquiry message in sync with the selection
 *
 * Selection model is a radio group per control, so arrow keys, Home/End and
 * roving tabindex behave the way assistive technology expects.
 */
(function () {
  'use strict';

  var data = window.MAGADH_TILES;
  var root = document.getElementById('tile-visualizer');
  if (!data || !root || !data.tiles.length) return;

  var els = {
    tiles: document.getElementById('tv-tiles'),
    spaces: document.getElementById('tv-spaces'),
    actualImage: document.getElementById('tv-actual-image'),
    actualFallback: document.getElementById('tv-actual-fallback'),
    installedBody: document.getElementById('tv-installed-body'),
    installedStatus: document.getElementById('tv-installed-status'),
    installedLive: document.getElementById('tv-installed-live'),
    info: document.getElementById('tv-info-grid'),
    selection: document.getElementById('tv-enquiry-selection'),
    whatsApp: document.getElementById('tv-whatsapp')
  };

  var tileById = {};
  data.tiles.forEach(function (tile) { tileById[tile.id] = tile; });
  var spaceById = {};
  data.spaces.forEach(function (space) { spaceById[space.id] = space; });

  var state = {
    tile: data.tiles[0].id,
    space: data.spaces[0].id
  };

  /* --- selection helpers -------------------------------------------------- */

  function tile() { return tileById[state.tile]; }
  function space() { return spaceById[state.space]; }
  function installedSrc() { return data.resolve(tile(), state.space); }

  /* --- rendering ---------------------------------------------------------- */

  function renderTiles() {
    var fragment = document.createDocumentFragment();

    data.tiles.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'tv-tile';
      button.setAttribute('role', 'radio');
      button.setAttribute('data-tile', item.id);

      var src = data.resolve(item, 'actual');
      if (src) {
        var img = document.createElement('img');
        img.className = 'tv-tile-img';
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = item.actualWidth || 400;
        img.height = item.actualHeight || 300;
        button.appendChild(img);
      }

      var name = document.createElement('span');
      name.className = 'tv-tile-name';
      name.textContent = item.name;
      button.appendChild(name);

      if (item.brand) {
        var brand = document.createElement('span');
        brand.className = 'tv-tile-brand';
        brand.textContent = item.brand;
        button.appendChild(brand);
      }

      fragment.appendChild(button);
    });

    els.tiles.appendChild(fragment);
  }

  function renderSpaces() {
    var fragment = document.createDocumentFragment();

    data.spaces.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'tv-space';
      button.setAttribute('role', 'radio');
      button.setAttribute('data-space', item.id);

      var label = document.createElement('span');
      label.className = 'tv-space-label';
      label.textContent = item.label;
      button.appendChild(label);

      var note = document.createElement('span');
      note.className = 'tv-space-note';
      note.textContent = item.note;
      button.appendChild(note);

      var status = document.createElement('span');
      status.className = 'tv-space-status';
      button.appendChild(status);

      fragment.appendChild(button);
    });

    els.spaces.appendChild(fragment);
  }

  function renderActual() {
    var item = tile();
    var src = data.resolve(item, 'actual');

    if (src) {
      els.actualImage.src = src;
      els.actualImage.alt = item.alt || (item.name + ' tile');
      els.actualImage.width = item.actualWidth || 1000;
      els.actualImage.height = item.actualHeight || 523;
      els.actualImage.hidden = false;
      els.actualFallback.hidden = true;
      return;
    }

    // No genuine photograph for this tile at all.
    els.actualImage.hidden = true;
    els.actualFallback.hidden = false;
  }

  function renderInstalled() {
    var item = tile();
    var src = installedSrc();
    var has = Boolean(src);

    els.installedBody.querySelectorAll('img').forEach(function (img) { img.remove(); });
    els.installedBody.querySelectorAll('.tv-empty').forEach(function (node) { node.remove(); });

    if (has) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = item.name + ' installed in a ' + space().label.toLowerCase();
      img.width = 1000;
      img.height = 750;
      img.decoding = 'async';
      els.installedBody.insertBefore(img, els.installedLive);
    } else {
      var empty = document.createElement('div');
      empty.className = 'tv-empty';

      var mark = document.createElement('span');
      mark.className = 'tv-empty-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = '·';
      empty.appendChild(mark);

      var title = document.createElement('p');
      title.className = 'tv-empty-title';
      title.textContent = 'Installation preview coming soon';
      empty.appendChild(title);

      var note = document.createElement('p');
      note.className = 'tv-empty-note';
      note.textContent = 'We do not have a photograph of ' + item.name +
        ' installed in a ' + space().label.toLowerCase() +
        ' yet. Our team at the Gaya showroom can show you the tile in person.';
      empty.appendChild(note);

      els.installedBody.insertBefore(empty, els.installedLive);
    }

    // Per-space availability is also announced on the control itself, so the
    // state is discoverable without activating anything.
    data.spaces.forEach(function (candidate) {
      var button = els.spaces.querySelector('[data-space="' + candidate.id + '"]');
      if (!button) return;
      var available = Boolean(data.resolve(item, candidate.id));
      button.querySelector('.tv-space-status').textContent =
        available ? 'Preview available' : 'Preview coming soon';
    });

    els.installedLive.textContent = has
      ? 'Showing ' + item.name + ' installed in a ' + space().label.toLowerCase() + '.'
      : 'An installation photograph of ' + item.name + ' in a ' +
        space().label.toLowerCase() + ' is not available yet.';
  }

  function renderInfo() {
    var item = tile();
    var rows = [
      { label: 'Tile', value: item.name },
      { label: 'Brand', value: item.brand },
      { label: 'Application', value: item.type },
      { label: 'Size', value: item.size },
      { label: 'Finish', value: item.finish },
      { label: 'Spaces visualised', value: environmentSummary(item) }
    ];

    var html = rows.map(function (row) {
      var known = Boolean(row.value);
      return '<div><dt>' + escapeHtml(row.label) + '</dt>' +
        '<dd' + (known ? '' : ' class="is-unknown"') + '>' +
        escapeHtml(known ? row.value : 'Ask our team') + '</dd></div>';
    }).join('');

    els.info.innerHTML = html;
  }

  function environmentSummary(item) {
    var available = data.spaces.filter(function (candidate) {
      return Boolean(data.resolve(item, candidate.id));
    }).map(function (candidate) { return candidate.label; });

    return available.length ? available.join(', ') : null;
  }

  function renderEnquiry() {
    var item = tile();
    els.selection.innerHTML = 'You selected <strong>' + escapeHtml(item.name) +
      '</strong> — visualised for <strong>' + escapeHtml(space().label) + '</strong>.';

    // Keeps the existing data-wa contract in config.js working unchanged.
    els.whatsApp.setAttribute('data-product', item.name + ' (' + space().label + ')');
    applyWhatsApp();
  }

  function applyWhatsApp() {
    var config = window.MAGADH_CONFIG;
    if (!config || !config.whatsapp) return;
    var template = config.whatsapp.messages.product;
    if (!template) return;
    var product = els.whatsApp.getAttribute('data-product');
    els.whatsApp.setAttribute(
      'href',
      config.whatsapp.base + '?text=' + encodeURIComponent(template.replace('{product}', product))
    );
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function syncControls() {
    els.tiles.querySelectorAll('[data-tile]').forEach(function (button) {
      var active = button.getAttribute('data-tile') === state.tile;
      button.setAttribute('aria-checked', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });

    els.spaces.querySelectorAll('[data-space]').forEach(function (button) {
      var active = button.getAttribute('data-space') === state.space;
      button.setAttribute('aria-checked', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });
  }

  function renderAll() {
    syncControls();
    renderActual();
    renderInstalled();
    renderInfo();
    renderEnquiry();
  }

  /* --- URL state ---------------------------------------------------------- */

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var tileId = params.get('tile');
    var spaceId = params.get('space');

    if (tileId && tileById[tileId]) state.tile = tileId;
    if (spaceId && spaceById[spaceId]) state.space = spaceId;
  }

  function writeUrl(mode) {
    if (!window.history || !window.history.replaceState) return;
    var url = window.location.pathname +
      '?tile=' + encodeURIComponent(state.tile) +
      '&space=' + encodeURIComponent(state.space);
    try {
      window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', url);
    } catch (error) {
      /* file:// origins can reject state changes; selection still works */
    }
  }

  /* --- interaction -------------------------------------------------------- */

  function wireRadioGroup(container, attribute, apply) {
    container.addEventListener('click', function (event) {
      var button = event.target.closest('[' + attribute + ']');
      if (!button || !container.contains(button)) return;
      apply(button.getAttribute(attribute));
      var focusTarget = container.querySelector('[' + attribute + '="' +
        (attribute === 'data-tile' ? state.tile : state.space) + '"]');
      if (focusTarget) focusTarget.focus();
    });

    container.addEventListener('keydown', function (event) {
      var button = event.target.closest('[' + attribute + ']');
      if (!button) return;

      var options = Array.prototype.slice.call(container.querySelectorAll('[' + attribute + ']'));
      var index = options.indexOf(button);
      var next = null;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': next = options[(index + 1) % options.length]; break;
        case 'ArrowLeft':
        case 'ArrowUp': next = options[(index - 1 + options.length) % options.length]; break;
        case 'Home': next = options[0]; break;
        case 'End': next = options[options.length - 1]; break;
        default: return;
      }

      event.preventDefault();
      apply(next.getAttribute(attribute));
      next.focus();
    });
  }

  /* --- boot --------------------------------------------------------------- */

  function init() {
    renderTiles();
    renderSpaces();
    readUrl();
    renderAll();

    // Replace the URL so it is shareable without adding a history entry.
    writeUrl('replace');

    wireRadioGroup(els.tiles, 'data-tile', function (id) {
      if (!tileById[id] || id === state.tile) return;
      state.tile = id;
      renderAll();
      writeUrl('push');
    });

    wireRadioGroup(els.spaces, 'data-space', function (id) {
      if (!spaceById[id] || id === state.space) return;
      state.space = id;
      renderAll();
      writeUrl('push');
    });

    window.addEventListener('popstate', function () {
      state.tile = data.tiles[0].id;
      state.space = data.spaces[0].id;
      readUrl();
      renderAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();