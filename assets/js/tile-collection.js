/**
 * Magadh Enterprises — homepage tile collection.
 *
 * Source photography: assets/images/visual/ (20 display photographs, which
 * are gitignored provenance originals and are never served).
 *
 * The site is served the web-ready derivatives in
 * assets/images/tiles/collection/ (900x1350 JPEG, an exact 2:3 downscale of
 * the 1024x1536 sources, so nothing is cropped or distorted). `sourceFile`
 * and `original` keep the untouched original filename for provenance.
 *
 * PRODUCT METADATA
 * ----------------
 * The supplied files carry no product, brand, size or finish information in
 * their filenames, so none is invented here. `name` is a neutral placeholder
 * ("Tile 01") and `size` / `brand` are null. `sourceFile` keeps the original
 * filename so every entry can be renamed once the real catalogue data is
 * confirmed.
 *
 * `category` is "tiles" because every supplied asset is a tile photograph —
 * that is read off the assets, not guessed. It is the field the "Find Your
 * Tile" chips filter on, so adding a marble or granite entry with the matching
 * category makes that chip light up with no further code change.
 *
 * The cards in index.html are generated from this file; the lightbox and the
 * "load more" pagination in assets/js/tiles-section.js read from it too.
 */
window.MAGADH_TILE_COLLECTION = (function () {
  'use strict';

  var TILES = [
    {
      id: "tile-01",
      name: "Tile 01",
      image: "assets/images/tiles/collection/tile-01.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 01 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_18_21 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_18_21 PM.png"
    },
    {
      id: "tile-02",
      name: "Tile 02",
      image: "assets/images/tiles/collection/tile-02.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 02 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_24_01 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_24_01 PM.png"
    },
    {
      id: "tile-03",
      name: "Tile 03",
      image: "assets/images/tiles/collection/tile-03.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 03 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_27_53 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_27_53 PM.png"
    },
    {
      id: "tile-04",
      name: "Tile 04",
      image: "assets/images/tiles/collection/tile-04.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 04 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_29_35 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_29_35 PM.png"
    },
    {
      id: "tile-05",
      name: "Tile 05",
      image: "assets/images/tiles/collection/tile-05.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 05 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_31_05 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_31_05 PM.png"
    },
    {
      id: "tile-06",
      name: "Tile 06",
      image: "assets/images/tiles/collection/tile-06.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 06 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_32_25 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_32_25 PM.png"
    },
    {
      id: "tile-07",
      name: "Tile 07",
      image: "assets/images/tiles/collection/tile-07.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 07 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_39_25 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_39_25 PM.png"
    },
    {
      id: "tile-08",
      name: "Tile 08",
      image: "assets/images/tiles/collection/tile-08.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 08 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_45_02 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_45_02 PM.png"
    },
    {
      id: "tile-09",
      name: "Tile 09",
      image: "assets/images/tiles/collection/tile-09.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 09 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_46_18 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_46_18 PM.png"
    },
    {
      id: "tile-10",
      name: "Tile 10",
      image: "assets/images/tiles/collection/tile-10.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 10 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_48_30 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_48_30 PM.png"
    },
    {
      id: "tile-11",
      name: "Tile 11",
      image: "assets/images/tiles/collection/tile-11.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 11 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 09_50_05 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 09_50_05 PM.png"
    },
    {
      id: "tile-12",
      name: "Tile 12",
      image: "assets/images/tiles/collection/tile-12.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 12 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_01_05 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_01_05 PM.png"
    },
    {
      id: "tile-13",
      name: "Tile 13",
      image: "assets/images/tiles/collection/tile-13.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 13 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_10_29 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_10_29 PM.png"
    },
    {
      id: "tile-14",
      name: "Tile 14",
      image: "assets/images/tiles/collection/tile-14.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 14 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_37_11 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_37_11 PM.png"
    },
    {
      id: "tile-15",
      name: "Tile 15",
      image: "assets/images/tiles/collection/tile-15.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 15 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_39_06 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_39_06 PM.png"
    },
    {
      id: "tile-16",
      name: "Tile 16",
      image: "assets/images/tiles/collection/tile-16.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 16 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_40_32 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_40_32 PM.png"
    },
    {
      id: "tile-17",
      name: "Tile 17",
      image: "assets/images/tiles/collection/tile-17.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 17 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_42_20 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_42_20 PM.png"
    },
    {
      id: "tile-18",
      name: "Tile 18",
      image: "assets/images/tiles/collection/tile-18.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 18 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_44_23 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_44_23 PM.png"
    },
    {
      id: "tile-19",
      name: "Tile 19",
      image: "assets/images/tiles/collection/tile-19.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 19 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_46_01 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_46_01 PM.png"
    },
    {
      id: "tile-20",
      name: "Tile 20",
      image: "assets/images/tiles/collection/tile-20.jpg",
      size: null,
      brand: null,
      category: "tiles",
      alt: "Tile 20 from the Magadh Enterprises tile range, Gaya",
      width: 900,
      height: 1350,
      sourceFile: "ChatGPT Image Oct 2, 2026, 10_48_28 PM.png",
      original: "assets/images/visual/ChatGPT Image Oct 2, 2026, 10_48_28 PM.png"
    }
  ];

  /* Chip bar for "Find Your Tile".
     Each chip either matches catalogue entries via `match`, or — where we hold
     no catalogue photography for that category — carries an honest `empty`
     message plus a genuinely useful next step. No chip invents a product,
     a size or a specification. */
  var FILTERS = [
    { id: 'all', label: 'All', match: null },
    { id: 'tiles', label: 'Tiles', match: 'tiles' },
    {
      id: 'marble', label: 'Marble', match: 'marble',
      empty: 'We do not have individual marble slab photographs online yet. Marble is on display at our Nagmatiya Road showroom in Gaya — call us to check what is in stock.',
      cta: { href: 'tel:+919661555733', label: 'Call the showroom' }
    },
    {
      id: 'granite', label: 'Granite', match: 'granite',
      empty: 'We do not have individual granite slab photographs online yet. Granite is on display at our Nagmatiya Road showroom in Gaya — call us to check what is in stock.',
      cta: { href: 'tel:+919661555733', label: 'Call the showroom' }
    },
    {
      id: 'sanitaryware', label: 'Sanitaryware', match: 'sanitaryware',
      empty: 'Sanitaryware availability changes often, so we do not list it online. Call or WhatsApp us and we will tell you what is currently on display.',
      cta: { href: 'https://wa.me/919661555733', label: 'WhatsApp the showroom' }
    },
    {
      id: 'installation', label: 'Installation', match: 'installation',
      empty: 'Adhesives, grouts, epoxy, waterproofing and finishing products are listed as photographed products in the Installation & Finishing section.',
      cta: { href: '#installation', label: 'Go to Installation & Finishing' }
    }
  ];

  return {
    tiles: TILES,
    filters: FILTERS,
    featured: 'tile-01',
    pageSize: 8
  };
})();
