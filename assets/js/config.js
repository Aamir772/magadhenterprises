/**
 * Magadh Enterprises — shared configuration.
 *
 * Single source of truth for the business contact details and the prefilled
 * WhatsApp message templates. Every value here is already present in the site
 * content; nothing has been invented.
 *
 * Exposed as a plain global (not a module) so the page keeps working when
 * opened directly from the filesystem, where fetch() of a local JSON file is
 * blocked by CORS.
 */
window.MAGADH_CONFIG = (function () {
  'use strict';

  var WHATSAPP_NUMBER = '919661555733';
  var WHATSAPP_BASE = 'https://wa.me/' + WHATSAPP_NUMBER;

  var MESSAGES = {
    general: 'Hello Magadh Enterprises, I would like to know more about your products.',
    visit: 'Hello Magadh Enterprises, I would like to visit your showroom on Nagmatiya Road, Gaya.',
    product: 'Hello Magadh Enterprises, I am interested in {product}. Please share more details.'
  };

  return {
    phone: {
      display: '+91 96615 55733',
      displayCompact: '+91 9661555733',
      tel: 'tel:+919661555733'
    },
    whatsapp: {
      base: WHATSAPP_BASE,
      messages: MESSAGES
    }
  };
})();