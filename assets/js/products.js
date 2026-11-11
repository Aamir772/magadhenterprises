/**
 * Product catalogue, single source of truth.
 *
 * The rendered HTML on the catalogue pages is what search engines and no-JS
 * visitors see, so it stays static and crawlable. This module exists so the
 * repeated product fields (brand tag, name, description, image) live in one
 * editable place instead of being copy-pasted, and so a build step or future
 * CMS integration has something structured to read.
 *
 * IMPORTANT: every value below is copied verbatim from the original baseline
 * site. No specifications, prices or claims have been added. If you edit a
 * product here, mirror the change on its catalogue page (or add a generator).
 *
 * CATEGORIES
 * ----------
 * `category` is the slug the catalogue filters on and must match the
 * `data-category` attribute on the matching .product-card. It is derived
 * from `purpose`, which is the business's own classification:
 *
 *   Tiles ..................... tiles
 *   Marble .................... marble (no product records on file)
 *   Granite ................... granite (no product records on file)
 *   Sanitaryware .............. sanitaryware (no product records on file)
 *   Tile Adhesives ............ adhesives
 *   Grouts & Epoxy ............ grouts-epoxy
 *   Waterproofing ............. waterproofing
 *   Tile Care ................. tile-care
 *   Tools & Accessories ....... tools-accessories
 *   Primers & Bonding Agents .. primers-repair
 *   Crack Repair .............. primers-repair
 *
 * Marble, granite and sanitaryware are showroom categories (see the category
 * blocks on products.html) with no product records on file, so the catalogue
 * renders their tabs with a count of 0 and no inventory is fabricated for them.
 *
 * TILES
 * -----
 * The tiles collect has NOT had brand, size, finish or model metadata verified
 * (see assets/js/tile-data.js), so tile products carry neutral "Tile Design NN"
 * names and no specification fields. Tile photography is shared with the Tile
 * Visualizer. Crystal Ceramics, Exxaro and Vura are tile BRANDS, not products —
 * they live in the Brands sections (tiles.html / brand showcases), not here.
 */
