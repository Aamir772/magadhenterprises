/**
 * Product Catalogue — category filtering for products.html.
 * Renders the full 11-tab taxonomy; every tab count is computed from real
 * product records and zero-count showroom categories render honestly empty.
 */
(function () {
  'use strict';

  var products = window.MAGADH_PRODUCTS;
  if (!products) return;

  var grid = document.getElementById('product-grid');
  var filterBar = document.getElementById('product-filter-bar');
  var countEl = document.getElementById('catalogue-count');
  var emptyEl = document.getElementById('catalogue-empty');
  var titleEl = document.getElementById('catalogue-title');

  if (!grid || !filterBar) return;

  // Build flat product list from products.js
  var allProducts = [];
  products.forEach(function (group) {
    group.items.forEach(function (item) {
      allProducts.push({
        name: item.name,
        brand: group.sectionLabel || 'Magadh Enterprises',
        category: item.category,
        purpose: item.purpose,
        image: item.image,
        width: item.width,
        height: item.height,
        alt: item.alt,
        description: item.description,
        url: null
      });
    });
  });

  /* The full catalogue taxonomy, in display order. Every product record on
     file maps onto one of these slugs; a tab's count is always the number
     of records under that slug, so a count can never misstate inventory.
     Tabs with zero records stay visible with a count of 0 and an honest
     empty state — nothing is fabricated to fill them. */
  var categoryLabels = {
    'all': 'All Products',
    'tiles': 'Tiles',
    'marble': 'Marble',
    'granite': 'Granite',
    'sanitaryware': 'Sanitaryware',
    'adhesives': 'Tile Adhesives',
    'grouts-epoxy': 'Grouts & Epoxy',
    'primers-repair': 'Primers & Repair',
    'tile-care': 'Tile Care & Accessories',
    'waterproofing': 'Waterproofing',
    'tools-accessories': 'Tools & Accessories'
  };

  function labelFor(category) {
    if (categoryLabels[category]) return categoryLabels[category];
    return String(category || 'Products')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
  }

  // Count products per category
  var counts = { 'all': allProducts.length };
  allProducts.forEach(function (p) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  // Render filter buttons (full taxonomy, zero-count tabs included)
  var catOrder = ['tiles', 'marble', 'granite', 'sanitaryware', 'adhesives', 'grouts-epoxy', 'primers-repair', 'tile-care', 'waterproofing', 'tools-accessories'];
  var categories = ['all'].concat(catOrder);

  // Render filter buttons
  filterBar.innerHTML = '';
  categories.forEach(function (cat) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'product-filter-btn' + (cat === 'all' ? ' is-active' : '');
    btn.setAttribute('data-category', cat);
    btn.setAttribute('aria-pressed', cat === 'all' ? 'true' : 'false');
    btn.textContent = labelFor(cat) + ' (' + (counts[cat] || 0) + ')';
    filterBar.appendChild(btn);
  });

  // Render product card
  function createCard(product) {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);

    var imgWrap = document.createElement('div');
    imgWrap.className = 'product-card-img';
    var img = document.createElement('img');
    img.src = product.image;
    img.alt = product.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = product.width;
    img.height = product.height;
    imgWrap.appendChild(img);

    var body = document.createElement('div');
    body.className = 'product-card-body';

    var brandTag = document.createElement('p');
    brandTag.className = 'brand-tag';
    brandTag.textContent = product.brand;
    body.appendChild(brandTag);

    var purposeTag = document.createElement('p');
    purposeTag.className = 'purpose-tag';
    purposeTag.textContent = product.purpose || product.category;
    body.appendChild(purposeTag);

    var name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = product.name;
    body.appendChild(name);

    var desc = document.createElement('p');
    desc.className = 'product-desc';
    desc.textContent = product.description;
    body.appendChild(desc);

    var cta = document.createElement('a');
    cta.href = 'tel:+919661555733';
    cta.className = 'product-cta';
    cta.setAttribute('data-wa', 'product');
    cta.setAttribute('data-product', product.name);
    cta.setAttribute('aria-label', 'Enquire about ' + product.name + ' on WhatsApp');
    cta.textContent = 'Enquire';
    body.appendChild(cta);

    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
  }

  // Render all products
  function renderProducts(category) {
    grid.innerHTML = '';
    var filtered = category === 'all'
      ? allProducts
      : allProducts.filter(function (p) { return p.category === category; });

    filtered.forEach(function (product) {
      grid.appendChild(createCard(product));
    });

    // Update count
    var label = labelFor(category);
    countEl.textContent = label + ' (' + filtered.length + ' of ' + allProducts.length + ')';
    titleEl.textContent = label;

    // Show/hide empty state (honest copy for categories with no records)
    var emptyCopy = document.querySelector('#catalogue-empty p');
    if (filtered.length === 0) {
      if (emptyCopy) {
        emptyCopy.textContent = (category !== 'all' && !counts[category])
          ? 'No individual products are listed in this category yet — the showroom team at Nagmatiya Road, Gaya will gladly guide you. Call or WhatsApp +91 96615 55733.'
          : 'No products found in this category.';
      }
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
    }

    // Update button states
    var btns = filterBar.querySelectorAll('.product-filter-btn');
    btns.forEach(function (btn) {
      var isActive = btn.getAttribute('data-category') === category;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Filter button click handler
  filterBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.product-filter-btn');
    if (!btn) return;
    var cat = btn.getAttribute('data-category');
    renderProducts(cat);
  });

  // Keyboard support
  filterBar.addEventListener('keydown', function (e) {
    var btns = Array.prototype.slice.call(filterBar.querySelectorAll('.product-filter-btn'));
    var current = btns.findIndex(function (b) { return b.classList.contains('is-active'); });
    var next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next = (current + 1) % btns.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      next = (current - 1 + btns.length) % btns.length;
    }
    if (next >= 0) {
      btns[next].focus();
      renderProducts(btns[next].getAttribute('data-category'));
    }
  });

  // Initial render
  renderProducts('all');
})();
