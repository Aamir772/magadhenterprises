/**
 * Magadh Enterprises — Tile Visualizer behaviour.
 *
 * Responsibilities:
 *   1. Render the tile picker and the room picker from window.MAGADH_TILES
 *   2. Swap the ACTUAL TILE panel for the current selection
 *   3. Run the AI generation flow against /api/tile-visualize: idle -> loading
 *      -> result or error, never a fabricated intermediate state
 *   4. Mirror selection into the URL (?tile=…&space=…) and restore from it
 *   5. Keep both WhatsApp enquiry links in sync with the selection
 *
 * Nothing is generated until the visitor asks for it, and a generated image is
 * always labelled as an illustrative preview.
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
    aiBody: document.getElementById('tv-ai-body'),
    aiStatus: document.getElementById('tv-ai-status'),
    aiLive: document.getElementById('tv-ai-live'),
    aiImage: document.getElementById('tv-ai-image'),
    aiBadge: document.getElementById('tv-ai-badge'),
    aiIdle: document.getElementById('tv-ai-idle'),
    aiIdleNote: document.getElementById('tv-ai-idle-note'),
    aiLoading: document.getElementById('tv-ai-loading'),
    aiError: document.getElementById('tv-ai-error'),
    aiErrorNote: document.getElementById('tv-ai-error-note'),
    aiRetry: document.getElementById('tv-ai-retry'),
    aiActions: document.getElementById('tv-ai-actions'),
    aiDisclaimer: document.getElementById('tv-ai-disclaimer'),
    aiRegenerate: document.getElementById('tv-ai-regenerate'),
    aiOtherSpace: document.getElementById('tv-ai-other-space'),
    aiChangeTile: document.getElementById('tv-ai-change-tile'),
    aiWhatsApp: document.getElementById('tv-ai-whatsapp'),
    generate: document.getElementById('tv-generate'),
    generateNote: document.getElementById('tv-generate-note'),
    aiNote: document.getElementById('tv-ai-note'),
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

  /* Local demo mode. Gated on a local hostname as well as the query flag, so a
     published link can never be used to make the live site serve placeholders. */
  var LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(window.location.hostname);
  var DEMO = LOCAL_HOST && /[?&]demo=true/.test(window.location.search);

  var DEMO_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">' +
    '<rect width="1024" height="1024" fill="#EDE6DA"/>' +
    '<text x="512" y="500" text-anchor="middle" font-family="sans-serif" ' +
    'font-size="52" fill="#8C4F35">DEMO MODE</text>' +
    '<text x="512" y="560" text-anchor="middle" font-family="sans-serif" ' +
    'font-size="26" fill="#6B655D">Placeholder &#8212; not a real AI preview</text>' +
    '</svg>');

  /* Shown instead of the AI badge/disclaimer when the business has supplied a
     real photograph of the tile installed in that space. */
  var PHOTO_BADGE = 'Reference photograph';
  var PHOTO_NOTE =
    'Photograph supplied for this space. A real installation still varies with ' +
    'lighting, laying pattern, grout and the room it sits in — ask us to hold ' +
    'the sample for you.';

  /* Results already paid for in this session, keyed tileId|environment. Keeps
     re-selecting a space from spending credits a second time. */
  var results = {};
  var inFlight = null;
  var busy = false;

  /* --- selection helpers -------------------------------------------------- */

  function tile() { return tileById[state.tile]; }
  function space() { return spaceById[state.space]; }
  function spaceLabel(id) { return spaceById[id] ? spaceById[id].label : id; }
  function resultKey(id, environment) { return id + '|' + environment; }

  /* A real installation photograph supplied by the business for this tile in
     this space, or null. Null is what routes the panel to the AI pipeline. */
  function suppliedFor(tileItem, spaceId) {
    if (!data.suppliedEnvironment) return null;
    return data.suppliedEnvironment(tileItem, spaceId);
  }

  function suppliedForSelection() {
    return suppliedFor(tile(), state.space);
  }

  /* --- rendering ---------------------------------------------------------- */

  function renderTiles() {
    var fragment = document.createDocumentFragment();

    data.tiles.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'tv-tile';
      button.setAttribute('role', 'radio');
      button.setAttribute('data-tile', item.id);

      var src = data.resolve(item, 'actual-square') || data.resolve(item, 'actual');
      if (src) {
        var img = document.createElement('img');
        img.className = 'tv-tile-img';
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        // Square picker crop when available, otherwise the full portrait frame.
        img.width = item.thumbWidth || 320;
        img.height = item.thumbHeight || 320;
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
      els.actualImage.width = item.actualWidth || 1350;
      els.actualImage.height = item.actualHeight || 1800;
      els.actualImage.hidden = false;
      els.actualFallback.hidden = true;
      return;
    }

    // No genuine photograph for this tile at all.
    els.actualImage.hidden = true;
    els.actualFallback.hidden = false;
  }

  /* --- AI panel states ----------------------------------------------------- */

  function showState(name) {
    els.aiIdle.hidden = name !== 'idle';
    els.aiLoading.hidden = name !== 'loading';
    els.aiError.hidden = name !== 'error';
    var isResult = name === 'result';
    els.aiImage.hidden = !isResult;
    els.aiBadge.hidden = !isResult;
    els.aiActions.hidden = !isResult;
  }

  function setBusy(value) {
    busy = value;
    els.generate.disabled = value;
    els.generate.setAttribute('aria-busy', value ? 'true' : 'false');
    els.aiBody.setAttribute('aria-busy', value ? 'true' : 'false');
  }

  function cancelInFlight() {
    if (!inFlight) return;
    inFlight.abort();
    inFlight = null;
    setBusy(false);
  }

  function resetPanel(message) {
    els.aiImage.removeAttribute('src');
    els.aiStatus.textContent = 'Not generated yet';
    els.aiIdleNote.textContent =
      'Choose a tile and a space, then press Generate AI Preview.';
    els.aiLive.textContent = message || 'Ready to generate.';
    showState('idle');
  }

  function renderResult(result) {
    els.aiImage.src = result.src;
    els.aiImage.alt = result.demo
      ? 'Demo placeholder. No AI preview was generated.'
      : 'AI-generated illustrative preview of ' + result.tileName + ' in a ' +
        spaceLabel(result.environment).toLowerCase() +
        '. Illustrative only, not an exact representation of the finished installation.';
    els.aiImage.width = 1024;
    els.aiImage.height = 1024;
    els.aiBadge.textContent = result.demo ? 'Demo Output' : data.api.badge;
    els.aiDisclaimer.textContent = result.demo
      ? 'DEMO MODE — this is a placeholder, not a real AI preview. ' + data.api.disclaimer
      : data.api.disclaimer;
    els.aiStatus.textContent = result.demo ? 'Demo output' : 'Preview ready';
    els.aiLive.textContent = result.demo
      ? 'Demo placeholder shown. No AI preview was generated.'
      : 'AI preview ready for ' + result.tileName + ' in the ' +
        spaceLabel(result.environment).toLowerCase() + '. Illustrative preview only.';
    applyAiWhatsApp(result);
    showState('result');
  }

  function renderError(message) {
    els.aiErrorNote.textContent = message;
    els.aiStatus.textContent = 'Preview failed';
    els.aiLive.textContent = message;
    showState('error');
  }

  /* A real supplied photograph outranks any generated preview: it is the
     business's own record of the tile installed, so it is shown as-is and the
     Generate control is withdrawn. */
  function renderPhoto(photo) {
    var item = tile();
    els.aiImage.src = photo;
    els.aiImage.alt = item.name + ' installed as a ' +
      spaceLabel(state.space).toLowerCase() + ' — reference photograph';
    els.aiImage.width = 1024;
    els.aiImage.height = 768;
    els.aiBadge.textContent = PHOTO_BADGE;
    els.aiDisclaimer.textContent = PHOTO_NOTE;
    els.aiStatus.textContent = 'Reference photograph';
    els.aiLive.textContent = 'Showing the supplied ' +
      spaceLabel(state.space).toLowerCase() + ' photograph for ' + item.name + '.';
    applyAiWhatsApp({ tileName: item.name, environment: state.space });
    showState('result');
  }

  function syncPanelForSelection() {
    var supplied = suppliedForSelection();
    if (supplied) { renderPhoto(supplied); return; }

    var cached = results[resultKey(state.tile, state.space)];
    if (cached) renderResult(cached);
    else resetPanel();
  }

  /* Withdrawing the Generate control whenever a photograph already answers the
     request, so the visitor is never offered a slow, paid preview they do not
     need. An author `display` on .btn beats the UA [hidden] rule, hence the
     .tv-generate-btn[hidden] guard in tile-visualizer.css. */
  function syncGenerateAvailability() {
    var supplied = suppliedForSelection();
    els.generate.hidden = Boolean(supplied);
    els.generateNote.hidden = Boolean(supplied);
    if (supplied) {
      els.aiNote.textContent = '';
    } else {
      els.aiNote.textContent = data.api.disclaimer;
    }
  }

  /* --- generation --------------------------------------------------------- */

  function generate() {
    if (busy) return; // duplicate-click guard: one generation in flight

    // A supplied photograph already answers this request; never spend a
    // generation on it even if the control was triggered programmatically.
    if (suppliedForSelection()) { syncPanelForSelection(); return; }

    var key = resultKey(state.tile, state.space);
    var cached = results[key];
    if (cached) { renderResult(cached); return; }

    var requestedTile = state.tile;
    var requestedSpace = state.space;
    var requestedName = tile().name;

    if (DEMO) {
      var placeholder = {
        src: DEMO_PLACEHOLDER,
        demo: true,
        tileName: requestedName,
        environment: requestedSpace
      };
      results[key] = placeholder;
      renderResult(placeholder);
      return;
    }

    setBusy(true);
    showState('loading');
    els.aiStatus.textContent = 'Generating';
    els.aiLive.textContent = 'Creating your visualization for ' + requestedName +
      ' in the ' + spaceLabel(requestedSpace).toLowerCase() +
      '. This usually takes under a minute.';

    var controller = new AbortController();
    inFlight = controller;

    fetch(data.api.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tileId: requestedTile,
        environment: requestedSpace
      }),
      signal: controller.signal
    })
      .then(function (response) {
        return response.json()
          .catch(function () { return null; })
          .then(function (payload) {
            return { status: response.status, payload: payload };
          });
      })
      .then(function (outcome) {
        if (controller.signal.aborted) return;

        var payload = outcome.payload;

        if (outcome.status !== 200 || !payload || !payload.success) {
          renderError(
            (payload && payload.message) ||
            'AI visualization is temporarily unavailable. Please try again.'
          );
          return;
        }

        // A demo response never spends credits and is never labelled as real.
        if (payload.demo === true) {
          results[resultKey(requestedTile, requestedSpace)] = {
            src: DEMO_PLACEHOLDER,
            demo: true,
            tileName: payload.tileName || requestedName,
            environment: requestedSpace
          };
          renderResult(results[resultKey(requestedTile, requestedSpace)]);
          return;
        }

        var image = payload.image;
        if (typeof image !== 'string' || image.length < 64 || image.length > 9000000) {
          renderError('That preview came back unusable. Please try again.');
          return;
        }

        var out = {
          src: 'data:image/png;base64,' + image,
          demo: false,
          tileName: payload.tileName || requestedName,
          environment: requestedSpace
        };
        results[resultKey(requestedTile, requestedSpace)] = out;
        renderResult(out);
      })
      .catch(function (error) {
        if (controller.signal.aborted || (error && error.name === 'AbortError')) return;
        renderError('AI visualization is temporarily unavailable. Please try again.');
      })
      .then(function () {
        if (inFlight === controller) {
          inFlight = null;
          setBusy(false);
        }
      });
  }

  function applyAiWhatsApp(result) {
    var config = window.MAGADH_CONFIG;
    if (!config || !config.whatsapp) return;
    var template = config.whatsapp.messages.product;
    if (!template) return;
    var product = result.tileName + ' (' + spaceLabel(result.environment) + ')';
    els.aiWhatsApp.setAttribute(
      'href',
      config.whatsapp.base + '?text=' + encodeURIComponent(template.replace('{product}', product))
    );
  }

  function syncSpaceStatus() {
    var item = tile();
    data.spaces.forEach(function (candidate) {
      var button = els.spaces.querySelector('[data-space="' + candidate.id + '"]');
      if (!button) return;
      var status = button.querySelector('.tv-space-status');
      if (!status) return;
      if (suppliedFor(item, candidate.id)) status.textContent = 'Photograph available';
      else if (item.generatable) status.textContent = 'AI preview available';
      else status.textContent = 'Preview unavailable';
    });
  }

  function renderInfo() {
    var item = tile();
    var rows = [
      { label: 'Tile', value: item.name },
      { label: 'Brand', value: item.brand },
      { label: 'Application', value: item.type },
      { label: 'Size', value: item.size },
      { label: 'Finish', value: item.finish },
      { label: 'Previews', value: environmentSummary(item) }
    ];

    var html = rows.map(function (row) {
      var known = Boolean(row.value);
      return '<div><dt>' + escapeHtml(row.label) + '</dt>' +
        '<dd' + (known ? '' : ' class="is-unknown"') + '>' +
        escapeHtml(known ? row.value : 'Ask our team') + '</dd></div>';
    }).join('');

    els.info.innerHTML = html;
  }

  /* Marks each space with how its Installed Look is produced, so the page never
   implies a photograph exists where one does not. */
  function environmentSummary(item) {
    var labels = data.spaces.map(function (candidate) {
      if (suppliedFor(item, candidate.id)) return candidate.label + ' (photo)';
      if (item.generatable) return candidate.label + ' (AI)';
      return null;
    }).filter(Boolean);
    return labels.length ? labels.join(', ') : null;
  }

  function renderEnquiry() {
    var item = tile();
    els.selection.innerHTML = 'You selected <strong>' + escapeHtml(item.name) +
      '</strong> — previewed for <strong>' + escapeHtml(space().label) + '</strong>.';

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
    syncSpaceStatus();
    renderInfo();
    renderEnquiry();
    syncGenerateAvailability();
    syncPanelForSelection();
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
      '&space=' + encodeURIComponent(state.space) +
      (DEMO ? '&demo=true' : '');
    try {
      window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', url);
    } catch (error) {
      /* file:// origins can reject state changes; selection still works */
    }
  }

  /* --- interaction -------------------------------------------------------- */

  function selectTile(id) {
    if (!tileById[id] || id === state.tile) return;
    state.tile = id;
    cancelInFlight();
    renderAll();
    writeUrl('push');
  }

  function selectSpace(id) {
    if (!spaceById[id] || id === state.space) return;
    state.space = id;
    cancelInFlight();
    renderAll();
    writeUrl('push');
  }

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

    els.aiNote.textContent = data.api.disclaimer;
    renderAll();

    // Replace the URL so it is shareable without adding a history entry.
    writeUrl('replace');

    wireRadioGroup(els.tiles, 'data-tile', selectTile);
    wireRadioGroup(els.spaces, 'data-space', selectSpace);

    els.generate.addEventListener('click', generate);
    els.aiRetry.addEventListener('click', function () { cancelInFlight(); generate(); });

    els.aiRegenerate.addEventListener('click', function () {
      cancelInFlight();
      // Explicitly drop the cached result: regenerating is a fresh cost.
      delete results[resultKey(state.tile, state.space)];
      generate();
    });

    els.aiOtherSpace.addEventListener('click', function () {
      var index = -1;
      data.spaces.forEach(function (candidate, position) {
        if (candidate.id === state.space) index = position;
      });
      var next = data.spaces[(index + 1) % data.spaces.length];
      selectSpace(next.id);
      var button = els.spaces.querySelector('[data-space="' + next.id + '"]');
      if (button) button.focus();
    });

    els.aiChangeTile.addEventListener('click', function () {
      var current = els.tiles.querySelector('[data-tile="' + state.tile + '"]');
      if (current) {
        current.focus();
        current.scrollIntoView({ block: 'center' });
      }
    });

    window.addEventListener('popstate', function () {
      cancelInFlight();
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