window.MAGADH_PRODUCTS = (function () {
  'use strict';

  return [
    {
      section: 'tiles',
      sectionLabel: 'Magadh Enterprises',
      sectionHeading: 'Tiles.',
      items: [
        {
          name: 'Tile Design 01',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-01-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 01 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 02',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-02-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 02 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 03',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-03-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 03 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 04',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-04-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 04 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 05',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-05-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 05 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 06',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-06-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 06 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 07',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-07-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 07 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 08',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-08-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 08 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 09',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-09-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 09 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 10',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-10-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 10 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 11',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-11-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 11 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 12',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-12-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 12 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 13',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-13-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 13 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 14',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-14-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 14 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 15',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-15-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 15 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 16',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-16-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 16 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 17',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-17-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 17 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 18',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-18-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 18 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 19',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-19-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 19 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        },
        {
          name: 'Tile Design 20',
          purpose: 'Tiles',
          category: 'tiles',
          image: 'assets/images/tiles/collection/tile-20-480.webp',
          width: 480,
          height: 720,
          alt: 'Tile Design 20 from the Magadh Enterprises tile range, Gaya',
          description: 'Showroom tile from the Magadh Enterprises range, Gaya. Field sizes, finishes and applications are not yet verified for online listing - ask our team at the showroom.'
        }
      ]
    },
    {
      section: 'tile-adhesives',
      sectionLabel: 'MYK Laticrete',
      sectionHeading: 'Tile adhesives.',
      items: [
        {
          name: 'Latafix 305',
            purpose: 'Tile Adhesives',
            category: 'adhesives',
          image: 'assets/images/laticrete/latafix-305.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Laticrete Latafix 305 Floor and Wall Tile Adhesive',
          description: 'Floor & wall tile adhesive. Single-component, economical, strong bond. For ceramic tiles and small-format natural stone.'
        },
        {
          name: 'Laticrete 303',
            purpose: 'Tile Adhesives',
            category: 'adhesives',
          image: 'assets/images/laticrete/laticrete-303.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Laticrete 303 Floor and Wall Tile Adhesive',
          description: 'Floor & wall tile adhesive. Polymer-based, single-component. For ceramic tiles and small-format stone on dry interior surfaces.'
        },
        {
          name: '315 Plus & 325 High Flex',
            purpose: 'Tile Adhesives',
            category: 'adhesives',
          image: 'assets/images/laticrete/315-plus-325-high-flex.jpg',
          width: 900,
          height: 600,
          alt: 'MYK Laticrete 315 Plus and 325 High Flex Tile Adhesive',
          description: 'Premium adhesives for ceramic and large-format tiles. 325 High Flex offers extra flexibility for demanding areas and large stone.'
        },
        {
          name: 'Super Set',
            purpose: 'Tile Adhesives',
            category: 'adhesives',
          image: 'assets/images/laticrete/super-set.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Super Set cement slurry additive',
          description: 'Cement slurry additive. Enhances bond strength and performance of cement slurry for tile and stone fixing.'
        }
      ]
    },
    {
      section: 'grouts-epoxy',
      sectionLabel: 'MYK Laticrete',
      sectionHeading: 'Grouts & epoxy.',
      items: [
        {
          name: 'Latapoxy',
            purpose: 'Grouts & Epoxy',
            category: 'grouts-epoxy',
          image: 'assets/images/laticrete/latapoxy.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Latapoxy All Purpose Epoxy Adhesive',
          description: 'All purpose epoxy adhesive. Bonds tile, stone, metal, wood, glass and concrete. Xtra strong bond, solvent free.'
        },
        {
          name: 'Dazzle',
            purpose: 'Grouts & Epoxy',
            category: 'grouts-epoxy',
          image: 'assets/images/laticrete/dazzle.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Dazzle Latapoxy Decorative Glitter Grout',
          description: 'Decorative glitter epoxy grout with metallic and glitter effects. Stain, water and chemical resistant. Available in multiple shades.'
        },
        {
          name: 'SP-100 Duo',
            purpose: 'Grouts & Epoxy',
            category: 'grouts-epoxy',
          image: 'assets/images/laticrete/sp-100-duo.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete SP-100 Duo Stainfree Epoxy Grout',
          description: 'Stainfree epoxy grout for floor & wall. Stain, germ, water and UV resistant. Food grade. Ideal for bathrooms, kitchens and pools.'
        },
        {
          name: 'Grout Admix Plus 1776',
            purpose: 'Grouts & Epoxy',
            category: 'grouts-epoxy',
          image: 'assets/images/laticrete/grout-admix-plus-1776.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Grout Admix Plus 1776 grout additive',
          description: 'Polymer-based grout additive. Improves colour fastness, flexibility, compressive strength and reduces water absorption.'
        }
      ]
    },
    {
      section: 'tile-care',
      sectionLabel: 'MYK Laticrete',
      sectionHeading: 'Tile care & accessories.',
      items: [
        {
          name: 'Clenza TC',
            purpose: 'Tile Care',
            category: 'tile-care',
          image: 'assets/images/laticrete/clenza-tc.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Clenza TC Advanced Tile Cleaner',
          description: 'Advanced tile cleaner. Heavy duty, quick action formula for removing tough stains and dirt from all tile surfaces.'
        },
        {
          name: 'Tile Spacers',
            purpose: 'Tools & Accessories',
            category: 'tools-accessories',
          image: 'assets/images/laticrete/tile-spacers.jpg',
          width: 755,
          height: 900,
          alt: 'MYK Laticrete Tile Joint Spacers 3mm',
          description: 'Tile joint spacers for uniform 3mm spacing. Ensures consistent, professional joints on floor and wall tiles.'
        },
        {
          name: 'Tile Leveling Clips',
            purpose: 'Tools & Accessories',
            category: 'tools-accessories',
          image: 'assets/images/laticrete/tile-leveling-clips.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Tile Leveling Clips and Wedges',
          description: 'Tile leveling clips and wedges for a flat, lippage-free finish. For ceramic, vitrified, porcelain, marble and granite tiles.'
        }
      ]
    },
    {
      section: 'waterproofing',
      sectionLabel: 'MYK Arment',
      sectionHeading: 'Waterproofing solutions.',
      items: [
        {
          name: 'AquaArm SuperFlex',
            purpose: 'Waterproofing',
            category: 'waterproofing',
          image: 'assets/images/arment/aquaarm-superflex.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm SuperFlex flexible waterproof coating',
          description: 'Flexible crack bridging waterproof coating. High elongation. Ideal for water tanks, terraces and retaining walls.'
        },
        {
          name: 'AquaArm Proof WP-10',
            purpose: 'Waterproofing',
            category: 'waterproofing',
          image: 'assets/images/arment/aquaarm-proof-wp10.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm Proof WP-10 integral waterproofing liquid',
          description: 'Integral waterproofing liquid. Chloride free, reduces permeability and shrinkage cracks. For roof slabs, water tanks and plasters.'
        },
        {
          name: 'AquaArm ExTeCoat',
            purpose: 'Waterproofing',
            category: 'waterproofing',
          image: 'assets/images/arment/aquaarm-extecoat.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm ExTeCoat exterior waterproof coating',
          description: 'High build waterproof acrylate coating for exterior walls. Weather resistant, anti-algal, covers hairline cracks.'
        },
        {
          name: 'AquaArm Sani Guard Primer',
            purpose: 'Primers & Bonding Agents',
            category: 'primers-repair',
          image: 'assets/images/arment/aquaarm-sani-guard-primer.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm Sani Guard Primer antifungal primer',
          description: 'Antifungal primer for healthy and durable surfaces. Prevents fungal growth, improves adhesion for paints and coatings.'
        },
        {
          name: 'ReArm KrackFill Paste',
            purpose: 'Crack Repair',
            category: 'primers-repair',
          image: 'assets/images/arment/rearm-krackfill-paste.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment ReArm KrackFill Paste crack filler',
          description: 'Ready to use crack fill paste for internal and external plaster surfaces. Flexible, eco-friendly, excellent adhesion.'
        },
        {
          name: 'ReArm Super Bond',
            purpose: 'Primers & Bonding Agents',
            category: 'primers-repair',
          image: 'assets/images/arment/rearm-super-bond.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment ReArm Super Bond epoxy concrete bonding agent',
          description: 'Epoxy resin based concrete bonding agent. High bond strength, excellent adhesion. For building elements, columns and repairs.'
        },
        {
          name: 'Armix Durafast ACL',
            purpose: 'Primers & Bonding Agents',
            category: 'primers-repair',
          image: 'assets/images/arment/armix-durafast-acl.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment Armix Durafast ACL acrylic liquid for concrete',
          description: 'Acrylic liquid for concrete and mortar. Improves bond strength, enhances durability and reduces shrinkage cracks.'
        }
      ]
    }
  ];
})();

