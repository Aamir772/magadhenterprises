/**
 * Magadh Enterprises — Tile Visualizer catalogue.
 *
 * Source photography: assets/images/visual/ (17 display photographs supplied
 * by the business). Web-ready derivatives live in assets/images/tiles/<id>/.
 * Originals are never modified.
 *
 * PRODUCT METADATA
 * ----------------
 * No product names, brands, sizes, finishes or product types have been
 * verified for these tiles, so those fields are null and the UI shows
 * "Ask our team" rather than inventing commercial detail. Display names are
 * neutral ("Tile 01") on purpose. Populate them once the real catalogue data
 * is confirmed.
 *
 * ENVIRONMENT IMAGES
 * ------------------
 * There are no per-space installation photographs. The four environments are
 * generated on demand by the server-side AI pipeline (netlify/functions/
 * tile-visualize.mjs) using the selected tile's `actual` image as the source
 * material reference. `environments` is therefore reserved for cached results
 * and stays empty here; nothing is ever faked client-side.
 */
window.MAGADH_TILES = (function () {
  'use strict';

  var SPACES = [
    { id: 'kitchen',  label: 'Kitchen',  note: 'Backsplash, walls and worktops' },
    { id: 'floor',    label: 'Floor',    note: 'Living, dining and hallway areas' },
    { id: 'wall',     label: 'Wall',     note: 'Feature and accent walls' },
    { id: 'bathroom', label: 'Bathroom', note: 'Wet areas and splash zones' }
  ];

  /* Kept in sync with netlify/functions/tile-catalog.json. The function
     validates against its own copy so a tampered client payload cannot widen
     the allowed set; assets/js/consistency tests assert the two agree. */
  var RAW = [
    ['tile-01', 'Tiles- (3).jpg'],  ['tile-02', 'Tiles- (4).jpg'],
    ['tile-03', 'Tiles- (5).jpg'],  ['tile-04', 'Tiles- (6).jpg'],
    ['tile-05', 'Tiles- (7).jpg'],  ['tile-06', 'Tiles- (8).jpg'],
    ['tile-07', 'Tiles- (9).jpg'],  ['tile-08', 'Tiles- (10).jpg'],
    ['tile-09', 'Tiles- (11).jpg'], ['tile-10', 'Tiles- (12).jpg'],
    ['tile-11', 'Tiles- (13).jpg'], ['tile-12', 'Tiles- (14).jpg'],
    ['tile-13', 'Tiles- (15).jpg'], ['tile-14', 'Tiles- (16).jpg'],
    ['tile-15', 'Tiles- (17).jpg'], ['tile-16', 'Tiles- (18).jpg'],
    ['tile-17', 'Tiles- (19).jpg']
  ];

  var ACTUAL_W = 1350;
  var ACTUAL_H = 1800;

  var tiles = RAW.map(function (entry) {
    var id = entry[0];
    return {
      id: id,
      name: 'Tile ' + id.slice(-2),
      brand: null,
      size: null,
      finish: null,
      type: null,
      alt: 'Tile ' + id.slice(-2) + ' from the Magadh Enterprises tile range, Gaya',
      actual: 'assets/images/tiles/' + id + '/actual.jpg',
      actualWidth: ACTUAL_W,
      actualHeight: ACTUAL_H,
      source: 'assets/images/visual/' + entry[1],
      // This tile may be sent to the AI pipeline as the source material.
      generatable: true,
      // No pre-existing installation photography exists for any space.
      environments: { kitchen: null, floor: null, wall: null, bathroom: null }
    };
  });

  var DISCLAIMER =
    'AI Visualization — illustrative preview. Actual appearance may vary by ' +
    'lighting, installation pattern, grout, screen and real-world conditions.';

  return {
    spaces: SPACES,
    tiles: tiles,
    api: {
      endpoint: '/api/tile-visualize',
      disclaimer: DISCLAIMER,
      badge: 'AI Visualization'
    },
    /** Resolve a real image asset, or null when none exists. */
    resolve: function (tile, slot) {
      var value = slot === 'actual' ? tile.actual : tile.environments[slot];
      return typeof value === 'string' && value ? value : null;
    }
  };
})();