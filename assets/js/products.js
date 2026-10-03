/**
 * Product catalogue, single source of truth.
 *
 * The rendered HTML in index.html is what search engines and no-JS visitors see,
 * so it stays static and crawlable. This module exists so the repeated product
 * fields (brand tag, name, description, image) live in one editable place
 * instead of being copy-pasted, and so a build step or future CMS integration
 * has something structured to read.
 *
 * IMPORTANT: every value below is copied verbatim from the original baseline
 * site. No specifications, prices or claims have been added. If you edit a
 * product here, mirror the change in index.html (or add a generator).
 */
window.MAGADH_PRODUCTS = (function () {
  'use strict';

  return [
    {
      section: 'installation',
      sectionLabel: 'MYK Laticrete',
      sectionHeading: 'Installation solutions.',
      items: [
        {
          name: 'Latafix 305',
            purpose: 'Tile Adhesives',
          image: 'assets/images/laticrete/latafix-305.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Laticrete Latafix 305 Floor and Wall Tile Adhesive',
          description: 'Floor & wall tile adhesive. Single-component, economical, strong bond. For ceramic tiles and small-format natural stone.'
        },
        {
          name: 'Laticrete 303',
            purpose: 'Tile Adhesives',
          image: 'assets/images/laticrete/laticrete-303.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Laticrete 303 Floor and Wall Tile Adhesive',
          description: 'Floor & wall tile adhesive. Polymer-based, single-component. For ceramic tiles and small-format stone on dry interior surfaces.'
        },
        {
          name: '315 Plus & 325 High Flex',
            purpose: 'Tile Adhesives',
          image: 'assets/images/laticrete/315-plus-325-high-flex.jpg',
          width: 900,
          height: 600,
          alt: 'MYK Laticrete 315 Plus and 325 High Flex Tile Adhesive',
          description: 'Premium adhesives for ceramic and large-format tiles. 325 High Flex offers extra flexibility for demanding areas and large stone.'
        },
        {
          name: 'Super Set',
            purpose: 'Tile Adhesives',
          image: 'assets/images/laticrete/super-set.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Super Set cement slurry additive',
          description: 'Cement slurry additive. Enhances bond strength and performance of cement slurry for tile and stone fixing.'
        },
        {
          name: 'Latapoxy',
            purpose: 'Grouts & Epoxy',
          image: 'assets/images/laticrete/latapoxy.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Latapoxy All Purpose Epoxy Adhesive',
          description: 'All purpose epoxy adhesive. Bonds tile, stone, metal, wood, glass and concrete. Xtra strong bond, solvent free.'
        },
        {
          name: 'Dazzle',
            purpose: 'Grouts & Epoxy',
          image: 'assets/images/laticrete/dazzle.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Dazzle Latapoxy Decorative Glitter Grout',
          description: 'Decorative glitter epoxy grout with metallic and glitter effects. Stain, water and chemical resistant. Available in multiple shades.'
        },
        {
          name: 'SP-100 Duo',
            purpose: 'Grouts & Epoxy',
          image: 'assets/images/laticrete/sp-100-duo.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete SP-100 Duo Stainfree Epoxy Grout',
          description: 'Stainfree epoxy grout for floor & wall. Stain, germ, water and UV resistant. Food grade. Ideal for bathrooms, kitchens and pools.'
        },
        {
          name: 'Grout Admix Plus 1776',
            purpose: 'Grouts & Epoxy',
          image: 'assets/images/laticrete/grout-admix-plus-1776.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Grout Admix Plus 1776 grout additive',
          description: 'Polymer-based grout additive. Improves colour fastness, flexibility, compressive strength and reduces water absorption.'
        },
        {
          name: 'Clenza TC',
            purpose: 'Tile Care',
          image: 'assets/images/laticrete/clenza-tc.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Clenza TC Advanced Tile Cleaner',
          description: 'Advanced tile cleaner. Heavy duty, quick action formula for removing tough stains and dirt from all tile surfaces.'
        },
        {
          name: 'Tile Spacers',
            purpose: 'Tools & Accessories',
          image: 'assets/images/laticrete/tile-spacers.jpg',
          width: 755,
          height: 900,
          alt: 'MYK Laticrete Tile Joint Spacers 3mm',
          description: 'Tile joint spacers for uniform 3mm spacing. Ensures consistent, professional joints on floor and wall tiles.'
        },
        {
          name: 'Tile Leveling Clips',
            purpose: 'Tools & Accessories',
          image: 'assets/images/laticrete/tile-leveling-clips.jpg',
          width: 600,
          height: 900,
          alt: 'MYK Laticrete Tile Leveling Clips and Wedges',
          description: 'Tile leveling clips and wedges for a flat, lippage-free finish. For ceramic, vitrified, porcelain, marble and granite tiles.'
        }
      ]
    },
    {
      section: 'arment',
      sectionLabel: 'MYK Arment',
      sectionHeading: 'Waterproofing & construction solutions.',
      items: [
        {
          name: 'AquaArm SuperFlex',
            purpose: 'Waterproofing',
          image: 'assets/images/arment/aquaarm-superflex.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm SuperFlex flexible waterproof coating',
          description: 'Flexible crack bridging waterproof coating. High elongation. Ideal for water tanks, terraces and retaining walls.'
        },
        {
          name: 'AquaArm Proof WP-10',
            purpose: 'Waterproofing',
          image: 'assets/images/arment/aquaarm-proof-wp10.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm Proof WP-10 integral waterproofing liquid',
          description: 'Integral waterproofing liquid. Chloride free, reduces permeability and shrinkage cracks. For roof slabs, water tanks and plasters.'
        },
        {
          name: 'AquaArm ExTeCoat',
            purpose: 'Waterproofing',
          image: 'assets/images/arment/aquaarm-extecoat.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm ExTeCoat exterior waterproof coating',
          description: 'High build waterproof acrylate coating for exterior walls. Weather resistant, anti-algal, covers hairline cracks.'
        },
        {
          name: 'AquaArm Sani Guard Primer',
            purpose: 'Primers & Bonding Agents',
          image: 'assets/images/arment/aquaarm-sani-guard-primer.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment AquaArm Sani Guard Primer antifungal primer',
          description: 'Antifungal primer for healthy and durable surfaces. Prevents fungal growth, improves adhesion for paints and coatings.'
        },
        {
          name: 'ReArm KrackFill Paste',
            purpose: 'Crack Repair',
          image: 'assets/images/arment/rearm-krackfill-paste.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment ReArm KrackFill Paste crack filler',
          description: 'Ready to use crack fill paste for internal and external plaster surfaces. Flexible, eco-friendly, excellent adhesion.'
        },
        {
          name: 'ReArm Super Bond',
            purpose: 'Primers & Bonding Agents',
          image: 'assets/images/arment/rearm-super-bond.jpg',
          width: 900,
          height: 900,
          alt: 'MYK Arment ReArm Super Bond epoxy concrete bonding agent',
          description: 'Epoxy resin based concrete bonding agent. High bond strength, excellent adhesion. For building elements, columns and repairs.'
        },
        {
          name: 'Armix Durafast ACL',
            purpose: 'Primers & Bonding Agents',
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