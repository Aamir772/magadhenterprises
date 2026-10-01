/**
 * Magadh Enterprises — Tile Visualizer catalogue.
 *
 * THE ASSET CONTRACT
 * ------------------
 * One entry per tile. Every entry points at an ACTUAL tile photograph that
 * genuinely shows that tile, and at installation photographs that genuinely
 * show that SAME tile in that specific space. Nothing is ever substituted,
 * reused across tiles, or paired by array position.
 *
 * To publish a new tile:
 *
 *   1. Add real photography:
 *        assets/tiles/<tile-id>/actual.<ext>
 *        assets/tiles/<tile-id>/kitchen.<ext>
 *        assets/tiles/<tile-id>/floor.<ext>
 *        assets/tiles/<tile-id>/wall.<ext>
 *        assets/tiles/<tile-id>/bathroom.<ext>
 *   2. Add ONE entry below.
 *
 * An environment value of:
 *   string  -> explicit relative path to a genuine photo of this tile in that space
 *   true    -> resolved as "<base><slot>.<ext>" (see the tile's `base` / `ext`)
 *   null    -> NO such photo exists. The UI renders an honest "coming soon"
 *              state and never requests a file, so nothing 404s.
 *
 * `null` is the correct value for any environment without genuine photography.
 * It is never acceptable to fill it with a showroom shot, a different tile, or
 * a repeated copy of `actual`.
 */
window.MAGADH_TILES = (function () {
  'use strict';

  var SPACES = [
    { id: 'kitchen',  label: 'Kitchen',  note: 'Walls, backsplashes and worktops' },
    { id: 'floor',    label: 'Floor',    note: 'Flooring and heavy-traffic surfaces' },
    { id: 'wall',     label: 'Wall',     note: 'Feature walls and cladding' },
    { id: 'bathroom', label: 'Bathroom', note: 'Wet areas and splash zones' }
  ];

  var tiles = [
    {
      id: 'tile-01',
      name: 'Tiles Range',
      brand: 'Magadh Enterprises',
      type: 'Floor and wall tiles',
      // Populate only from real product data. Omit rather than guess.
      size: null,
      finish: null,
      base: 'assets/tiles/tile-01/',
      ext: 'jpg',
      alt: 'Tiles on display at the Magadh Enterprises showroom, Gaya',
      // The one genuine tile-design photograph the project currently holds.
      // Kept in place rather than copied so the homepage still resolves it.
      actual: 'assets/images/tiles/category-tiles.jpg',
      actualWidth: 1000,
      actualHeight: 523,
      environments: {
        kitchen: null,
        floor: null,
        wall: null,
        bathroom: null
      }
    }
  ];

  return {
    spaces: SPACES,
    tiles: tiles,
    /**
     * Resolve one image slot for a tile, or null when no genuine photograph
     * exists for it.
     */
    resolve: function (tile, slot) {
      var value = slot === 'actual' ? tile.actual : tile.environments[slot];
      if (typeof value === 'string' && value) return value;
      if (value === true && tile.base && tile.ext) return tile.base + slot + '.' + tile.ext;
      return null;
    }
  };
})();