/**
 * Magadh Enterprises — advertising slots (Google AdSense-ready).
 *
 * This file is the ONLY place AdSense configuration lives. The publisher ID is
 * now set and Auto ads are enabled below. Manual ad units stay inert until real
 * numeric ids are added to CONFIG.slots; every .ad-slot stays collapsed until
 * then, so visitors never see a blank ad box.
 *
 * CONFIGURED:
 *   - publisherId : the account's ca-pub id (Auto ads use this directly).
 *   - autoAds     : true — Google's script alone enables Auto ads; the
 *                   deprecated (adsbygoogle).push({enable_page_level_ads:true})
 *                   call is NOT required with the current "?client=" snippet.
 *   - slots       : still empty. Add each manual unit's numeric data-ad-slot id
 *                   here when the AdSense dashboard supplies real ones.
 *
 * SETUP (only AFTER Google has approved the site):
 *   1. CONFIG.publisherId holds the AdSense for Content id:
 *      "ca-pub-" followed by exactly 16 digits. Never guess this value.
 *   2. In the AdSense dashboard create each ad unit and copy its numeric
 *      data-ad-slot id into the matching key under CONFIG.slots.
 *   3. Add the exact ads.txt record AdSense shows you (see /ads.txt).
 *
 * Google requirements honoured here:
 *   - Only one AdSense script per page (id="adsbygoogle-js", plus a scan for an
 *     existing adsbygoogle.js tag so a manually pasted tag is never duplicated).
 *   - "ca-pub-" + 16 digits and numeric ad-unit ids are validated, so an
 *     incomplete/incorrect configuration can neither load the script nor
 *     activate a slot.
 *   - An ad unit is never requested while hidden: the slot is made visible
 *     before its adsbygoogle.push() call; only genuinely empty states stay
 *     collapsed.
 */
(function () {
  'use strict';

  /* ==========================================================================
     ▼▼▼  ADSENSE CONFIGURATION  ▼▼▼
     The real publisher ID is set and Auto ads are enabled. Manual unit ids can
     be added under CONFIG.slots later; until then those .ad-slots stay hidden.
     ========================================================================== */
  var CONFIG = {
    /* AdSense for Content publisher ID: "ca-pub-" + exactly 16 digits. */
    publisherId: 'ca-pub-2608310326412608',
    /* Auto ads are enabled: the script alone serves them (account-side setup). */
    autoAds: true,
    /* Paste each ad unit's numeric data-ad-slot id beside its matching slot.
       These keys line up with data-ad-slot-name in the HTML:
         homeBanner -> index.html (banner below Products)
         homeLower  -> index.html (banner above Contact)
         content    -> future content pages (template lives in index.html)
       An empty or non-numeric value leaves that slot collapsed and untouched. */
    slots: {
      homeBanner: '',
      homeLower: '',
      content: ''
    }
  };

  /* AdSense for Content publisher id: ca-pub- followed by 16 digits. */
  var PUBLISHER_RE = /^ca-pub-\d{16}$/;
  /* Ad unit ids (data-ad-slot) are numeric. */
  var SLOT_RE = /^\d+$/;

  function isValidPublisherId(id) {
    return typeof id === 'string' && PUBLISHER_RE.test(id);
  }

  function isValidSlotId(id) {
    return typeof id === 'string' && SLOT_RE.test(id);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function anyConfiguredSlot() {
    return Object.keys(CONFIG.slots).some(function (key) {
      return isValidSlotId(CONFIG.slots[key]);
    });
  }

  /* The script is only worth requesting when there is something valid to serve:
     a valid publisher id AND either Auto ads or at least one real unit id. */
  function shouldLoadAds() {
    return isValidPublisherId(CONFIG.publisherId) &&
      (CONFIG.autoAds === true || anyConfiguredSlot());
  }

  /* Google supports only one AdSense head tag per page, so never inject a
     second one (e.g. if the owner has already pasted their own tag). */
  function adsenseScriptPresent() {
    return !!document.getElementById('adsbygoogle-js') ||
      !!document.querySelector('script[src*="adsbygoogle.js"]');
  }

  /* Injects Google's loader at most once. Returns false when advertising is not
     validly configured, so callers can bail out early. */
  function loadAdSenseScript() {
    if (!isValidPublisherId(CONFIG.publisherId)) return false;
    if (adsenseScriptPresent()) return true;

    var script = document.createElement('script');
    script.id = 'adsbygoogle-js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='
      + encodeURIComponent(CONFIG.publisherId);
    document.head.appendChild(script);
    return true;
  }

  /* Builds the ad unit inside a slot, but only when that slot has a valid id. */
  function activateSlot(slot) {
    var name = slot.getAttribute('data-ad-slot-name');
    var slotId = name ? CONFIG.slots[name] : '';
    if (!isValidSlotId(slotId)) return;

    var inner = document.createElement('div');
    inner.className = 'ad-slot__inner';

    var label = document.createElement('span');
    label.className = 'ad-slot__label';
    label.textContent = 'Advertisement';
    inner.appendChild(label);

    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', CONFIG.publisherId);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    inner.appendChild(ins);

    slot.appendChild(inner);

    /* Make the slot visible BEFORE the ad request, so the unit is never loaded
       while hidden (Google may skip requests for hidden units). */
    slot.classList.add('is-active');
    slot.removeAttribute('aria-hidden');

    (window.adsbygoogle = window.adsbygoogle || []).push({});

    /* If AdSense reports "unfilled" (no ad returned), collapse the whole slot
       so it never leaves a blank band. Only the exact "unfilled" value is
       acted on, so "filled" and "unfill-optimized" units are left visible. */
    function collapseIfUnfilled() {
      if (ins.getAttribute('data-ad-status') === 'unfilled') {
        slot.classList.remove('is-active');
        slot.setAttribute('aria-hidden', 'true');
        return true;
      }
      return false;
    }

    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        if (collapseIfUnfilled()) observer.disconnect();
      });
      observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
      /* In case AdSense already resolved the status before the observer attached. */
      if (collapseIfUnfilled()) observer.disconnect();
    }
  }

  ready(function () {
    /* Load the AdSense script whenever advertising is validly configured —
       Auto ads serve themselves and need the script on every page even when
       that page has no manual .ad-slot container. */
    if (!shouldLoadAds()) return;
    if (!loadAdSenseScript()) return;

    /* Manual units are optional and independent: activate whichever marked
       slots exist on this page (an empty/non-numeric id keeps one collapsed). */
    var slots = Array.prototype.slice.call(
      document.querySelectorAll('.ad-slot[data-ad-slot-name]')
    );
    slots.forEach(activateSlot);
  });
})();