/**
 * The "Explore Products" category tabs, in display order.
 *
 * `count` is derived from the catalogue above rather than typed by hand, so a
 * tab can never advertise a number the grid does not hold. Tab bars are
 * static markup on the catalogue pages (crawlable, and visible without
 * scripting); this list documents the taxonomy filters read from the DOM.
 *
 * Marble, granite and sanitaryware have no product records on file, so their
 * tabs render with a count of 0 and their grid state offers an honest
 * "ask our team" message — no inventory is fabricated for them.
 */
window.MAGADH_PRODUCT_CATEGORIES = (function () {
  'use strict';

  var ORDER = [
    { id: 'all', label: 'All Products' },
    { id: 'tiles', label: 'Tiles' },
    { id: 'marble', label: 'Marble' },
    { id: 'granite', label: 'Granite' },
    { id: 'sanitaryware', label: 'Sanitaryware' },
    { id: 'adhesives', label: 'Tile Adhesives' },
    { id: 'grouts-epoxy', label: 'Grouts & Epoxy' },
    { id: 'primers-repair', label: 'Primers & Repair' },
    { id: 'tile-care', label: 'Tile Care & Accessories' },
    { id: 'waterproofing', label: 'Waterproofing' },
    { id: 'tools-accessories', label: 'Tools & Accessories' }
  ];

  var counts = {};
  var total = 0;

  (window.MAGADH_PRODUCTS || []).forEach(function (group) {
    group.items.forEach(function (item) {
      if (!item.category) return;
      counts[item.category] = (counts[item.category] || 0) + 1;
      total += 1;
    });
  });

  return ORDER.map(function (cat) {
    return {
      id: cat.id,
      label: cat.label,
      count: cat.id === 'all' ? total : (counts[cat.id] || 0)
    };
  });
})();