window.slate = window.slate || {};
window.theme = window.theme || {};  

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/* removed to avoid conflicts with default behavior
 slate/variants.js
*/
/*================ Sections ================*/
/* removed to avoid conflicts with default behavior
 sections/product.js
*/
/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


/*================ Lo & Sons ================*/
/*! Picturefill - v2.3.1 - 2015-04-09
* http://scottjehl.github.io/picturefill
* Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
window.matchMedia||(window.matchMedia=function(){"use strict";var a=window.styleMedia||window.media;if(!a){var b=document.createElement("style"),c=document.getElementsByTagName("script")[0],d=null;b.type="text/css",b.id="matchmediajs-test",c.parentNode.insertBefore(b,c),d="getComputedStyle"in window&&window.getComputedStyle(b,null)||b.currentStyle,a={matchMedium:function(a){var c="@media "+a+"{ #matchmediajs-test { width: 1px; } }";return b.styleSheet?b.styleSheet.cssText=c:b.textContent=c,"1px"===d.width}}}return function(b){return{matches:a.matchMedium(b||"all"),media:b||"all"}}}()),function(a,b,c){"use strict";function d(b){"object"==typeof module&&"object"==typeof module.exports?module.exports=b:"function"==typeof define&&define.amd&&define("picturefill",function(){return b}),"object"==typeof a&&(a.picturefill=b)}function e(a){var b,c,d,e,f,i=a||{};b=i.elements||g.getAllElements();for(var j=0,k=b.length;k>j;j++)if(c=b[j],d=c.parentNode,e=void 0,f=void 0,"IMG"===c.nodeName.toUpperCase()&&(c[g.ns]||(c[g.ns]={}),i.reevaluate||!c[g.ns].evaluated)){if(d&&"PICTURE"===d.nodeName.toUpperCase()){if(g.removeVideoShim(d),e=g.getMatch(c,d),e===!1)continue}else e=void 0;(d&&"PICTURE"===d.nodeName.toUpperCase()||!g.sizesSupported&&c.srcset&&h.test(c.srcset))&&g.dodgeSrcset(c),e?(f=g.processSourceSet(e),g.applyBestCandidate(f,c)):(f=g.processSourceSet(c),(void 0===c.srcset||c[g.ns].srcset)&&g.applyBestCandidate(f,c)),c[g.ns].evaluated=!0}}function f(){function c(){clearTimeout(d),d=setTimeout(h,60)}g.initTypeDetects(),e();var d,f=setInterval(function(){return e(),/^loaded|^i|^c/.test(b.readyState)?void clearInterval(f):void 0},250),h=function(){e({reevaluate:!0})};a.addEventListener?a.addEventListener("resize",c,!1):a.attachEvent&&a.attachEvent("onresize",c)}if(a.HTMLPictureElement)return void d(function(){});b.createElement("picture");var g=a.picturefill||{},h=/\s+\+?\d+(e\d+)?w/;g.ns="picturefill",function(){g.srcsetSupported="srcset"in c,g.sizesSupported="sizes"in c,g.curSrcSupported="currentSrc"in c}(),g.trim=function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},g.makeUrl=function(){var a=b.createElement("a");return function(b){return a.href=b,a.href}}(),g.restrictsMixedContent=function(){return"https:"===a.location.protocol},g.matchesMedia=function(b){return a.matchMedia&&a.matchMedia(b).matches},g.getDpr=function(){return a.devicePixelRatio||1},g.getWidthFromLength=function(a){var c;if(!a||a.indexOf("%")>-1!=!1||!(parseFloat(a)>0||a.indexOf("calc(")>-1))return!1;a=a.replace("vw","%"),g.lengthEl||(g.lengthEl=b.createElement("div"),g.lengthEl.style.cssText="border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden",g.lengthEl.className="helper-from-picturefill-js"),g.lengthEl.style.width="0px";try{g.lengthEl.style.width=a}catch(d){}return b.body.appendChild(g.lengthEl),c=g.lengthEl.offsetWidth,0>=c&&(c=!1),b.body.removeChild(g.lengthEl),c},g.detectTypeSupport=function(b,c){var d=new a.Image;return d.onerror=function(){g.types[b]=!1,e()},d.onload=function(){g.types[b]=1===d.width,e()},d.src=c,"pending"},g.types=g.types||{},g.initTypeDetects=function(){g.types["image/jpeg"]=!0,g.types["image/gif"]=!0,g.types["image/png"]=!0,g.types["image/svg+xml"]=b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"),g.types["image/webp"]=g.detectTypeSupport("image/webp","data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=")},g.verifyTypeSupport=function(a){var b=a.getAttribute("type");if(null===b||""===b)return!0;var c=g.types[b];return"string"==typeof c&&"pending"!==c?(g.types[b]=g.detectTypeSupport(b,c),"pending"):"function"==typeof c?(c(),"pending"):c},g.parseSize=function(a){var b=/(\([^)]+\))?\s*(.+)/g.exec(a);return{media:b&&b[1],length:b&&b[2]}},g.findWidthFromSourceSize=function(c){for(var d,e=g.trim(c).split(/\s*,\s*/),f=0,h=e.length;h>f;f++){var i=e[f],j=g.parseSize(i),k=j.length,l=j.media;if(k&&(!l||g.matchesMedia(l))&&(d=g.getWidthFromLength(k)))break}return d||Math.max(a.innerWidth||0,b.documentElement.clientWidth)},g.parseSrcset=function(a){for(var b=[];""!==a;){a=a.replace(/^\s+/g,"");var c,d=a.search(/\s/g),e=null;if(-1!==d){c=a.slice(0,d);var f=c.slice(-1);if((","===f||""===c)&&(c=c.replace(/,+$/,""),e=""),a=a.slice(d+1),null===e){var g=a.indexOf(",");-1!==g?(e=a.slice(0,g),a=a.slice(g+1)):(e=a,a="")}}else c=a,a="";(c||e)&&b.push({url:c,descriptor:e})}return b},g.parseDescriptor=function(a,b){var c,d=b||"100vw",e=a&&a.replace(/(^\s+|\s+$)/g,""),f=g.findWidthFromSourceSize(d);if(e)for(var h=e.split(" "),i=h.length-1;i>=0;i--){var j=h[i],k=j&&j.slice(j.length-1);if("h"!==k&&"w"!==k||g.sizesSupported){if("x"===k){var l=j&&parseFloat(j,10);c=l&&!isNaN(l)?l:1}}else c=parseFloat(parseInt(j,10)/f)}return c||1},g.getCandidatesFromSourceSet=function(a,b){for(var c=g.parseSrcset(a),d=[],e=0,f=c.length;f>e;e++){var h=c[e];d.push({url:h.url,resolution:g.parseDescriptor(h.descriptor,b)})}return d},g.dodgeSrcset=function(a){a.srcset&&(a[g.ns].srcset=a.srcset,a.srcset="",a.setAttribute("data-pfsrcset",a[g.ns].srcset))},g.processSourceSet=function(a){var b=a.getAttribute("srcset"),c=a.getAttribute("sizes"),d=[];return"IMG"===a.nodeName.toUpperCase()&&a[g.ns]&&a[g.ns].srcset&&(b=a[g.ns].srcset),b&&(d=g.getCandidatesFromSourceSet(b,c)),d},g.backfaceVisibilityFix=function(a){var b=a.style||{},c="webkitBackfaceVisibility"in b,d=b.zoom;c&&(b.zoom=".999",c=a.offsetWidth,b.zoom=d)},g.setIntrinsicSize=function(){var c={},d=function(a,b,c){b&&a.setAttribute("width",parseInt(b/c,10))};return function(e,f){var h;e[g.ns]&&!a.pfStopIntrinsicSize&&(void 0===e[g.ns].dims&&(e[g.ns].dims=e.getAttribute("width")||e.getAttribute("height")),e[g.ns].dims||(f.url in c?d(e,c[f.url],f.resolution):(h=b.createElement("img"),h.onload=function(){if(c[f.url]=h.width,!c[f.url])try{b.body.appendChild(h),c[f.url]=h.width||h.offsetWidth,b.body.removeChild(h)}catch(a){}e.src===f.url&&d(e,c[f.url],f.resolution),e=null,h.onload=null,h=null},h.src=f.url)))}}(),g.applyBestCandidate=function(a,b){var c,d,e;a.sort(g.ascendingSort),d=a.length,e=a[d-1];for(var f=0;d>f;f++)if(c=a[f],c.resolution>=g.getDpr()){e=c;break}e&&(e.url=g.makeUrl(e.url),b.src!==e.url&&(g.restrictsMixedContent()&&"http:"===e.url.substr(0,"http:".length).toLowerCase()?void 0!==window.console&&console.warn("Blocked mixed content image "+e.url):(b.src=e.url,g.curSrcSupported||(b.currentSrc=b.src),g.backfaceVisibilityFix(b))),g.setIntrinsicSize(b,e))},g.ascendingSort=function(a,b){return a.resolution-b.resolution},g.removeVideoShim=function(a){var b=a.getElementsByTagName("video");if(b.length){for(var c=b[0],d=c.getElementsByTagName("source");d.length;)a.insertBefore(d[0],c);c.parentNode.removeChild(c)}},g.getAllElements=function(){for(var a=[],c=b.getElementsByTagName("img"),d=0,e=c.length;e>d;d++){var f=c[d];("PICTURE"===f.parentNode.nodeName.toUpperCase()||null!==f.getAttribute("srcset")||f[g.ns]&&null!==f[g.ns].srcset)&&a.push(f)}return a},g.getMatch=function(a,b){for(var c,d=b.childNodes,e=0,f=d.length;f>e;e++){var h=d[e];if(1===h.nodeType){if(h===a)return c;if("SOURCE"===h.nodeName.toUpperCase()){null!==h.getAttribute("src")&&void 0!==typeof console&&console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");var i=h.getAttribute("media");if(h.getAttribute("srcset")&&(!i||g.matchesMedia(i))){var j=g.verifyTypeSupport(h);if(j===!0){c=h;break}if("pending"===j)return!1}}}}return c},f(),e._=g,d(e)}(window,window.document,new window.Image);
+function(t){"use strict";var e=function(i,o){this.options=t.extend({},e.DEFAULTS,o),this.$window=t(window).on("scroll.bs.affix.data-api",t.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",t.proxy(this.checkPositionWithEventLoop,this)),this.$element=t(i),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};e.RESET="affix affix-top affix-bottom",e.DEFAULTS={offset:0},e.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(e.RESET).addClass("affix");var t=this.$window.scrollTop(),i=this.$element.offset();return this.pinnedOffset=i.top-t},e.prototype.checkPositionWithEventLoop=function(){setTimeout(t.proxy(this.checkPosition,this),1)},e.prototype.checkPosition=function(){if(this.$element.is(":visible")){var i=t(document).height(),o=this.$window.scrollTop(),n=this.$element.offset(),s=this.options.offset,a=s.top,r=s.bottom;"top"==this.affixed&&(n.top+=o),"object"!=typeof s&&(r=a=s),"function"==typeof a&&(a=s.top(this.$element)),"function"==typeof r&&(r=s.bottom(this.$element));var l=null!=this.unpin&&o+this.unpin<=n.top?!1:null!=r&&n.top+this.$element.height()>=i-r?"bottom":null!=a&&a>=o?"top":!1;if(this.affixed!==l){this.unpin&&this.$element.css("top","");var h="affix"+(l?"-"+l:""),p=t.Event(h+".bs.affix");this.$element.trigger(p),p.isDefaultPrevented()||(this.affixed=l,this.unpin="bottom"==l?this.getPinnedOffset():null,this.$element.removeClass(e.RESET).addClass(h).trigger(t.Event(h.replace("affix","affixed"))),"bottom"==l&&this.$element.offset({top:i-r-this.$element.height()}))}}};var i=t.fn.affix;t.fn.affix=function(i){return this.each(function(){var o=t(this),n=o.data("bs.affix"),s="object"==typeof i&&i;n||o.data("bs.affix",n=new e(this,s)),"string"==typeof i&&n[i]()})},t.fn.affix.Constructor=e,t.fn.affix.noConflict=function(){return t.fn.affix=i,this},t(window).on("load",function(){t('[data-spy="affix"]').each(function(){var e=t(this),i=e.data();i.offset=i.offset||{},i.offsetBottom&&(i.offset.bottom=i.offsetBottom),i.offsetTop&&(i.offset.top=i.offsetTop),e.affix(i)})})}(jQuery),+function(t){"use strict";var e='[data-dismiss="alert"]',i=function(i){t(i).on("click",e,this.close)};i.prototype.close=function(e){function i(){s.trigger("closed.bs.alert").remove()}var o=t(this),n=o.attr("data-target");n||(n=o.attr("href"),n=n&&n.replace(/.*(?=#[^\s]*$)/,""));var s=t(n);e&&e.preventDefault(),s.length||(s=o.hasClass("alert")?o:o.parent()),s.trigger(e=t.Event("close.bs.alert")),e.isDefaultPrevented()||(s.removeClass("in"),t.support.transition&&s.hasClass("fade")?s.one(t.support.transition.end,i).emulateTransitionEnd(150):i())};var o=t.fn.alert;t.fn.alert=function(e){return this.each(function(){var o=t(this),n=o.data("bs.alert");n||o.data("bs.alert",n=new i(this)),"string"==typeof e&&n[e].call(o)})},t.fn.alert.Constructor=i,t.fn.alert.noConflict=function(){return t.fn.alert=o,this},t(document).on("click.bs.alert.data-api",e,i.prototype.close)}(jQuery),+function(t){"use strict";var e=function(i,o){this.$element=t(i),this.options=t.extend({},e.DEFAULTS,o),this.isLoading=!1};e.DEFAULTS={loadingText:"loading..."},e.prototype.setState=function(e){var i="disabled",o=this.$element,n=o.is("input")?"val":"html",s=o.data();e+="Text",s.resetText||o.data("resetText",o[n]()),o[n](s[e]||this.options[e]),setTimeout(t.proxy(function(){"loadingText"==e?(this.isLoading=!0,o.addClass(i).attr(i,i)):this.isLoading&&(this.isLoading=!1,o.removeClass(i).removeAttr(i))},this),0)},e.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var i=this.$element.find("input");"radio"==i.prop("type")&&(i.prop("checked")&&this.$element.hasClass("active")?t=!1:e.find(".active").removeClass("active")),t&&i.prop("checked",!this.$element.hasClass("active")).trigger("change")}t&&this.$element.toggleClass("active")};var i=t.fn.button;t.fn.button=function(i){return this.each(function(){var o=t(this),n=o.data("bs.button"),s="object"==typeof i&&i;n||o.data("bs.button",n=new e(this,s)),"toggle"==i?n.toggle():i&&n.setState(i)})},t.fn.button.Constructor=e,t.fn.button.noConflict=function(){return t.fn.button=i,this},t(document).on("click.bs.button.data-api","[data-toggle^=button]",function(e){var i=t(e.target);i.hasClass("btn")||(i=i.closest(".btn")),i.button("toggle"),e.preventDefault()})}(jQuery),+function(t){"use strict";var e=function(e,i){this.$element=t(e),this.$indicators=this.$element.find(".carousel-indicators"),this.options=i,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",t.proxy(this.pause,this)).on("mouseleave",t.proxy(this.cycle,this))};e.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},e.prototype.cycle=function(e){return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this},e.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},e.prototype.to=function(e){var i=this,o=this.getActiveIndex();return e>this.$items.length-1||0>e?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){i.to(e)}):o==e?this.pause().cycle():this.slide(e>o?"next":"prev",t(this.$items[e]))},e.prototype.pause=function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&t.support.transition&&(this.$element.trigger(t.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},e.prototype.next=function(){return this.sliding?void 0:this.slide("next")},e.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},e.prototype.slide=function(e,i){var o=this.$element.find(".item.active"),n=i||o[e](),s=this.interval,a="next"==e?"left":"right",r="next"==e?"first":"last",l=this;if(!n.length){if(!this.options.wrap)return;n=this.$element.find(".item")[r]()}if(n.hasClass("active"))return this.sliding=!1;var h=t.Event("slide.bs.carousel",{relatedTarget:n[0],direction:a});return this.$element.trigger(h),h.isDefaultPrevented()?void 0:(this.sliding=!0,s&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var e=t(l.$indicators.children()[l.getActiveIndex()]);e&&e.addClass("active")})),t.support.transition&&this.$element.hasClass("slide")?(n.addClass(e),n[0].offsetWidth,o.addClass(a),n.addClass(a),o.one(t.support.transition.end,function(){n.removeClass([e,a].join(" ")).addClass("active"),o.removeClass(["active",a].join(" ")),l.sliding=!1,setTimeout(function(){l.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(1e3*o.css("transition-duration").slice(0,-1))):(o.removeClass("active"),n.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")),s&&this.cycle(),this)};var i=t.fn.carousel;t.fn.carousel=function(i){return this.each(function(){var o=t(this),n=o.data("bs.carousel"),s=t.extend({},e.DEFAULTS,o.data(),"object"==typeof i&&i),a="string"==typeof i?i:s.slide;n||o.data("bs.carousel",n=new e(this,s)),"number"==typeof i?n.to(i):a?n[a]():s.interval&&n.pause().cycle()})},t.fn.carousel.Constructor=e,t.fn.carousel.noConflict=function(){return t.fn.carousel=i,this},t(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(e){var i=t(this),o,n=t(i.attr("data-target")||(o=i.attr("href"))&&o.replace(/.*(?=#[^\s]+$)/,"")),s=t.extend({},n.data(),i.data()),a=i.attr("data-slide-to");a&&(s.interval=!1),n.carousel(s),(a=i.attr("data-slide-to"))&&n.data("bs.carousel").to(a),e.preventDefault()}),t(window).on("load",function(){t('[data-ride="carousel"]').each(function(){var e=t(this);e.carousel(e.data())})})}(jQuery),+function(t){"use strict";var e=function(i,o){this.$element=t(i),this.options=t.extend({},e.DEFAULTS,o),this.transitioning=null,this.options.parent&&(this.$parent=t(this.options.parent)),this.options.toggle&&this.toggle()};e.DEFAULTS={toggle:!0},e.prototype.dimension=function(){var t=this.$element.hasClass("width");return t?"width":"height"},e.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var e=t.Event("show.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var i=this.$parent&&this.$parent.find("> .panel > .in");if(i&&i.length){var o=i.data("bs.collapse");if(o&&o.transitioning)return;i.collapse("hide"),o||i.data("bs.collapse",null)}var n=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[n](0),this.transitioning=1;var s=function(){this.$element.removeClass("collapsing").addClass("collapse in")[n]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!t.support.transition)return s.call(this);var a=t.camelCase(["scroll",n].join("-"));this.$element.one(t.support.transition.end,t.proxy(s,this)).emulateTransitionEnd(350)[n](this.$element[0][a])}}},e.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var e=t.Event("hide.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var i=this.dimension();this.$element[i](this.$element[i]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var o=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return t.support.transition?void this.$element[i](0).one(t.support.transition.end,t.proxy(o,this)).emulateTransitionEnd(350):o.call(this)}}},e.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var i=t.fn.collapse;t.fn.collapse=function(i){return this.each(function(){var o=t(this),n=o.data("bs.collapse"),s=t.extend({},e.DEFAULTS,o.data(),"object"==typeof i&&i);!n&&s.toggle&&"show"==i&&(i=!i),n||o.data("bs.collapse",n=new e(this,s)),"string"==typeof i&&n[i]()})},t.fn.collapse.Constructor=e,t.fn.collapse.noConflict=function(){return t.fn.collapse=i,this},t(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(e){var i=t(this),o,n=i.attr("data-target")||e.preventDefault()||(o=i.attr("href"))&&o.replace(/.*(?=#[^\s]+$)/,""),s=t(n),a=s.data("bs.collapse"),r=a?"toggle":i.data(),l=i.attr("data-parent"),h=l&&t(l);a&&a.transitioning||(h&&h.find('[data-toggle=collapse][data-parent="'+l+'"]').not(i).addClass("collapsed"),i[s.hasClass("in")?"addClass":"removeClass"]("collapsed")),s.collapse(r)})}(jQuery),+function(t){"use strict";function e(e){t(o).remove(),t(n).each(function(){var o=i(t(this)),n={relatedTarget:this};o.hasClass("open")&&(o.trigger(e=t.Event("hide.bs.dropdown",n)),e.isDefaultPrevented()||o.removeClass("open").trigger("hidden.bs.dropdown",n))})}function i(e){var i=e.attr("data-target");i||(i=e.attr("href"),i=i&&/#[A-Za-z]/.test(i)&&i.replace(/.*(?=#[^\s]*$)/,""));var o=i&&t(i);return o&&o.length?o:e.parent()}var o=".dropdown-backdrop",n="[data-toggle=dropdown]",s=function(e){t(e).on("click.bs.dropdown",this.toggle)};s.prototype.toggle=function(o){var n=t(this);if(!n.is(".disabled, :disabled")){var s=i(n),a=s.hasClass("open");if(e(),!a){"ontouchstart"in document.documentElement&&!s.closest(".navbar-nav").length&&t('<div class="dropdown-backdrop"/>').insertAfter(t(this)).on("click",e);var r={relatedTarget:this};if(s.trigger(o=t.Event("show.bs.dropdown",r)),o.isDefaultPrevented())return;s.toggleClass("open").trigger("shown.bs.dropdown",r),n.focus()}return!1}},s.prototype.keydown=function(e){if(/(38|40|27)/.test(e.keyCode)){var o=t(this);if(e.preventDefault(),e.stopPropagation(),!o.is(".disabled, :disabled")){var s=i(o),a=s.hasClass("open");if(!a||a&&27==e.keyCode)return 27==e.which&&s.find(n).focus(),o.click();var r=" li:not(.divider):visible a",l=s.find("[role=menu]"+r+", [role=listbox]"+r);if(l.length){var h=l.index(l.filter(":focus"));38==e.keyCode&&h>0&&h--,40==e.keyCode&&h<l.length-1&&h++,~h||(h=0),l.eq(h).focus()}}}};var a=t.fn.dropdown;t.fn.dropdown=function(e){return this.each(function(){var i=t(this),o=i.data("bs.dropdown");o||i.data("bs.dropdown",o=new s(this)),"string"==typeof e&&o[e].call(i)})},t.fn.dropdown.Constructor=s,t.fn.dropdown.noConflict=function(){return t.fn.dropdown=a,this},t(document).on("click.bs.dropdown.data-api",e).on("click.bs.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.bs.dropdown.data-api",n,s.prototype.toggle).on("keydown.bs.dropdown.data-api",n+", [role=menu], [role=listbox]",s.prototype.keydown)}(jQuery),+function(t){"use strict";var e=function(e){this.element=t(e)};e.prototype.show=function(){var e=this.element,i=e.closest("ul:not(.dropdown-menu)"),o=e.data("target");if(o||(o=e.attr("href"),o=o&&o.replace(/.*(?=#[^\s]*$)/,"")),!e.parent("li").hasClass("active")){var n=i.find(".active:last a")[0],s=t.Event("show.bs.tab",{relatedTarget:n});if(e.trigger(s),!s.isDefaultPrevented()){var a=t(o);this.activate(e.parent("li"),i),this.activate(a,a.parent(),function(){e.trigger({type:"shown.bs.tab",relatedTarget:n})})}}},e.prototype.activate=function(e,i,o){function n(){s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),e.addClass("active"),a?(e[0].offsetWidth,e.addClass("in")):e.removeClass("fade"),e.parent(".dropdown-menu")&&e.closest("li.dropdown").addClass("active"),o&&o()}var s=i.find("> .active"),a=o&&t.support.transition&&s.hasClass("fade");a?s.one(t.support.transition.end,n).emulateTransitionEnd(150):n(),s.removeClass("in")};var i=t.fn.tab;t.fn.tab=function(i){return this.each(function(){var o=t(this),n=o.data("bs.tab");n||o.data("bs.tab",n=new e(this)),"string"==typeof i&&n[i]()})},t.fn.tab.Constructor=e,t.fn.tab.noConflict=function(){return t.fn.tab=i,this},t(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault(),t(this).tab("show")})}(jQuery),+function(t){"use strict";function e(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(void 0!==t.style[i])return{end:e[i]};return!1}t.fn.emulateTransitionEnd=function(e){var i=!1,o=this;t(this).one(t.support.transition.end,function(){i=!0});var n=function(){i||t(o).trigger(t.support.transition.end)};return setTimeout(n,e),this},t(function(){t.support.transition=e()})}(jQuery),+function(t){"use strict";function e(i,o){var n,s=t.proxy(this.process,this);this.$element=t(t(i).is("body")?window:i),this.$body=t("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",s),this.options=t.extend({},e.DEFAULTS,o),this.selector=(this.options.target||(n=t(i).attr("href"))&&n.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=t([]),this.targets=t([]),this.activeTarget=null,this.refresh(),this.process()}e.DEFAULTS={offset:10},e.prototype.refresh=function(){var e=this.$element[0]==window?"offset":"position";this.offsets=t([]),this.targets=t([]);var i=this,o=this.$body.find(this.selector).map(function(){var o=t(this),n=o.data("target")||o.attr("href"),s=/^#./.test(n)&&t(n);return s&&s.length&&s.is(":visible")&&[[s[e]().top+(!t.isWindow(i.$scrollElement.get(0))&&i.$scrollElement.scrollTop()),n]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){i.offsets.push(this[0]),i.targets.push(this[1])})},e.prototype.process=function(){var t=this.$scrollElement.scrollTop()+this.options.offset,e=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,i=e-this.$scrollElement.height(),o=this.offsets,n=this.targets,s=this.activeTarget,a;if(t>=i)return s!=(a=n.last()[0])&&this.activate(a);if(s&&t<=o[0])return s!=(a=n[0])&&this.activate(a);for(a=o.length;a--;)s!=n[a]&&t>=o[a]&&(!o[a+1]||t<=o[a+1])&&this.activate(n[a])},e.prototype.activate=function(e){this.activeTarget=e,t(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var i=this.selector+'[data-target="'+e+'"],'+this.selector+'[href="'+e+'"]',o=t(i).parents("li").addClass("active");o.parent(".dropdown-menu").length&&(o=o.closest("li.dropdown").addClass("active")),o.trigger("activate.bs.scrollspy")};var i=t.fn.scrollspy;t.fn.scrollspy=function(i){return this.each(function(){var o=t(this),n=o.data("bs.scrollspy"),s="object"==typeof i&&i;n||o.data("bs.scrollspy",n=new e(this,s)),"string"==typeof i&&n[i]()})},t.fn.scrollspy.Constructor=e,t.fn.scrollspy.noConflict=function(){return t.fn.scrollspy=i,this},t(window).on("load",function(){t('[data-spy="scroll"]').each(function(){var e=t(this);e.scrollspy(e.data())})})}(jQuery),+function(t){"use strict";var e=function(e,i){this.options=i,this.$element=t(e),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,t.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};e.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},e.prototype.toggle=function(t){return this[this.isShown?"hide":"show"](t)},e.prototype.show=function(e){var i=this,o=t.Event("show.bs.modal",{relatedTarget:e});this.$element.trigger(o),this.isShown||o.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',t.proxy(this.hide,this)),this.backdrop(function(){var o=t.support.transition&&i.$element.hasClass("fade");i.$element.parent().length||i.$element.appendTo(document.body),i.$element.show().scrollTop(0),o&&i.$element[0].offsetWidth,i.$element.addClass("in").attr("aria-hidden",!1),i.enforceFocus();var n=t.Event("shown.bs.modal",{relatedTarget:e});o?i.$element.find(".modal-dialog").one(t.support.transition.end,function(){i.$element.focus().trigger(n)}).emulateTransitionEnd(300):i.$element.focus().trigger(n)}))},e.prototype.hide=function(e){e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one(t.support.transition.end,t.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},e.prototype.enforceFocus=function(){t(document).off("focusin.bs.modal").on("focusin.bs.modal",t.proxy(function(t){this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.focus()},this))},e.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",t.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},e.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.removeBackdrop(),t.$element.trigger("hidden.bs.modal")})},e.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},e.prototype.backdrop=function(e){var i=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var o=t.support.transition&&i;if(this.$backdrop=t('<div class="modal-backdrop '+i+'" />').appendTo(document.body),this.$element.on("click.dismiss.bs.modal",t.proxy(function(t){t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),o&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!e)return;o?this.$backdrop.one(t.support.transition.end,e).emulateTransitionEnd(150):e()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(t.support.transition.end,e).emulateTransitionEnd(150):e()):e&&e()};var i=t.fn.modal;t.fn.modal=function(i,o){return this.each(function(){var n=t(this),s=n.data("bs.modal"),a=t.extend({},e.DEFAULTS,n.data(),"object"==typeof i&&i);s||n.data("bs.modal",s=new e(this,a)),"string"==typeof i?s[i](o):a.show&&s.show(o)})},t.fn.modal.Constructor=e,t.fn.modal.noConflict=function(){return t.fn.modal=i,this},t(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(e){var i=t(this),o=i.attr("href"),n=t(i.attr("data-target")||o&&o.replace(/.*(?=#[^\s]+$)/,"")),s=n.data("bs.modal")?"toggle":t.extend({remote:!/#/.test(o)&&o},n.data(),i.data());i.is("a")&&e.preventDefault(),n.modal(s,this).one("hide",function(){i.is(":visible")&&i.focus()})}),t(document).on("show.bs.modal",".modal",function(){t(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){t(document.body).removeClass("modal-open")})}(jQuery),+function(t){"use strict";var e=function(t,e){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",t,e)};e.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},e.prototype.init=function(e,i,o){this.enabled=!0,this.type=e,this.$element=t(i),this.options=this.getOptions(o);for(var n=this.options.trigger.split(" "),s=n.length;s--;){var a=n[s];if("click"==a)this.$element.on("click."+this.type,this.options.selector,t.proxy(this.toggle,this));else if("manual"!=a){var r="hover"==a?"mouseenter":"focusin",l="hover"==a?"mouseleave":"focusout";this.$element.on(r+"."+this.type,this.options.selector,t.proxy(this.enter,this)),this.$element.on(l+"."+this.type,this.options.selector,t.proxy(this.leave,this))}}this.options.selector?this._options=t.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},e.prototype.getDefaults=function(){return e.DEFAULTS},e.prototype.getOptions=function(e){return e=t.extend({},this.getDefaults(),this.$element.data(),e),e.delay&&"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e},e.prototype.getDelegateOptions=function(){var e={},i=this.getDefaults();return this._options&&t.each(this._options,function(t,o){i[t]!=o&&(e[t]=o)}),e},e.prototype.enter=function(e){var i=e instanceof this.constructor?e:t(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(i.timeout),i.hoverState="in",i.options.delay&&i.options.delay.show?void(i.timeout=setTimeout(function(){"in"==i.hoverState&&i.show()},i.options.delay.show)):i.show()},e.prototype.leave=function(e){var i=e instanceof this.constructor?e:t(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(i.timeout),i.hoverState="out",i.options.delay&&i.options.delay.hide?void(i.timeout=setTimeout(function(){"out"==i.hoverState&&i.hide()},i.options.delay.hide)):i.hide()},e.prototype.show=function(){var e=t.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(e),e.isDefaultPrevented())return;var i=this,o=this.tip();this.setContent(),this.options.animation&&o.addClass("fade");var n="function"==typeof this.options.placement?this.options.placement.call(this,o[0],this.$element[0]):this.options.placement,s=/\s?auto?\s?/i,a=s.test(n);a&&(n=n.replace(s,"")||"top"),o.detach().css({top:0,left:0,display:"block"}).addClass(n),this.options.container?o.appendTo(this.options.container):o.insertAfter(this.$element);var r=this.getPosition(),l=o[0].offsetWidth,h=o[0].offsetHeight;if(a){var p=this.$element.parent(),d=n,c=document.documentElement.scrollTop||document.body.scrollTop,f="body"==this.options.container?window.innerWidth:p.outerWidth(),u="body"==this.options.container?window.innerHeight:p.outerHeight(),v="body"==this.options.container?0:p.offset().left;n="bottom"==n&&r.top+r.height+h-c>u?"top":"top"==n&&r.top-c-h<0?"bottom":"right"==n&&r.right+l>f?"left":"left"==n&&r.left-l<v?"right":n,o.removeClass(d).addClass(n)}var m=this.getCalculatedOffset(n,r,l,h);this.applyPlacement(m,n),this.hoverState=null;var g=function(){i.$element.trigger("shown.bs."+i.type)};t.support.transition&&this.$tip.hasClass("fade")?o.one(t.support.transition.end,g).emulateTransitionEnd(150):g()}},e.prototype.applyPlacement=function(e,i){var o,n=this.tip(),s=n[0].offsetWidth,a=n[0].offsetHeight,r=parseInt(n.css("margin-top"),10),l=parseInt(n.css("margin-left"),10);isNaN(r)&&(r=0),isNaN(l)&&(l=0),e.top=e.top+r,e.left=e.left+l,t.offset.setOffset(n[0],t.extend({using:function(t){n.css({top:Math.round(t.top),left:Math.round(t.left)})}},e),0),n.addClass("in");var h=n[0].offsetWidth,p=n[0].offsetHeight;if("top"==i&&p!=a&&(o=!0,e.top=e.top+a-p),/bottom|top/.test(i)){var d=0;e.left<0&&(d=-2*e.left,e.left=0,n.offset(e),h=n[0].offsetWidth,p=n[0].offsetHeight),this.replaceArrow(d-s+h,h,"left")}else this.replaceArrow(p-a,p,"top");o&&n.offset(e)},e.prototype.replaceArrow=function(t,e,i){this.arrow().css(i,t?50*(1-t/e)+"%":"")},e.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();t.find(".tooltip-inner")[this.options.html?"html":"text"](e),t.removeClass("fade in top bottom left right")},e.prototype.hide=function(){function e(){"in"!=i.hoverState&&o.detach(),i.$element.trigger("hidden.bs."+i.type)}var i=this,o=this.tip(),n=t.Event("hide.bs."+this.type);return this.$element.trigger(n),n.isDefaultPrevented()?void 0:(o.removeClass("in"),t.support.transition&&this.$tip.hasClass("fade")?o.one(t.support.transition.end,e).emulateTransitionEnd(150):e(),this.hoverState=null,this)},e.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},e.prototype.hasContent=function(){return this.getTitle()},e.prototype.getPosition=function(){var e=this.$element[0];return t.extend({},"function"==typeof e.getBoundingClientRect?e.getBoundingClientRect():{width:e.offsetWidth,height:e.offsetHeight},this.$element.offset())},e.prototype.getCalculatedOffset=function(t,e,i,o){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-i/2}:"top"==t?{top:e.top-o,left:e.left+e.width/2-i/2}:"left"==t?{top:e.top+e.height/2-o/2,left:e.left-i}:{top:e.top+e.height/2-o/2,left:e.left+e.width}},e.prototype.getTitle=function(){var t,e=this.$element,i=this.options;return t=e.attr("data-original-title")||("function"==typeof i.title?i.title.call(e[0]):i.title)},e.prototype.tip=function(){return this.$tip=this.$tip||t(this.options.template)},e.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},e.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},e.prototype.enable=function(){this.enabled=!0},e.prototype.disable=function(){this.enabled=!1},e.prototype.toggleEnabled=function(){this.enabled=!this.enabled},e.prototype.toggle=function(e){var i=e?t(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;i.tip().hasClass("in")?i.leave(i):i.enter(i)},e.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var i=t.fn.tooltip;t.fn.tooltip=function(i){return this.each(function(){var o=t(this),n=o.data("bs.tooltip"),s="object"==typeof i&&i;(n||"destroy"!=i)&&(n||o.data("bs.tooltip",n=new e(this,s)),"string"==typeof i&&n[i]())})},t.fn.tooltip.Constructor=e,t.fn.tooltip.noConflict=function(){return t.fn.tooltip=i,this}}(jQuery),+function(t){"use strict";var e=function(t,e){this.init("popover",t,e)};if(!t.fn.tooltip)throw new Error("Popover requires tooltip.js");e.DEFAULTS=t.extend({},t.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),e.prototype=t.extend({},t.fn.tooltip.Constructor.prototype),e.prototype.constructor=e,e.prototype.getDefaults=function(){return e.DEFAULTS},e.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),i=this.getContent();t.find(".popover-title")[this.options.html?"html":"text"](e),t.find(".popover-content")[this.options.html?"string"==typeof i?"html":"append":"text"](i),t.removeClass("fade top bottom left right in"),t.find(".popover-title").html()||t.find(".popover-title").hide()},e.prototype.hasContent=function(){return this.getTitle()||this.getContent()},e.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},e.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},e.prototype.tip=function(){return this.$tip||(this.$tip=t(this.options.template)),this.$tip};var i=t.fn.popover;t.fn.popover=function(i){return this.each(function(){var o=t(this),n=o.data("bs.popover"),s="object"==typeof i&&i;(n||"destroy"!=i)&&(n||o.data("bs.popover",n=new e(this,s)),"string"==typeof i&&n[i]())})},t.fn.popover.Constructor=e,t.fn.popover.noConflict=function(){return t.fn.popover=i,this}}(jQuery);
/*! jQuery UI - v1.10.4 - 2014-06-25
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var s,a,o,r=t.nodeName.toLowerCase();return"area"===r?(s=t.parentNode,a=s.name,t.href&&a&&"map"===s.nodeName.toLowerCase()?(o=e("img[usemap=#"+a+"]")[0],!!o&&n(o)):!1):(/input|select|textarea|button|object/.test(r)?!t.disabled:"a"===r?t.href||i:i)&&n(t)}function n(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,a=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,n){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),n&&n.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var n,s,a=e(this[0]);a.length&&a[0]!==document;){if(n=a.css("position"),("absolute"===n||"relative"===n||"fixed"===n)&&(s=parseInt(a.css("zIndex"),10),!isNaN(s)&&0!==s))return s;a=a.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){a.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,n){return!!e.data(t,n[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),s=isNaN(n);return(s||n>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,n){function s(t,i,n,s){return e.each(a,function(){i-=parseFloat(e.css(t,"padding"+this))||0,n&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var a="Width"===n?["Left","Right"]:["Top","Bottom"],o=n.toLowerCase(),r={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+n]=function(i){return i===t?r["inner"+n].call(this):this.each(function(){e(this).css(o,s(this,i)+"px")})},e.fn["outer"+n]=function(t,i){return"number"!=typeof t?r["outer"+n].call(this,t):this.each(function(){e(this).css(o,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,n){var s,a=e.ui[t].prototype;for(s in n)a.plugins[s]=a.plugins[s]||[],a.plugins[s].push([i,n[s]])},call:function(e,t,i){var n,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(n=0;s.length>n;n++)e.options[s[n][0]]&&s[n][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var n=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[n]>0?!0:(t[n]=1,s=t[n]>0,t[n]=0,s)}})})(jQuery);(function(t,e){var i=0,s=Array.prototype.slice,n=t.cleanData;t.cleanData=function(e){for(var i,s=0;null!=(i=e[s]);s++)try{t(i).triggerHandler("remove")}catch(o){}n(e)},t.widget=function(i,s,n){var o,a,r,h,l={},c=i.split(".")[0];i=i.split(".")[1],o=c+"-"+i,n||(n=s,s=t.Widget),t.expr[":"][o.toLowerCase()]=function(e){return!!t.data(e,o)},t[c]=t[c]||{},a=t[c][i],r=t[c][i]=function(t,i){return this._createWidget?(arguments.length&&this._createWidget(t,i),e):new r(t,i)},t.extend(r,a,{version:n.version,_proto:t.extend({},n),_childConstructors:[]}),h=new s,h.options=t.widget.extend({},h.options),t.each(n,function(i,n){return t.isFunction(n)?(l[i]=function(){var t=function(){return s.prototype[i].apply(this,arguments)},e=function(t){return s.prototype[i].apply(this,t)};return function(){var i,s=this._super,o=this._superApply;return this._super=t,this._superApply=e,i=n.apply(this,arguments),this._super=s,this._superApply=o,i}}(),e):(l[i]=n,e)}),r.prototype=t.widget.extend(h,{widgetEventPrefix:a?h.widgetEventPrefix||i:i},l,{constructor:r,namespace:c,widgetName:i,widgetFullName:o}),a?(t.each(a._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete a._childConstructors):s._childConstructors.push(r),t.widget.bridge(i,r)},t.widget.extend=function(i){for(var n,o,a=s.call(arguments,1),r=0,h=a.length;h>r;r++)for(n in a[r])o=a[r][n],a[r].hasOwnProperty(n)&&o!==e&&(i[n]=t.isPlainObject(o)?t.isPlainObject(i[n])?t.widget.extend({},i[n],o):t.widget.extend({},o):o);return i},t.widget.bridge=function(i,n){var o=n.prototype.widgetFullName||i;t.fn[i]=function(a){var r="string"==typeof a,h=s.call(arguments,1),l=this;return a=!r&&h.length?t.widget.extend.apply(null,[a].concat(h)):a,r?this.each(function(){var s,n=t.data(this,o);return n?t.isFunction(n[a])&&"_"!==a.charAt(0)?(s=n[a].apply(n,h),s!==n&&s!==e?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):e):t.error("no such method '"+a+"' for "+i+" widget instance"):t.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+a+"'")}):this.each(function(){var e=t.data(this,o);e?e.option(a||{})._init():t.data(this,o,new n(a,this))}),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this.bindings=t(),this.hoverable=t(),this.focusable=t(),s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(i,s){var n,o,a,r=i;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(o=r[i]=t.widget.extend({},this.options[i]),a=0;n.length-1>a;a++)o[n[a]]=o[n[a]]||{},o=o[n[a]];if(i=n.pop(),1===arguments.length)return o[i]===e?null:o[i];o[i]=s}else{if(1===arguments.length)return this.options[i]===e?null:this.options[i];r[i]=s}return this._setOptions(r),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!e).attr("aria-disabled",e),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var o,a=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=o=t(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,o=this.widget()),t.each(n,function(n,r){function h(){return i||a.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?a[r]:r).apply(a,arguments):e}"string"!=typeof r&&(h.guid=r.guid=r.guid||h.guid||t.guid++);var l=n.match(/^(\w+)\s*(.*)$/),c=l[1]+a.eventNamespace,u=l[2];u?o.delegate(u,c,h):s.bind(c,h)})},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e)},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}})})(jQuery);(function(t){var e=!1;t(document).mouseup(function(){e=!1}),t.widget("ui.mouse",{version:"1.10.4",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.bind("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).bind("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!e){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?t(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===t.data(i.target,this.widgetName+".preventClickEvent")&&t.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return s._mouseMove(t)},this._mouseUpDelegate=function(t){return s._mouseUp(t)},t(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),e=!0,!0)):!0}},_mouseMove:function(e){return t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button?this._mouseUp(e):this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),!1},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,l=Math.round,h=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),k=t.position.getScrollInfo(y),w=(e.collision||"flip").split(" "),D={};return _=n(b),b[0].preventDefault&&(e.at="left top"),p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=h.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=h.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),D[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),a=i(D.at,p,g),v.left+=a[0],v.top+=a[1],this.each(function(){var n,h,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),x=u+f+s(this,"marginRight")+k.width,C=d+_+s(this,"marginBottom")+k.height,M=t.extend({},v),T=i(D.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?M.left-=u:"center"===e.my[0]&&(M.left-=u/2),"bottom"===e.my[1]?M.top-=d:"center"===e.my[1]&&(M.top-=d/2),M.left+=T[0],M.top+=T[1],t.support.offsetFractions||(M.left=l(M.left),M.top=l(M.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],function(i,s){t.ui.position[w[i]]&&t.ui.position[w[i]][s](M,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:x,collisionHeight:C,offset:[a[0]+T[0],a[1]+T[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(h=function(t){var i=m.left-M.left,s=i+p-u,n=m.top-M.top,a=n+g-d,l={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:M.left,top:M.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(l.horizontal="center"),d>g&&g>r(n+a)&&(l.vertical="middle"),l.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,l)}),c.offset(t.extend(M,{using:h}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-o-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-o-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-o-a,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);(function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=h(),n=s._rgba=[];return i=i.toLowerCase(),f(l,function(t,a){var o,r=a.re.exec(i),l=r&&a.parse(r),h=a.space||"rgba";return l?(o=s[h](l),s[c[h].cache]=o[c[h].cache],n=s._rgba=o._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,a.transparent),s):a[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],h=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=h.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),h.fn=t.extend(h.prototype,{parse:function(n,o,r,l){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=e);var u=this,d=t.type(n),p=this._rgba=[];return o!==e&&(n=[n,o,r,l],d="array"),"string"===d?this.parse(s(n)||a._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof h?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var a=s.cache;f(s.props,function(t,e){if(!u[a]&&s.to){if("alpha"===t||null==n[t])return;u[a]=s.to(u._rgba)}u[a][e.idx]=i(n[t],e,!0)}),u[a]&&0>t.inArray(null,u[a].slice(0,3))&&(u[a][3]=1,s.from&&(u._rgba=s.from(u[a])))}),this):e},is:function(t){var i=h(t),s=!0,n=this;return f(c,function(t,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=h(t),n=s._space(),a=c[n],o=0===this.alpha()?h("transparent"):this,r=o[a.cache]||a.to(o._rgba),l=r.slice();return s=s[a.cache],f(a.props,function(t,n){var a=n.idx,o=r[a],h=s[a],c=u[n.type]||{};null!==h&&(null===o?l[a]=h:(c.mod&&(h-o>c.mod/2?o+=c.mod:o-h>c.mod/2&&(o-=c.mod)),l[a]=i((h-o)*e+o,n)))}),this[n](l)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=h(e)._rgba;return h(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),h.fn.parse.prototype=h.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,a=t[2]/255,o=t[3],r=Math.max(s,n,a),l=Math.min(s,n,a),h=r-l,c=r+l,u=.5*c;return e=l===r?0:s===r?60*(n-a)/h+360:n===r?60*(a-s)/h+120:60*(s-n)/h+240,i=0===h?0:.5>=u?h/c:h/(2-c),[Math.round(e)%360,i,u,null==o?1:o]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],a=t[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,e+1/3)),Math.round(255*n(r,o,e)),Math.round(255*n(r,o,e-1/3)),a]},f(c,function(s,n){var a=n.props,o=n.cache,l=n.to,c=n.from;h.fn[s]=function(s){if(l&&!this[o]&&(this[o]=l(this._rgba)),s===e)return this[o].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[o].slice();return f(a,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=h(c(d)),n[o]=d,n):h(d)},f(a,function(e,i){h.fn[e]||(h.fn[e]=function(n){var a,o=t.type(n),l="alpha"===e?this._hsla?"hsla":"rgba":s,h=this[l](),c=h[i.idx];return"undefined"===o?c:("function"===o&&(n=n.call(this,c),o=t.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=c+parseFloat(a[2])*("+"===a[1]?1:-1))),h[i.idx]=n,this[l](h)))})})}),h.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var a,o,r="";if("transparent"!==n&&("string"!==t.type(n)||(a=s(n)))){if(n=h(a||n),!d.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&o&&o.style;)try{r=t.css(o,"backgroundColor"),o=o.parentNode}catch(l){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=h(e.elem,i),e.end=h(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},h.hook(o),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},a=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}function s(e,i){var s,n,o={};for(s in i)n=i[s],e[s]!==n&&(a[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(o[s]=n));return o}var n=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,a,o,r){var l=t.speed(a,o,r);return this.queue(function(){var a,o=t(this),r=o.attr("class")||"",h=l.children?o.find("*").addBack():o;h=h.map(function(){var e=t(this);return{el:e,start:i(this)}}),a=function(){t.each(n,function(t,i){e[i]&&o[i+"Class"](e[i])})},a(),h=h.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),o.attr("class",r),h=h.map(function(){var e=this,i=t.Deferred(),s=t.extend({},l,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,h.get()).done(function(){a(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),l.complete.call(o[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,a){return s?t.effects.animateClass.call(this,{add:i},s,n,a):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,a){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,a):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,a,o,r){return"boolean"==typeof n||n===e?a?t.effects.animateClass.call(this,n?{add:s}:{remove:s},a,o,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,a,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,a){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,a)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.4",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,a;for(a=0;s.length>a;a++)null!==s[a]&&(n=t.data(i+s[a]),n===e&&(n=""),t.css(s[a],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return e.wrap(s),(e[0]===a||t.contains(e[0],a))&&t(a).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var a=e.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(a)&&a.call(n[0]),t.isFunction(e)&&e()}var n=t(this),a=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):o.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,a=i.queue,o=t.effects.effect[i.effect];return t.fx.off||!o?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):a===!1?this.each(e):this.queue(a||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()})(jQuery);(function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var a,o,r,l=t(this),h=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(l,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",g=i.test(u),m={},v="show"===c;l.parent().is(".ui-effects-wrapper")?t.effects.save(l.parent(),h):t.effects.save(l,h),l.show(),a=t.effects.createWrapper(l).css({overflow:"hidden"}),o=a[p](),r=parseFloat(a.css(f))||0,m[p]=v?o:0,g||(l.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),m[f]=v?r:o+r),v&&(a.css(p,0),g||a.css(f,r+o)),a.animate(m,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&l.hide(),t.effects.restore(l,h),t.effects.removeWrapper(l),n()}})}})(jQuery);(function(t){t.effects.effect.bounce=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"effect"),h="hide"===l,c="show"===l,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||h?1:0),g=e.duration/f,m=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=o.queue(),y=b.length;for((c||h)&&r.push("opacity"),t.effects.save(o,r),o.show(),t.effects.createWrapper(o),d||(d=o["top"===v?"outerHeight":"outerWidth"]()/3),c&&(a={opacity:1},a[v]=0,o.css("opacity",0).css(v,_?2*-d:2*d).animate(a,g,m)),h&&(d/=Math.pow(2,p-1)),a={},a[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m).animate(a,g,m),d=h?2*d:d/2;h&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m)),o.queue(function(){h&&o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),o.dequeue()}})(jQuery);(function(t){t.effects.effect.clip=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"hide"),h="show"===l,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(o,r),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n="IMG"===o[0].tagName?s:o,a=n[d](),h&&(n.css(d,0),n.css(p,a/2)),f[d]=h?a:0,f[p]=h?0:a/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){h||o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","opacity","height","width"],o=t.effects.setMode(n,e.mode||"hide"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,a),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(h,"pos"===c?-s:s),u[h]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),g||p.hide(),i()}var a,o,r,l,h,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),g="show"===f,m=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(a=0;u>a;a++)for(l=m.top+a*_,c=a-(u-1)/2,o=0;d>o;o++)r=m.left+o*v,h=o-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-o*v,top:-a*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(g?h*v:0),top:l+(g?c*_:0),opacity:g?0:1}).animate({left:r+(g?0:h*v),top:l+(g?0:c*_),opacity:g?1:0},e.duration||500,e.easing,s)}})(jQuery);(function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}})(jQuery);(function(t){t.effects.effect.fold=function(e,i){var s,n,a=t(this),o=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(a,e.mode||"hide"),l="show"===r,h="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=l!==d,f=p?["width","height"]:["height","width"],g=e.duration/2,m={},v={};t.effects.save(a,o),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[h?0:1]),l&&s.css(d?{height:0,width:c}:{height:c,width:0}),m[f[0]]=l?n[0]:c,v[f[1]]=l?n[1]:0,s.animate(m,g,e.easing).animate(v,g,e.easing,function(){h&&a.hide(),t.effects.restore(a,o),t.effects.removeWrapper(a),i()})}})(jQuery);(function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],a=t.effects.setMode(s,e.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(o,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&s.hide(),t.effects.restore(s,n),i()}})}})(jQuery);(function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),a=t.effects.setMode(n,e.mode||"show"),o="show"===a,r="hide"===a,l=o||"hide"===a,h=2*(e.times||5)+(l?1:0),c=e.duration/h,u=0,d=n.queue(),p=d.length;for((o||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;h>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,h+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),a="hide"===n,o=parseInt(e.percent,10)||150,r=o/100,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:a?o:100,from:a?l:{height:l.height*r,width:l.width*r,outerHeight:l.outerHeight*r,outerWidth:l.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),a=t.effects.setMode(s,e.mode||"effect"),o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===a?0:100),r=e.direction||"both",l=e.origin,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?o/100:1,x:"vertical"!==r?o/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==a&&(n.origin=l||["middle","center"],n.restore=!0),n.from=e.from||("show"===a?{height:0,width:0,outerHeight:0,outerWidth:0}:h),n.to={height:h.height*c.y,width:h.width*c.x,outerHeight:h.outerHeight*c.y,outerWidth:h.outerWidth*c.x},n.fade&&("show"===a&&(n.from.opacity=0,n.to.opacity=1),"hide"===a&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],l=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(o,e.mode||"effect"),f=e.restore||"effect"!==p,g=e.scale||"both",m=e.origin||["middle","center"],v=o.css("position"),_=f?r:l,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&o.show(),s={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},"toggle"===e.mode&&"show"===p?(o.from=e.to||b,o.to=e.from||s):(o.from=e.from||("show"===p?b:s),o.to=e.to||("hide"===p?b:s)),a={from:{y:o.from.height/s.height,x:o.from.width/s.width},to:{y:o.to.height/s.height,x:o.to.width/s.width}},("box"===g||"both"===g)&&(a.from.y!==a.to.y&&(_=_.concat(u),o.from=t.effects.setTransition(o,u,a.from.y,o.from),o.to=t.effects.setTransition(o,u,a.to.y,o.to)),a.from.x!==a.to.x&&(_=_.concat(d),o.from=t.effects.setTransition(o,d,a.from.x,o.from),o.to=t.effects.setTransition(o,d,a.to.x,o.to))),("content"===g||"both"===g)&&a.from.y!==a.to.y&&(_=_.concat(c).concat(h),o.from=t.effects.setTransition(o,c,a.from.y,o.from),o.to=t.effects.setTransition(o,c,a.to.y,o.to)),t.effects.save(o,_),o.show(),t.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),m&&(n=t.effects.getBaseline(m,s),o.from.top=(s.outerHeight-o.outerHeight())*n.y,o.from.left=(s.outerWidth-o.outerWidth())*n.x,o.to.top=(s.outerHeight-o.to.outerHeight)*n.y,o.to.left=(s.outerWidth-o.to.outerWidth)*n.x),o.css(o.from),("content"===g||"both"===g)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),h=r.concat(u).concat(d),o.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,h),i.from={height:s.height*a.from.y,width:s.width*a.from.x,outerHeight:s.outerHeight*a.from.y,outerWidth:s.outerWidth*a.from.x},i.to={height:s.height*a.to.y,width:s.width*a.to.x,outerHeight:s.height*a.to.y,outerWidth:s.width*a.to.x},a.from.y!==a.to.y&&(i.from=t.effects.setTransition(i,u,a.from.y,i.from),i.to=t.effects.setTransition(i,u,a.to.y,i.to)),a.from.x!==a.to.x&&(i.from=t.effects.setTransition(i,d,a.from.x,i.from),i.to=t.effects.setTransition(i,d,a.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,h)})})),o.animate(o.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===o.to.opacity&&o.css("opacity",o.from.opacity),"hide"===p&&o.hide(),t.effects.restore(o,_),f||("static"===v?o.css({position:"relative",top:o.to.top,left:o.to.left}):t.each(["top","left"],function(t,e){o.css(e,function(e,i){var s=parseInt(i,10),n=t?o.to.left:o.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","height","width"],o=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",l=e.distance||20,h=e.times||3,c=2*h+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},g={},m={},v=n.queue(),_=v.length;for(t.effects.save(n,a),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+l,g[d]=(p?"+=":"-=")+2*l,m[d]=(p?"-=":"+=")+2*l,n.animate(f,u,e.easing),s=1;h>s;s++)n.animate(g,u,e.easing).animate(m,u,e.easing);n.animate(g,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","width","height"],o=t.effects.setMode(n,e.mode||"show"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l,u={};t.effects.save(n,a),n.show(),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(h,c?isNaN(s)?"-"+s:-s:s),u[h]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),a="fixed"===n.css("position"),o=t("body"),r=a?o.scrollTop():0,l=a?o.scrollLeft():0,h=n.offset(),c={top:h.top-r,left:h.left-l,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:u.top-r,left:u.left-l,height:s.innerHeight(),width:s.innerWidth(),position:a?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),i()})}})(jQuery);
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.moment=t()}(this,function(){"use strict";function e(){return Qe.apply(null,arguments)}function t(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function n(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function s(e){return void 0===e}function i(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function r(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function a(e,t){var n,s=[];for(n=0;n<e.length;++n)s.push(t(e[n],n));return s}function o(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function u(e,t){for(var n in t)o(t,n)&&(e[n]=t[n]);return o(t,"toString")&&(e.toString=t.toString),o(t,"valueOf")&&(e.valueOf=t.valueOf),e}function l(e,t,n,s){return ge(e,t,n,s,!0).utc()}function d(e){return null==e._pf&&(e._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null,rfc2822:!1,weekdayMismatch:!1}),e._pf}function h(e){if(null==e._isValid){var t=d(e),n=Xe.call(t.parsedDateParts,function(e){return null!=e}),s=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n);if(e._strict&&(s=s&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return s;e._isValid=s}return e._isValid}function c(e){var t=l(NaN);return null!=e?u(d(t),e):d(t).userInvalidated=!0,t}function f(e,t){var n,i,r;if(s(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),s(t._i)||(e._i=t._i),s(t._f)||(e._f=t._f),s(t._l)||(e._l=t._l),s(t._strict)||(e._strict=t._strict),s(t._tzm)||(e._tzm=t._tzm),s(t._isUTC)||(e._isUTC=t._isUTC),s(t._offset)||(e._offset=t._offset),s(t._pf)||(e._pf=d(t)),s(t._locale)||(e._locale=t._locale),Ke.length>0)for(n=0;n<Ke.length;n++)s(r=t[i=Ke[n]])||(e[i]=r);return e}function m(t){f(this,t),this._d=new Date(null!=t._d?t._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===et&&(et=!0,e.updateOffset(this),et=!1)}function _(e){return e instanceof m||null!=e&&null!=e._isAMomentObject}function y(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function g(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=y(t)),n}function p(e,t,n){var s,i=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),a=0;for(s=0;s<i;s++)(n&&e[s]!==t[s]||!n&&g(e[s])!==g(t[s]))&&a++;return a+r}function w(t){!1===e.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+t)}function v(t,n){var s=!0;return u(function(){if(null!=e.deprecationHandler&&e.deprecationHandler(null,t),s){for(var i,r=[],a=0;a<arguments.length;a++){if(i="","object"==typeof arguments[a]){i+="\n["+a+"] ";for(var o in arguments[0])i+=o+": "+arguments[0][o]+", ";i=i.slice(0,-2)}else i=arguments[a];r.push(i)}w(t+"\nArguments: "+Array.prototype.slice.call(r).join("")+"\n"+(new Error).stack),s=!1}return n.apply(this,arguments)},n)}function M(t,n){null!=e.deprecationHandler&&e.deprecationHandler(t,n),tt[t]||(w(n),tt[t]=!0)}function S(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function D(e,t){var s,i=u({},e);for(s in t)o(t,s)&&(n(e[s])&&n(t[s])?(i[s]={},u(i[s],e[s]),u(i[s],t[s])):null!=t[s]?i[s]=t[s]:delete i[s]);for(s in e)o(e,s)&&!o(t,s)&&n(e[s])&&(i[s]=u({},i[s]));return i}function k(e){null!=e&&this.set(e)}function Y(e,t){var n=e.toLowerCase();st[n]=st[n+"s"]=st[t]=e}function O(e){return"string"==typeof e?st[e]||st[e.toLowerCase()]:void 0}function T(e){var t,n,s={};for(n in e)o(e,n)&&(t=O(n))&&(s[t]=e[n]);return s}function x(e,t){it[e]=t}function b(e,t,n){var s=""+Math.abs(e),i=t-s.length;return(e>=0?n?"+":"":"-")+Math.pow(10,Math.max(0,i)).toString().substr(1)+s}function P(e,t,n,s){var i=s;"string"==typeof s&&(i=function(){return this[s]()}),e&&(ut[e]=i),t&&(ut[t[0]]=function(){return b(i.apply(this,arguments),t[1],t[2])}),n&&(ut[n]=function(){return this.localeData().ordinal(i.apply(this,arguments),e)})}function W(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function H(e,t){return e.isValid()?(t=R(t,e.localeData()),ot[t]=ot[t]||function(e){var t,n,s=e.match(rt);for(t=0,n=s.length;t<n;t++)ut[s[t]]?s[t]=ut[s[t]]:s[t]=W(s[t]);return function(t){var i,r="";for(i=0;i<n;i++)r+=S(s[i])?s[i].call(t,e):s[i];return r}}(t),ot[t](e)):e.localeData().invalidDate()}function R(e,t){function n(e){return t.longDateFormat(e)||e}var s=5;for(at.lastIndex=0;s>=0&&at.test(e);)e=e.replace(at,n),at.lastIndex=0,s-=1;return e}function C(e,t,n){Yt[e]=S(t)?t:function(e,s){return e&&n?n:t}}function F(e,t){return o(Yt,e)?Yt[e](t._strict,t._locale):new RegExp(function(e){return U(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,n,s,i){return t||n||s||i}))}(e))}function U(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function L(e,t){var n,s=t;for("string"==typeof e&&(e=[e]),i(t)&&(s=function(e,n){n[t]=g(e)}),n=0;n<e.length;n++)Ot[e[n]]=s}function N(e,t){L(e,function(e,n,s,i){s._w=s._w||{},t(e,s._w,s,i)})}function G(e,t,n){null!=t&&o(Ot,e)&&Ot[e](t,n._a,n,e)}function V(e){return E(e)?366:365}function E(e){return e%4==0&&e%100!=0||e%400==0}function I(t,n){return function(s){return null!=s?(j(this,t,s),e.updateOffset(this,n),this):A(this,t)}}function A(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function j(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&E(e.year())&&1===e.month()&&29===e.date()?e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),Z(n,e.month())):e._d["set"+(e._isUTC?"UTC":"")+t](n))}function Z(e,t){if(isNaN(e)||isNaN(t))return NaN;var n=function(e,t){return(e%t+t)%t}(t,12);return e+=(t-n)/12,1===n?E(e)?29:28:31-n%7%2}function z(e,t){var n;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=g(t);else if(t=e.localeData().monthsParse(t),!i(t))return e;return n=Math.min(e.date(),Z(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function $(t){return null!=t?(z(this,t),e.updateOffset(this,!0),this):A(this,"Month")}function q(){function e(e,t){return t.length-e.length}var t,n,s=[],i=[],r=[];for(t=0;t<12;t++)n=l([2e3,t]),s.push(this.monthsShort(n,"")),i.push(this.months(n,"")),r.push(this.months(n,"")),r.push(this.monthsShort(n,""));for(s.sort(e),i.sort(e),r.sort(e),t=0;t<12;t++)s[t]=U(s[t]),i[t]=U(i[t]);for(t=0;t<24;t++)r[t]=U(r[t]);this._monthsRegex=new RegExp("^("+r.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+s.join("|")+")","i")}function J(e){var t=new Date(Date.UTC.apply(null,arguments));return e<100&&e>=0&&isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e),t}function B(e,t,n){var s=7+t-n;return-((7+J(e,0,s).getUTCDay()-t)%7)+s-1}function Q(e,t,n,s,i){var r,a,o=1+7*(t-1)+(7+n-s)%7+B(e,s,i);return o<=0?a=V(r=e-1)+o:o>V(e)?(r=e+1,a=o-V(e)):(r=e,a=o),{year:r,dayOfYear:a}}function X(e,t,n){var s,i,r=B(e.year(),t,n),a=Math.floor((e.dayOfYear()-r-1)/7)+1;return a<1?s=a+K(i=e.year()-1,t,n):a>K(e.year(),t,n)?(s=a-K(e.year(),t,n),i=e.year()+1):(i=e.year(),s=a),{week:s,year:i}}function K(e,t,n){var s=B(e,t,n),i=B(e+1,t,n);return(V(e)-s+i)/7}function ee(){function e(e,t){return t.length-e.length}var t,n,s,i,r,a=[],o=[],u=[],d=[];for(t=0;t<7;t++)n=l([2e3,1]).day(t),s=this.weekdaysMin(n,""),i=this.weekdaysShort(n,""),r=this.weekdays(n,""),a.push(s),o.push(i),u.push(r),d.push(s),d.push(i),d.push(r);for(a.sort(e),o.sort(e),u.sort(e),d.sort(e),t=0;t<7;t++)o[t]=U(o[t]),u[t]=U(u[t]),d[t]=U(d[t]);this._weekdaysRegex=new RegExp("^("+d.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+u.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+a.join("|")+")","i")}function te(){return this.hours()%12||12}function ne(e,t){P(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function se(e,t){return t._meridiemParse}function ie(e){return e?e.toLowerCase().replace("_","-"):e}function re(e){var t=null;if(!Xt[e]&&"undefined"!=typeof module&&module&&module.exports)try{t=Jt._abbr;require("./locale/"+e),ae(t)}catch(e){}return Xt[e]}function ae(e,t){var n;return e&&(n=s(t)?ue(e):oe(e,t))&&(Jt=n),Jt._abbr}function oe(e,t){if(null!==t){var n=Qt;if(t.abbr=e,null!=Xt[e])M("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),n=Xt[e]._config;else if(null!=t.parentLocale){if(null==Xt[t.parentLocale])return Kt[t.parentLocale]||(Kt[t.parentLocale]=[]),Kt[t.parentLocale].push({name:e,config:t}),null;n=Xt[t.parentLocale]._config}return Xt[e]=new k(D(n,t)),Kt[e]&&Kt[e].forEach(function(e){oe(e.name,e.config)}),ae(e),Xt[e]}return delete Xt[e],null}function ue(e){var n;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return Jt;if(!t(e)){if(n=re(e))return n;e=[e]}return function(e){for(var t,n,s,i,r=0;r<e.length;){for(t=(i=ie(e[r]).split("-")).length,n=(n=ie(e[r+1]))?n.split("-"):null;t>0;){if(s=re(i.slice(0,t).join("-")))return s;if(n&&n.length>=t&&p(i,n,!0)>=t-1)break;t--}r++}return null}(e)}function le(e){var t,n=e._a;return n&&-2===d(e).overflow&&(t=n[xt]<0||n[xt]>11?xt:n[bt]<1||n[bt]>Z(n[Tt],n[xt])?bt:n[Pt]<0||n[Pt]>24||24===n[Pt]&&(0!==n[Wt]||0!==n[Ht]||0!==n[Rt])?Pt:n[Wt]<0||n[Wt]>59?Wt:n[Ht]<0||n[Ht]>59?Ht:n[Rt]<0||n[Rt]>999?Rt:-1,d(e)._overflowDayOfYear&&(t<Tt||t>bt)&&(t=bt),d(e)._overflowWeeks&&-1===t&&(t=Ct),d(e)._overflowWeekday&&-1===t&&(t=Ft),d(e).overflow=t),e}function de(e,t,n){return null!=e?e:null!=t?t:n}function he(t){var n,s,i,r,a,o=[];if(!t._d){for(i=function(t){var n=new Date(e.now());return t._useUTC?[n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()]:[n.getFullYear(),n.getMonth(),n.getDate()]}(t),t._w&&null==t._a[bt]&&null==t._a[xt]&&function(e){var t,n,s,i,r,a,o,u;if(null!=(t=e._w).GG||null!=t.W||null!=t.E)r=1,a=4,n=de(t.GG,e._a[Tt],X(pe(),1,4).year),s=de(t.W,1),((i=de(t.E,1))<1||i>7)&&(u=!0);else{r=e._locale._week.dow,a=e._locale._week.doy;var l=X(pe(),r,a);n=de(t.gg,e._a[Tt],l.year),s=de(t.w,l.week),null!=t.d?((i=t.d)<0||i>6)&&(u=!0):null!=t.e?(i=t.e+r,(t.e<0||t.e>6)&&(u=!0)):i=r}s<1||s>K(n,r,a)?d(e)._overflowWeeks=!0:null!=u?d(e)._overflowWeekday=!0:(o=Q(n,s,i,r,a),e._a[Tt]=o.year,e._dayOfYear=o.dayOfYear)}(t),null!=t._dayOfYear&&(a=de(t._a[Tt],i[Tt]),(t._dayOfYear>V(a)||0===t._dayOfYear)&&(d(t)._overflowDayOfYear=!0),s=J(a,0,t._dayOfYear),t._a[xt]=s.getUTCMonth(),t._a[bt]=s.getUTCDate()),n=0;n<3&&null==t._a[n];++n)t._a[n]=o[n]=i[n];for(;n<7;n++)t._a[n]=o[n]=null==t._a[n]?2===n?1:0:t._a[n];24===t._a[Pt]&&0===t._a[Wt]&&0===t._a[Ht]&&0===t._a[Rt]&&(t._nextDay=!0,t._a[Pt]=0),t._d=(t._useUTC?J:function(e,t,n,s,i,r,a){var o=new Date(e,t,n,s,i,r,a);return e<100&&e>=0&&isFinite(o.getFullYear())&&o.setFullYear(e),o}).apply(null,o),r=t._useUTC?t._d.getUTCDay():t._d.getDay(),null!=t._tzm&&t._d.setUTCMinutes(t._d.getUTCMinutes()-t._tzm),t._nextDay&&(t._a[Pt]=24),t._w&&void 0!==t._w.d&&t._w.d!==r&&(d(t).weekdayMismatch=!0)}}function ce(e){var t,n,s,i,r,a,o=e._i,u=en.exec(o)||tn.exec(o);if(u){for(d(e).iso=!0,t=0,n=sn.length;t<n;t++)if(sn[t][1].exec(u[1])){i=sn[t][0],s=!1!==sn[t][2];break}if(null==i)return void(e._isValid=!1);if(u[3]){for(t=0,n=rn.length;t<n;t++)if(rn[t][1].exec(u[3])){r=(u[2]||" ")+rn[t][0];break}if(null==r)return void(e._isValid=!1)}if(!s&&null!=r)return void(e._isValid=!1);if(u[4]){if(!nn.exec(u[4]))return void(e._isValid=!1);a="Z"}e._f=i+(r||"")+(a||""),_e(e)}else e._isValid=!1}function fe(e,t,n,s,i,r){var a=[function(e){var t=parseInt(e,10);{if(t<=49)return 2e3+t;if(t<=999)return 1900+t}return t}(e),Vt.indexOf(t),parseInt(n,10),parseInt(s,10),parseInt(i,10)];return r&&a.push(parseInt(r,10)),a}function me(e){var t=on.exec(function(e){return e.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim()}(e._i));if(t){var n=fe(t[4],t[3],t[2],t[5],t[6],t[7]);if(!function(e,t,n){if(e&&jt.indexOf(e)!==new Date(t[0],t[1],t[2]).getDay())return d(n).weekdayMismatch=!0,n._isValid=!1,!1;return!0}(t[1],n,e))return;e._a=n,e._tzm=function(e,t,n){if(e)return un[e];if(t)return 0;var s=parseInt(n,10),i=s%100;return(s-i)/100*60+i}(t[8],t[9],t[10]),e._d=J.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),d(e).rfc2822=!0}else e._isValid=!1}function _e(t){if(t._f!==e.ISO_8601)if(t._f!==e.RFC_2822){t._a=[],d(t).empty=!0;var n,s,i,r,a,o=""+t._i,u=o.length,l=0;for(i=R(t._f,t._locale).match(rt)||[],n=0;n<i.length;n++)r=i[n],(s=(o.match(F(r,t))||[])[0])&&((a=o.substr(0,o.indexOf(s))).length>0&&d(t).unusedInput.push(a),o=o.slice(o.indexOf(s)+s.length),l+=s.length),ut[r]?(s?d(t).empty=!1:d(t).unusedTokens.push(r),G(r,s,t)):t._strict&&!s&&d(t).unusedTokens.push(r);d(t).charsLeftOver=u-l,o.length>0&&d(t).unusedInput.push(o),t._a[Pt]<=12&&!0===d(t).bigHour&&t._a[Pt]>0&&(d(t).bigHour=void 0),d(t).parsedDateParts=t._a.slice(0),d(t).meridiem=t._meridiem,t._a[Pt]=function(e,t,n){var s;if(null==n)return t;return null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?((s=e.isPM(n))&&t<12&&(t+=12),s||12!==t||(t=0),t):t}(t._locale,t._a[Pt],t._meridiem),he(t),le(t)}else me(t);else ce(t)}function ye(o){var l=o._i,y=o._f;return o._locale=o._locale||ue(o._l),null===l||void 0===y&&""===l?c({nullInput:!0}):("string"==typeof l&&(o._i=l=o._locale.preparse(l)),_(l)?new m(le(l)):(r(l)?o._d=l:t(y)?function(e){var t,n,s,i,r;if(0===e._f.length)return d(e).invalidFormat=!0,void(e._d=new Date(NaN));for(i=0;i<e._f.length;i++)r=0,t=f({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[i],_e(t),h(t)&&(r+=d(t).charsLeftOver,r+=10*d(t).unusedTokens.length,d(t).score=r,(null==s||r<s)&&(s=r,n=t));u(e,n||t)}(o):y?_e(o):function(o){var u=o._i;s(u)?o._d=new Date(e.now()):r(u)?o._d=new Date(u.valueOf()):"string"==typeof u?function(t){var n=an.exec(t._i);null===n?(ce(t),!1===t._isValid&&(delete t._isValid,me(t),!1===t._isValid&&(delete t._isValid,e.createFromInputFallback(t)))):t._d=new Date(+n[1])}(o):t(u)?(o._a=a(u.slice(0),function(e){return parseInt(e,10)}),he(o)):n(u)?function(e){if(!e._d){var t=T(e._i);e._a=a([t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],function(e){return e&&parseInt(e,10)}),he(e)}}(o):i(u)?o._d=new Date(u):e.createFromInputFallback(o)}(o),h(o)||(o._d=null),o))}function ge(e,s,i,r,a){var o={};return!0!==i&&!1!==i||(r=i,i=void 0),(n(e)&&function(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;var t;for(t in e)if(e.hasOwnProperty(t))return!1;return!0}(e)||t(e)&&0===e.length)&&(e=void 0),o._isAMomentObject=!0,o._useUTC=o._isUTC=a,o._l=i,o._i=e,o._f=s,o._strict=r,function(e){var t=new m(le(ye(e)));return t._nextDay&&(t.add(1,"d"),t._nextDay=void 0),t}(o)}function pe(e,t,n,s){return ge(e,t,n,s,!1)}function we(e,n){var s,i;if(1===n.length&&t(n[0])&&(n=n[0]),!n.length)return pe();for(s=n[0],i=1;i<n.length;++i)n[i].isValid()&&!n[i][e](s)||(s=n[i]);return s}function ve(e){var t=T(e),n=t.year||0,s=t.quarter||0,i=t.month||0,r=t.week||0,a=t.day||0,o=t.hour||0,u=t.minute||0,l=t.second||0,d=t.millisecond||0;this._isValid=function(e){for(var t in e)if(-1===Ut.call(hn,t)||null!=e[t]&&isNaN(e[t]))return!1;for(var n=!1,s=0;s<hn.length;++s)if(e[hn[s]]){if(n)return!1;parseFloat(e[hn[s]])!==g(e[hn[s]])&&(n=!0)}return!0}(t),this._milliseconds=+d+1e3*l+6e4*u+1e3*o*60*60,this._days=+a+7*r,this._months=+i+3*s+12*n,this._data={},this._locale=ue(),this._bubble()}function Me(e){return e instanceof ve}function Se(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function De(e,t){P(e,0,0,function(){var e=this.utcOffset(),n="+";return e<0&&(e=-e,n="-"),n+b(~~(e/60),2)+t+b(~~e%60,2)})}function ke(e,t){var n=(t||"").match(e);if(null===n)return null;var s=((n[n.length-1]||[])+"").match(cn)||["-",0,0],i=60*s[1]+g(s[2]);return 0===i?0:"+"===s[0]?i:-i}function Ye(t,n){var s,i;return n._isUTC?(s=n.clone(),i=(_(t)||r(t)?t.valueOf():pe(t).valueOf())-s.valueOf(),s._d.setTime(s._d.valueOf()+i),e.updateOffset(s,!1),s):pe(t).local()}function Oe(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function Te(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}function xe(e,t){var n,s,r,a=e,u=null;return Me(e)?a={ms:e._milliseconds,d:e._days,M:e._months}:i(e)?(a={},t?a[t]=e:a.milliseconds=e):(u=fn.exec(e))?(n="-"===u[1]?-1:1,a={y:0,d:g(u[bt])*n,h:g(u[Pt])*n,m:g(u[Wt])*n,s:g(u[Ht])*n,ms:g(Se(1e3*u[Rt]))*n}):(u=mn.exec(e))?(n="-"===u[1]?-1:(u[1],1),a={y:be(u[2],n),M:be(u[3],n),w:be(u[4],n),d:be(u[5],n),h:be(u[6],n),m:be(u[7],n),s:be(u[8],n)}):null==a?a={}:"object"==typeof a&&("from"in a||"to"in a)&&(r=function(e,t){var n;if(!e.isValid()||!t.isValid())return{milliseconds:0,months:0};t=Ye(t,e),e.isBefore(t)?n=Pe(e,t):((n=Pe(t,e)).milliseconds=-n.milliseconds,n.months=-n.months);return n}(pe(a.from),pe(a.to)),(a={}).ms=r.milliseconds,a.M=r.months),s=new ve(a),Me(e)&&o(e,"_locale")&&(s._locale=e._locale),s}function be(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function Pe(e,t){var n={milliseconds:0,months:0};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function We(e,t){return function(n,s){var i,r;return null===s||isNaN(+s)||(M(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),r=n,n=s,s=r),n="string"==typeof n?+n:n,i=xe(n,s),He(this,i,e),this}}function He(t,n,s,i){var r=n._milliseconds,a=Se(n._days),o=Se(n._months);t.isValid()&&(i=null==i||i,o&&z(t,A(t,"Month")+o*s),a&&j(t,"Date",A(t,"Date")+a*s),r&&t._d.setTime(t._d.valueOf()+r*s),i&&e.updateOffset(t,a||o))}function Re(e,t){var n,s=12*(t.year()-e.year())+(t.month()-e.month()),i=e.clone().add(s,"months");return n=t-i<0?(t-i)/(i-e.clone().add(s-1,"months")):(t-i)/(e.clone().add(s+1,"months")-i),-(s+n)||0}function Ce(e){var t;return void 0===e?this._locale._abbr:(null!=(t=ue(e))&&(this._locale=t),this)}function Fe(){return this._locale}function Ue(e,t){P(0,[e,e.length],0,t)}function Le(e,t,n,s,i){var r;return null==e?X(this,s,i).year:(r=K(e,s,i),t>r&&(t=r),function(e,t,n,s,i){var r=Q(e,t,n,s,i),a=J(r.year,0,r.dayOfYear);return this.year(a.getUTCFullYear()),this.month(a.getUTCMonth()),this.date(a.getUTCDate()),this}.call(this,e,t,n,s,i))}function Ne(e,t){t[Rt]=g(1e3*("0."+e))}function Ge(e){return e}function Ve(e,t,n,s){var i=ue(),r=l().set(s,t);return i[n](r,e)}function Ee(e,t,n){if(i(e)&&(t=e,e=void 0),e=e||"",null!=t)return Ve(e,t,n,"month");var s,r=[];for(s=0;s<12;s++)r[s]=Ve(e,s,n,"month");return r}function Ie(e,t,n,s){"boolean"==typeof e?(i(t)&&(n=t,t=void 0),t=t||""):(n=t=e,e=!1,i(t)&&(n=t,t=void 0),t=t||"");var r=ue(),a=e?r._week.dow:0;if(null!=n)return Ve(t,(n+a)%7,s,"day");var o,u=[];for(o=0;o<7;o++)u[o]=Ve(t,(o+a)%7,s,"day");return u}function Ae(e,t,n,s){var i=xe(t,n);return e._milliseconds+=s*i._milliseconds,e._days+=s*i._days,e._months+=s*i._months,e._bubble()}function je(e){return e<0?Math.floor(e):Math.ceil(e)}function Ze(e){return 4800*e/146097}function ze(e){return 146097*e/4800}function $e(e){return function(){return this.as(e)}}function qe(e){return function(){return this.isValid()?this._data[e]:NaN}}function Je(e){return(e>0)-(e<0)||+e}function Be(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n=An(this._milliseconds)/1e3,s=An(this._days),i=An(this._months);t=y((e=y(n/60))/60),n%=60,e%=60;var r=y(i/12),a=i%=12,o=s,u=t,l=e,d=n?n.toFixed(3).replace(/\.?0+$/,""):"",h=this.asSeconds();if(!h)return"P0D";var c=h<0?"-":"",f=Je(this._months)!==Je(h)?"-":"",m=Je(this._days)!==Je(h)?"-":"",_=Je(this._milliseconds)!==Je(h)?"-":"";return c+"P"+(r?f+r+"Y":"")+(a?f+a+"M":"")+(o?m+o+"D":"")+(u||l||d?"T":"")+(u?_+u+"H":"")+(l?_+l+"M":"")+(d?_+d+"S":"")}var Qe,Xe;Xe=Array.prototype.some?Array.prototype.some:function(e){for(var t=Object(this),n=t.length>>>0,s=0;s<n;s++)if(s in t&&e.call(this,t[s],s,t))return!0;return!1};var Ke=e.momentProperties=[],et=!1,tt={};e.suppressDeprecationWarnings=!1,e.deprecationHandler=null;var nt;nt=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)o(e,t)&&n.push(t);return n};var st={},it={},rt=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,at=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,ot={},ut={},lt=/\d/,dt=/\d\d/,ht=/\d{3}/,ct=/\d{4}/,ft=/[+-]?\d{6}/,mt=/\d\d?/,_t=/\d\d\d\d?/,yt=/\d\d\d\d\d\d?/,gt=/\d{1,3}/,pt=/\d{1,4}/,wt=/[+-]?\d{1,6}/,vt=/\d+/,Mt=/[+-]?\d+/,St=/Z|[+-]\d\d:?\d\d/gi,Dt=/Z|[+-]\d\d(?::?\d\d)?/gi,kt=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,Yt={},Ot={},Tt=0,xt=1,bt=2,Pt=3,Wt=4,Ht=5,Rt=6,Ct=7,Ft=8;P("Y",0,0,function(){var e=this.year();return e<=9999?""+e:"+"+e}),P(0,["YY",2],0,function(){return this.year()%100}),P(0,["YYYY",4],0,"year"),P(0,["YYYYY",5],0,"year"),P(0,["YYYYYY",6,!0],0,"year"),Y("year","y"),x("year",1),C("Y",Mt),C("YY",mt,dt),C("YYYY",pt,ct),C("YYYYY",wt,ft),C("YYYYYY",wt,ft),L(["YYYYY","YYYYYY"],Tt),L("YYYY",function(t,n){n[Tt]=2===t.length?e.parseTwoDigitYear(t):g(t)}),L("YY",function(t,n){n[Tt]=e.parseTwoDigitYear(t)}),L("Y",function(e,t){t[Tt]=parseInt(e,10)}),e.parseTwoDigitYear=function(e){return g(e)+(g(e)>68?1900:2e3)};var Ut,Lt=I("FullYear",!0);Ut=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},P("M",["MM",2],"Mo",function(){return this.month()+1}),P("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),P("MMMM",0,0,function(e){return this.localeData().months(this,e)}),Y("month","M"),x("month",8),C("M",mt),C("MM",mt,dt),C("MMM",function(e,t){return t.monthsShortRegex(e)}),C("MMMM",function(e,t){return t.monthsRegex(e)}),L(["M","MM"],function(e,t){t[xt]=g(e)-1}),L(["MMM","MMMM"],function(e,t,n,s){var i=n._locale.monthsParse(e,s,n._strict);null!=i?t[xt]=i:d(n).invalidMonth=e});var Nt=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,Gt="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Vt="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),Et=kt,It=kt;P("w",["ww",2],"wo","week"),P("W",["WW",2],"Wo","isoWeek"),Y("week","w"),Y("isoWeek","W"),x("week",5),x("isoWeek",5),C("w",mt),C("ww",mt,dt),C("W",mt),C("WW",mt,dt),N(["w","ww","W","WW"],function(e,t,n,s){t[s.substr(0,1)]=g(e)});P("d",0,"do","day"),P("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),P("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),P("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),P("e",0,0,"weekday"),P("E",0,0,"isoWeekday"),Y("day","d"),Y("weekday","e"),Y("isoWeekday","E"),x("day",11),x("weekday",11),x("isoWeekday",11),C("d",mt),C("e",mt),C("E",mt),C("dd",function(e,t){return t.weekdaysMinRegex(e)}),C("ddd",function(e,t){return t.weekdaysShortRegex(e)}),C("dddd",function(e,t){return t.weekdaysRegex(e)}),N(["dd","ddd","dddd"],function(e,t,n,s){var i=n._locale.weekdaysParse(e,s,n._strict);null!=i?t.d=i:d(n).invalidWeekday=e}),N(["d","e","E"],function(e,t,n,s){t[s]=g(e)});var At="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),jt="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Zt="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),zt=kt,$t=kt,qt=kt;P("H",["HH",2],0,"hour"),P("h",["hh",2],0,te),P("k",["kk",2],0,function(){return this.hours()||24}),P("hmm",0,0,function(){return""+te.apply(this)+b(this.minutes(),2)}),P("hmmss",0,0,function(){return""+te.apply(this)+b(this.minutes(),2)+b(this.seconds(),2)}),P("Hmm",0,0,function(){return""+this.hours()+b(this.minutes(),2)}),P("Hmmss",0,0,function(){return""+this.hours()+b(this.minutes(),2)+b(this.seconds(),2)}),ne("a",!0),ne("A",!1),Y("hour","h"),x("hour",13),C("a",se),C("A",se),C("H",mt),C("h",mt),C("k",mt),C("HH",mt,dt),C("hh",mt,dt),C("kk",mt,dt),C("hmm",_t),C("hmmss",yt),C("Hmm",_t),C("Hmmss",yt),L(["H","HH"],Pt),L(["k","kk"],function(e,t,n){var s=g(e);t[Pt]=24===s?0:s}),L(["a","A"],function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e}),L(["h","hh"],function(e,t,n){t[Pt]=g(e),d(n).bigHour=!0}),L("hmm",function(e,t,n){var s=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s)),d(n).bigHour=!0}),L("hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s,2)),t[Ht]=g(e.substr(i)),d(n).bigHour=!0}),L("Hmm",function(e,t,n){var s=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s))}),L("Hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s,2)),t[Ht]=g(e.substr(i))});var Jt,Bt=I("Hours",!0),Qt={calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},invalidDate:"Invalid date",ordinal:"%d",dayOfMonthOrdinalParse:/\d{1,2}/,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},months:Gt,monthsShort:Vt,week:{dow:0,doy:6},weekdays:At,weekdaysMin:Zt,weekdaysShort:jt,meridiemParse:/[ap]\.?m?\.?/i},Xt={},Kt={},en=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,tn=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,nn=/Z|[+-]\d\d(?::?\d\d)?/,sn=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],rn=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],an=/^\/?Date\((\-?\d+)/i,on=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,un={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};e.createFromInputFallback=v("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),e.ISO_8601=function(){},e.RFC_2822=function(){};var ln=v("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=pe.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:c()}),dn=v("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=pe.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:c()}),hn=["year","quarter","month","week","day","hour","minute","second","millisecond"];De("Z",":"),De("ZZ",""),C("Z",Dt),C("ZZ",Dt),L(["Z","ZZ"],function(e,t,n){n._useUTC=!0,n._tzm=ke(Dt,e)});var cn=/([\+\-]|\d\d)/gi;e.updateOffset=function(){};var fn=/^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,mn=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;xe.fn=ve.prototype,xe.invalid=function(){return xe(NaN)};var _n=We(1,"add"),yn=We(-1,"subtract");e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",e.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var gn=v("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});P(0,["gg",2],0,function(){return this.weekYear()%100}),P(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Ue("gggg","weekYear"),Ue("ggggg","weekYear"),Ue("GGGG","isoWeekYear"),Ue("GGGGG","isoWeekYear"),Y("weekYear","gg"),Y("isoWeekYear","GG"),x("weekYear",1),x("isoWeekYear",1),C("G",Mt),C("g",Mt),C("GG",mt,dt),C("gg",mt,dt),C("GGGG",pt,ct),C("gggg",pt,ct),C("GGGGG",wt,ft),C("ggggg",wt,ft),N(["gggg","ggggg","GGGG","GGGGG"],function(e,t,n,s){t[s.substr(0,2)]=g(e)}),N(["gg","GG"],function(t,n,s,i){n[i]=e.parseTwoDigitYear(t)}),P("Q",0,"Qo","quarter"),Y("quarter","Q"),x("quarter",7),C("Q",lt),L("Q",function(e,t){t[xt]=3*(g(e)-1)}),P("D",["DD",2],"Do","date"),Y("date","D"),x("date",9),C("D",mt),C("DD",mt,dt),C("Do",function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient}),L(["D","DD"],bt),L("Do",function(e,t){t[bt]=g(e.match(mt)[0])});var pn=I("Date",!0);P("DDD",["DDDD",3],"DDDo","dayOfYear"),Y("dayOfYear","DDD"),x("dayOfYear",4),C("DDD",gt),C("DDDD",ht),L(["DDD","DDDD"],function(e,t,n){n._dayOfYear=g(e)}),P("m",["mm",2],0,"minute"),Y("minute","m"),x("minute",14),C("m",mt),C("mm",mt,dt),L(["m","mm"],Wt);var wn=I("Minutes",!1);P("s",["ss",2],0,"second"),Y("second","s"),x("second",15),C("s",mt),C("ss",mt,dt),L(["s","ss"],Ht);var vn=I("Seconds",!1);P("S",0,0,function(){return~~(this.millisecond()/100)}),P(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),P(0,["SSS",3],0,"millisecond"),P(0,["SSSS",4],0,function(){return 10*this.millisecond()}),P(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),P(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),P(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),P(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),P(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),Y("millisecond","ms"),x("millisecond",16),C("S",gt,lt),C("SS",gt,dt),C("SSS",gt,ht);var Mn;for(Mn="SSSS";Mn.length<=9;Mn+="S")C(Mn,vt);for(Mn="S";Mn.length<=9;Mn+="S")L(Mn,Ne);var Sn=I("Milliseconds",!1);P("z",0,0,"zoneAbbr"),P("zz",0,0,"zoneName");var Dn=m.prototype;Dn.add=_n,Dn.calendar=function(t,n){var s=t||pe(),i=Ye(s,this).startOf("day"),r=e.calendarFormat(this,i)||"sameElse",a=n&&(S(n[r])?n[r].call(this,s):n[r]);return this.format(a||this.localeData().calendar(r,this,pe(s)))},Dn.clone=function(){return new m(this)},Dn.diff=function(e,t,n){var s,i,r;if(!this.isValid())return NaN;if(!(s=Ye(e,this)).isValid())return NaN;switch(i=6e4*(s.utcOffset()-this.utcOffset()),t=O(t)){case"year":r=Re(this,s)/12;break;case"month":r=Re(this,s);break;case"quarter":r=Re(this,s)/3;break;case"second":r=(this-s)/1e3;break;case"minute":r=(this-s)/6e4;break;case"hour":r=(this-s)/36e5;break;case"day":r=(this-s-i)/864e5;break;case"week":r=(this-s-i)/6048e5;break;default:r=this-s}return n?r:y(r)},Dn.endOf=function(e){return void 0===(e=O(e))||"millisecond"===e?this:("date"===e&&(e="day"),this.startOf(e).add(1,"isoWeek"===e?"week":e).subtract(1,"ms"))},Dn.format=function(t){t||(t=this.isUtc()?e.defaultFormatUtc:e.defaultFormat);var n=H(this,t);return this.localeData().postformat(n)},Dn.from=function(e,t){return this.isValid()&&(_(e)&&e.isValid()||pe(e).isValid())?xe({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},Dn.fromNow=function(e){return this.from(pe(),e)},Dn.to=function(e,t){return this.isValid()&&(_(e)&&e.isValid()||pe(e).isValid())?xe({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},Dn.toNow=function(e){return this.to(pe(),e)},Dn.get=function(e){return e=O(e),S(this[e])?this[e]():this},Dn.invalidAt=function(){return d(this).overflow},Dn.isAfter=function(e,t){var n=_(e)?e:pe(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=O(s(t)?"millisecond":t))?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf())},Dn.isBefore=function(e,t){var n=_(e)?e:pe(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=O(s(t)?"millisecond":t))?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf())},Dn.isBetween=function(e,t,n,s){return("("===(s=s||"()")[0]?this.isAfter(e,n):!this.isBefore(e,n))&&(")"===s[1]?this.isBefore(t,n):!this.isAfter(t,n))},Dn.isSame=function(e,t){var n,s=_(e)?e:pe(e);return!(!this.isValid()||!s.isValid())&&("millisecond"===(t=O(t||"millisecond"))?this.valueOf()===s.valueOf():(n=s.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf()))},Dn.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)},Dn.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)},Dn.isValid=function(){return h(this)},Dn.lang=gn,Dn.locale=Ce,Dn.localeData=Fe,Dn.max=dn,Dn.min=ln,Dn.parsingFlags=function(){return u({},d(this))},Dn.set=function(e,t){if("object"==typeof e)for(var n=function(e){var t=[];for(var n in e)t.push({unit:n,priority:it[n]});return t.sort(function(e,t){return e.priority-t.priority}),t}(e=T(e)),s=0;s<n.length;s++)this[n[s].unit](e[n[s].unit]);else if(e=O(e),S(this[e]))return this[e](t);return this},Dn.startOf=function(e){switch(e=O(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e&&this.weekday(0),"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this},Dn.subtract=yn,Dn.toArray=function(){return[this.year(),this.month(),this.date(),this.hour(),this.minute(),this.second(),this.millisecond()]},Dn.toObject=function(){return{years:this.year(),months:this.month(),date:this.date(),hours:this.hours(),minutes:this.minutes(),seconds:this.seconds(),milliseconds:this.milliseconds()}},Dn.toDate=function(){return new Date(this.valueOf())},Dn.toISOString=function(e){if(!this.isValid())return null;var t=!0!==e,n=t?this.clone().utc():this;return n.year()<0||n.year()>9999?H(n,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):S(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this._d.valueOf()).toISOString().replace("Z",H(n,"Z")):H(n,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")},Dn.inspect=function(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e="moment",t="";this.isLocal()||(e=0===this.utcOffset()?"moment.utc":"moment.parseZone",t="Z");var n="["+e+'("]',s=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",i=t+'[")]';return this.format(n+s+"-MM-DD[T]HH:mm:ss.SSS"+i)},Dn.toJSON=function(){return this.isValid()?this.toISOString():null},Dn.toString=function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},Dn.unix=function(){return Math.floor(this.valueOf()/1e3)},Dn.valueOf=function(){return this._d.valueOf()-6e4*(this._offset||0)},Dn.creationData=function(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}},Dn.year=Lt,Dn.isLeapYear=function(){return E(this.year())},Dn.weekYear=function(e){return Le.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)},Dn.isoWeekYear=function(e){return Le.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)},Dn.quarter=Dn.quarters=function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},Dn.month=$,Dn.daysInMonth=function(){return Z(this.year(),this.month())},Dn.week=Dn.weeks=function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},Dn.isoWeek=Dn.isoWeeks=function(e){var t=X(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},Dn.weeksInYear=function(){var e=this.localeData()._week;return K(this.year(),e.dow,e.doy)},Dn.isoWeeksInYear=function(){return K(this.year(),1,4)},Dn.date=pn,Dn.day=Dn.days=function(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=function(e,t){return"string"!=typeof e?e:isNaN(e)?"number"==typeof(e=t.weekdaysParse(e))?e:null:parseInt(e,10)}(e,this.localeData()),this.add(e-t,"d")):t},Dn.weekday=function(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},Dn.isoWeekday=function(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var t=function(e,t){return"string"==typeof e?t.weekdaysParse(e)%7||7:isNaN(e)?null:e}(e,this.localeData());return this.day(this.day()%7?t:t-7)}return this.day()||7},Dn.dayOfYear=function(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},Dn.hour=Dn.hours=Bt,Dn.minute=Dn.minutes=wn,Dn.second=Dn.seconds=vn,Dn.millisecond=Dn.milliseconds=Sn,Dn.utcOffset=function(t,n,s){var i,r=this._offset||0;if(!this.isValid())return null!=t?this:NaN;if(null!=t){if("string"==typeof t){if(null===(t=ke(Dt,t)))return this}else Math.abs(t)<16&&!s&&(t*=60);return!this._isUTC&&n&&(i=Oe(this)),this._offset=t,this._isUTC=!0,null!=i&&this.add(i,"m"),r!==t&&(!n||this._changeInProgress?He(this,xe(t-r,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,e.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?r:Oe(this)},Dn.utc=function(e){return this.utcOffset(0,e)},Dn.local=function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Oe(this),"m")),this},Dn.parseZone=function(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var e=ke(St,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this},Dn.hasAlignedHourOffset=function(e){return!!this.isValid()&&(e=e?pe(e).utcOffset():0,(this.utcOffset()-e)%60==0)},Dn.isDST=function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},Dn.isLocal=function(){return!!this.isValid()&&!this._isUTC},Dn.isUtcOffset=function(){return!!this.isValid()&&this._isUTC},Dn.isUtc=Te,Dn.isUTC=Te,Dn.zoneAbbr=function(){return this._isUTC?"UTC":""},Dn.zoneName=function(){return this._isUTC?"Coordinated Universal Time":""},Dn.dates=v("dates accessor is deprecated. Use date instead.",pn),Dn.months=v("months accessor is deprecated. Use month instead",$),Dn.years=v("years accessor is deprecated. Use year instead",Lt),Dn.zone=v("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",function(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}),Dn.isDSTShifted=v("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",function(){if(!s(this._isDSTShifted))return this._isDSTShifted;var e={};if(f(e,this),(e=ye(e))._a){var t=e._isUTC?l(e._a):pe(e._a);this._isDSTShifted=this.isValid()&&p(e._a,t.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted});var kn=k.prototype;kn.calendar=function(e,t,n){var s=this._calendar[e]||this._calendar.sameElse;return S(s)?s.call(t,n):s},kn.longDateFormat=function(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e])},kn.invalidDate=function(){return this._invalidDate},kn.ordinal=function(e){return this._ordinal.replace("%d",e)},kn.preparse=Ge,kn.postformat=Ge,kn.relativeTime=function(e,t,n,s){var i=this._relativeTime[n];return S(i)?i(e,t,n,s):i.replace(/%d/i,e)},kn.pastFuture=function(e,t){var n=this._relativeTime[e>0?"future":"past"];return S(n)?n(t):n.replace(/%s/i,t)},kn.set=function(e){var t,n;for(n in e)S(t=e[n])?this[n]=t:this["_"+n]=t;this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)},kn.months=function(e,n){return e?t(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||Nt).test(n)?"format":"standalone"][e.month()]:t(this._months)?this._months:this._months.standalone},kn.monthsShort=function(e,n){return e?t(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[Nt.test(n)?"format":"standalone"][e.month()]:t(this._monthsShort)?this._monthsShort:this._monthsShort.standalone},kn.monthsParse=function(e,t,n){var s,i,r;if(this._monthsParseExact)return function(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],s=0;s<12;++s)r=l([2e3,s]),this._shortMonthsParse[s]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[s]=this.months(r,"").toLocaleLowerCase();return n?"MMM"===t?-1!==(i=Ut.call(this._shortMonthsParse,a))?i:null:-1!==(i=Ut.call(this._longMonthsParse,a))?i:null:"MMM"===t?-1!==(i=Ut.call(this._shortMonthsParse,a))?i:-1!==(i=Ut.call(this._longMonthsParse,a))?i:null:-1!==(i=Ut.call(this._longMonthsParse,a))?i:-1!==(i=Ut.call(this._shortMonthsParse,a))?i:null}.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;s<12;s++){if(i=l([2e3,s]),n&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(i,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(i,"").replace(".","")+"$","i")),n||this._monthsParse[s]||(r="^"+this.months(i,"")+"|^"+this.monthsShort(i,""),this._monthsParse[s]=new RegExp(r.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[s].test(e))return s;if(n&&"MMM"===t&&this._shortMonthsParse[s].test(e))return s;if(!n&&this._monthsParse[s].test(e))return s}},kn.monthsRegex=function(e){return this._monthsParseExact?(o(this,"_monthsRegex")||q.call(this),e?this._monthsStrictRegex:this._monthsRegex):(o(this,"_monthsRegex")||(this._monthsRegex=It),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)},kn.monthsShortRegex=function(e){return this._monthsParseExact?(o(this,"_monthsRegex")||q.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(o(this,"_monthsShortRegex")||(this._monthsShortRegex=Et),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)},kn.week=function(e){return X(e,this._week.dow,this._week.doy).week},kn.firstDayOfYear=function(){return this._week.doy},kn.firstDayOfWeek=function(){return this._week.dow},kn.weekdays=function(e,n){return e?t(this._weekdays)?this._weekdays[e.day()]:this._weekdays[this._weekdays.isFormat.test(n)?"format":"standalone"][e.day()]:t(this._weekdays)?this._weekdays:this._weekdays.standalone},kn.weekdaysMin=function(e){return e?this._weekdaysMin[e.day()]:this._weekdaysMin},kn.weekdaysShort=function(e){return e?this._weekdaysShort[e.day()]:this._weekdaysShort},kn.weekdaysParse=function(e,t,n){var s,i,r;if(this._weekdaysParseExact)return function(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],s=0;s<7;++s)r=l([2e3,1]).day(s),this._minWeekdaysParse[s]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[s]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[s]=this.weekdays(r,"").toLocaleLowerCase();return n?"dddd"===t?-1!==(i=Ut.call(this._weekdaysParse,a))?i:null:"ddd"===t?-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:null:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:null:"dddd"===t?-1!==(i=Ut.call(this._weekdaysParse,a))?i:-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:null:"ddd"===t?-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:-1!==(i=Ut.call(this._weekdaysParse,a))?i:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:null:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:-1!==(i=Ut.call(this._weekdaysParse,a))?i:-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:null}.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),s=0;s<7;s++){if(i=l([2e3,1]).day(s),n&&!this._fullWeekdaysParse[s]&&(this._fullWeekdaysParse[s]=new RegExp("^"+this.weekdays(i,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[s]=new RegExp("^"+this.weekdaysShort(i,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[s]=new RegExp("^"+this.weekdaysMin(i,"").replace(".",".?")+"$","i")),this._weekdaysParse[s]||(r="^"+this.weekdays(i,"")+"|^"+this.weekdaysShort(i,"")+"|^"+this.weekdaysMin(i,""),this._weekdaysParse[s]=new RegExp(r.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[s].test(e))return s;if(n&&"ddd"===t&&this._shortWeekdaysParse[s].test(e))return s;if(n&&"dd"===t&&this._minWeekdaysParse[s].test(e))return s;if(!n&&this._weekdaysParse[s].test(e))return s}},kn.weekdaysRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||ee.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(o(this,"_weekdaysRegex")||(this._weekdaysRegex=zt),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)},kn.weekdaysShortRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||ee.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(o(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=$t),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)},kn.weekdaysMinRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||ee.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(o(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=qt),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)},kn.isPM=function(e){return"p"===(e+"").toLowerCase().charAt(0)},kn.meridiem=function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},ae("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===g(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}}),e.lang=v("moment.lang is deprecated. Use moment.locale instead.",ae),e.langData=v("moment.langData is deprecated. Use moment.localeData instead.",ue);var Yn=Math.abs,On=$e("ms"),Tn=$e("s"),xn=$e("m"),bn=$e("h"),Pn=$e("d"),Wn=$e("w"),Hn=$e("M"),Rn=$e("y"),Cn=qe("milliseconds"),Fn=qe("seconds"),Un=qe("minutes"),Ln=qe("hours"),Nn=qe("days"),Gn=qe("months"),Vn=qe("years"),En=Math.round,In={ss:44,s:45,m:45,h:22,d:26,M:11},An=Math.abs,jn=ve.prototype;return jn.isValid=function(){return this._isValid},jn.abs=function(){var e=this._data;return this._milliseconds=Yn(this._milliseconds),this._days=Yn(this._days),this._months=Yn(this._months),e.milliseconds=Yn(e.milliseconds),e.seconds=Yn(e.seconds),e.minutes=Yn(e.minutes),e.hours=Yn(e.hours),e.months=Yn(e.months),e.years=Yn(e.years),this},jn.add=function(e,t){return Ae(this,e,t,1)},jn.subtract=function(e,t){return Ae(this,e,t,-1)},jn.as=function(e){if(!this.isValid())return NaN;var t,n,s=this._milliseconds;if("month"===(e=O(e))||"year"===e)return t=this._days+s/864e5,n=this._months+Ze(t),"month"===e?n:n/12;switch(t=this._days+Math.round(ze(this._months)),e){case"week":return t/7+s/6048e5;case"day":return t+s/864e5;case"hour":return 24*t+s/36e5;case"minute":return 1440*t+s/6e4;case"second":return 86400*t+s/1e3;case"millisecond":return Math.floor(864e5*t)+s;default:throw new Error("Unknown unit "+e)}},jn.asMilliseconds=On,jn.asSeconds=Tn,jn.asMinutes=xn,jn.asHours=bn,jn.asDays=Pn,jn.asWeeks=Wn,jn.asMonths=Hn,jn.asYears=Rn,jn.valueOf=function(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*g(this._months/12):NaN},jn._bubble=function(){var e,t,n,s,i,r=this._milliseconds,a=this._days,o=this._months,u=this._data;return r>=0&&a>=0&&o>=0||r<=0&&a<=0&&o<=0||(r+=864e5*je(ze(o)+a),a=0,o=0),u.milliseconds=r%1e3,e=y(r/1e3),u.seconds=e%60,t=y(e/60),u.minutes=t%60,n=y(t/60),u.hours=n%24,a+=y(n/24),i=y(Ze(a)),o+=i,a-=je(ze(i)),s=y(o/12),o%=12,u.days=a,u.months=o,u.years=s,this},jn.clone=function(){return xe(this)},jn.get=function(e){return e=O(e),this.isValid()?this[e+"s"]():NaN},jn.milliseconds=Cn,jn.seconds=Fn,jn.minutes=Un,jn.hours=Ln,jn.days=Nn,jn.weeks=function(){return y(this.days()/7)},jn.months=Gn,jn.years=Vn,jn.humanize=function(e){if(!this.isValid())return this.localeData().invalidDate();var t=this.localeData(),n=function(e,t,n){var s=xe(e).abs(),i=En(s.as("s")),r=En(s.as("m")),a=En(s.as("h")),o=En(s.as("d")),u=En(s.as("M")),l=En(s.as("y")),d=i<=In.ss&&["s",i]||i<In.s&&["ss",i]||r<=1&&["m"]||r<In.m&&["mm",r]||a<=1&&["h"]||a<In.h&&["hh",a]||o<=1&&["d"]||o<In.d&&["dd",o]||u<=1&&["M"]||u<In.M&&["MM",u]||l<=1&&["y"]||["yy",l];return d[2]=t,d[3]=+e>0,d[4]=n,function(e,t,n,s,i){return i.relativeTime(t||1,!!n,e,s)}.apply(null,d)}(this,!e,t);return e&&(n=t.pastFuture(+this,n)),t.postformat(n)},jn.toISOString=Be,jn.toString=Be,jn.toJSON=Be,jn.locale=Ce,jn.localeData=Fe,jn.toIsoString=v("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Be),jn.lang=gn,P("X",0,0,"unix"),P("x",0,0,"valueOf"),C("x",Mt),C("X",/[+-]?\d+(\.\d{1,3})?/),L("X",function(e,t,n){n._d=new Date(1e3*parseFloat(e,10))}),L("x",function(e,t,n){n._d=new Date(g(e))}),e.version="2.20.1",function(e){Qe=e}(pe),e.fn=Dn,e.min=function(){return we("isBefore",[].slice.call(arguments,0))},e.max=function(){return we("isAfter",[].slice.call(arguments,0))},e.now=function(){return Date.now?Date.now():+new Date},e.utc=l,e.unix=function(e){return pe(1e3*e)},e.months=function(e,t){return Ee(e,t,"months")},e.isDate=r,e.locale=ae,e.invalid=c,e.duration=xe,e.isMoment=_,e.weekdays=function(e,t,n){return Ie(e,t,n,"weekdays")},e.parseZone=function(){return pe.apply(null,arguments).parseZone()},e.localeData=ue,e.isDuration=Me,e.monthsShort=function(e,t){return Ee(e,t,"monthsShort")},e.weekdaysMin=function(e,t,n){return Ie(e,t,n,"weekdaysMin")},e.defineLocale=oe,e.updateLocale=function(e,t){if(null!=t){var n,s,i=Qt;null!=(s=re(e))&&(i=s._config),(n=new k(t=D(i,t))).parentLocale=Xt[e],Xt[e]=n,ae(e)}else null!=Xt[e]&&(null!=Xt[e].parentLocale?Xt[e]=Xt[e].parentLocale:null!=Xt[e]&&delete Xt[e]);return Xt[e]},e.locales=function(){return nt(Xt)},e.weekdaysShort=function(e,t,n){return Ie(e,t,n,"weekdaysShort")},e.normalizeUnits=O,e.relativeTimeRounding=function(e){return void 0===e?En:"function"==typeof e&&(En=e,!0)},e.relativeTimeThreshold=function(e,t){return void 0!==In[e]&&(void 0===t?In[e]:(In[e]=t,"s"===e&&(In.ss=t-1),!0))},e.calendarFormat=function(e,t){var n=e.diff(t,"days",!0);return n<-6?"sameElse":n<-1?"lastWeek":n<0?"lastDay":n<1?"sameDay":n<2?"nextDay":n<7?"nextWeek":"sameElse"},e.prototype=Dn,e.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"YYYY-[W]WW",MONTH:"YYYY-MM"},e});
/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null,
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{a(jQuery)}}(function(f){var p="left",o="right",e="up",x="down",c="in",z="out",m="none",s="auto",l="swipe",t="pinch",A="tap",j="doubletap",b="longtap",y="hold",D="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled,d=window.navigator.pointerEnabled||window.navigator.msPointerEnabled,B="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe"};f.fn.swipe=function(G){var F=f(this),E=F.data(B);if(E&&typeof G==="string"){if(E[G]){return E[G].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+G+" does not exist on jQuery.swipe")}}else{if(!E&&(typeof G==="object"||!G)){return w.apply(this,arguments)}}return F};f.fn.swipe.defaults=n;f.fn.swipe.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipe.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:z};f.fn.swipe.pageScroll={NONE:m,HORIZONTAL:D,VERTICAL:u,AUTO:s};f.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:i};function w(E){if(E&&(E.allowPageScroll===undefined&&(E.swipe!==undefined||E.swipeStatus!==undefined))){E.allowPageScroll=m}if(E.click!==undefined&&E.tap===undefined){E.tap=E.click}if(!E){E={}}E=f.extend({},f.fn.swipe.defaults,E);return this.each(function(){var G=f(this);var F=G.data(B);if(!F){F=new C(this,E);G.data(B,F)}})}function C(a4,av){var az=(a||d||!av.fallbackToMouseEvents),J=az?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",ay=az?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",U=az?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",S=az?null:"mouseleave",aD=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ag=0,aP=null,ab=0,a1=0,aZ=0,G=1,aq=0,aJ=0,M=null;var aR=f(a4);var Z="start";var W=0;var aQ=null;var T=0,a2=0,a5=0,ad=0,N=0;var aW=null,af=null;try{aR.bind(J,aN);aR.bind(aD,a9)}catch(ak){f.error("events not supported "+J+","+aD+" on jQuery.swipe")}this.enable=function(){aR.bind(J,aN);aR.bind(aD,a9);return aR};this.disable=function(){aK();return aR};this.destroy=function(){aK();aR.data(B,null);return aR};this.option=function(bc,bb){if(av[bc]!==undefined){if(bb===undefined){return av[bc]}else{av[bc]=bb}}else{f.error("Option "+bc+" does not exist on jQuery.swipe.options")}return null};function aN(bd){if(aB()){return}if(f(bd.target).closest(av.excludedElements,aR).length>0){return}var be=bd.originalEvent?bd.originalEvent:bd;var bc,bb=a?be.touches[0]:be;Z=g;if(a){W=be.touches.length}else{bd.preventDefault()}ag=0;aP=null;aJ=null;ab=0;a1=0;aZ=0;G=1;aq=0;aQ=aj();M=aa();R();if(!a||(W===av.fingers||av.fingers===i)||aX()){ai(0,bb);T=at();if(W==2){ai(1,be.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}if(av.swipeStatus||av.pinchStatus){bc=O(be,Z)}}else{bc=false}if(bc===false){Z=q;O(be,Z);return bc}else{if(av.hold){af=setTimeout(f.proxy(function(){aR.trigger("hold",[be.target]);if(av.hold){bc=av.hold.call(aR,be,be.target)}},this),av.longTapThreshold)}ao(true)}return null}function a3(be){var bh=be.originalEvent?be.originalEvent:be;if(Z===h||Z===q||am()){return}var bd,bc=a?bh.touches[0]:bh;var bf=aH(bc);a2=at();if(a){W=bh.touches.length}if(av.hold){clearTimeout(af)}Z=k;if(W==2){if(a1==0){ai(1,bh.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}else{aH(bh.touches[1]);aZ=au(aQ[0].end,aQ[1].end);aJ=ar(aQ[0].end,aQ[1].end)}G=a7(a1,aZ);aq=Math.abs(a1-aZ)}if((W===av.fingers||av.fingers===i)||!a||aX()){aP=aL(bf.start,bf.end);al(be,aP);ag=aS(bf.start,bf.end);ab=aM();aI(aP,ag);if(av.swipeStatus||av.pinchStatus){bd=O(bh,Z)}if(!av.triggerOnTouchEnd||av.triggerOnTouchLeave){var bb=true;if(av.triggerOnTouchLeave){var bg=aY(this);bb=E(bf.end,bg)}if(!av.triggerOnTouchEnd&&bb){Z=aC(k)}else{if(av.triggerOnTouchLeave&&!bb){Z=aC(h)}}if(Z==q||Z==h){O(bh,Z)}}}else{Z=q;O(bh,Z)}if(bd===false){Z=q;O(bh,Z)}}function L(bb){var bc=bb.originalEvent;if(a){if(bc.touches.length>0){F();return true}}if(am()){W=ad}a2=at();ab=aM();if(ba()||!an()){Z=q;O(bc,Z)}else{if(av.triggerOnTouchEnd||(av.triggerOnTouchEnd==false&&Z===k)){bb.preventDefault();Z=h;O(bc,Z)}else{if(!av.triggerOnTouchEnd&&a6()){Z=h;aF(bc,Z,A)}else{if(Z===k){Z=q;O(bc,Z)}}}}ao(false);return null}function a9(){W=0;a2=0;T=0;a1=0;aZ=0;G=1;R();ao(false)}function K(bb){var bc=bb.originalEvent;if(av.triggerOnTouchLeave){Z=aC(h);O(bc,Z)}}function aK(){aR.unbind(J,aN);aR.unbind(aD,a9);aR.unbind(ay,a3);aR.unbind(U,L);if(S){aR.unbind(S,K)}ao(false)}function aC(bf){var be=bf;var bd=aA();var bc=an();var bb=ba();if(!bd||bb){be=q}else{if(bc&&bf==k&&(!av.triggerOnTouchEnd||av.triggerOnTouchLeave)){be=h}else{if(!bc&&bf==h&&av.triggerOnTouchLeave){be=q}}}return be}function O(bd,bb){var bc=undefined;if(I()||V()){bc=aF(bd,bb,l)}else{if((P()||aX())&&bc!==false){bc=aF(bd,bb,t)}}if(aG()&&bc!==false){bc=aF(bd,bb,j)}else{if(ap()&&bc!==false){bc=aF(bd,bb,b)}else{if(ah()&&bc!==false){bc=aF(bd,bb,A)}}}if(bb===q){a9(bd)}if(bb===h){if(a){if(bd.touches.length==0){a9(bd)}}else{a9(bd)}}return bc}function aF(be,bb,bd){var bc=undefined;if(bd==l){aR.trigger("swipeStatus",[bb,aP||null,ag||0,ab||0,W,aQ]);if(av.swipeStatus){bc=av.swipeStatus.call(aR,be,bb,aP||null,ag||0,ab||0,W,aQ);if(bc===false){return false}}if(bb==h&&aV()){aR.trigger("swipe",[aP,ag,ab,W,aQ]);if(av.swipe){bc=av.swipe.call(aR,be,aP,ag,ab,W,aQ);if(bc===false){return false}}switch(aP){case p:aR.trigger("swipeLeft",[aP,ag,ab,W,aQ]);if(av.swipeLeft){bc=av.swipeLeft.call(aR,be,aP,ag,ab,W,aQ)}break;case o:aR.trigger("swipeRight",[aP,ag,ab,W,aQ]);if(av.swipeRight){bc=av.swipeRight.call(aR,be,aP,ag,ab,W,aQ)}break;case e:aR.trigger("swipeUp",[aP,ag,ab,W,aQ]);if(av.swipeUp){bc=av.swipeUp.call(aR,be,aP,ag,ab,W,aQ)}break;case x:aR.trigger("swipeDown",[aP,ag,ab,W,aQ]);if(av.swipeDown){bc=av.swipeDown.call(aR,be,aP,ag,ab,W,aQ)}break}}}if(bd==t){aR.trigger("pinchStatus",[bb,aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchStatus){bc=av.pinchStatus.call(aR,be,bb,aJ||null,aq||0,ab||0,W,G,aQ);if(bc===false){return false}}if(bb==h&&a8()){switch(aJ){case c:aR.trigger("pinchIn",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchIn){bc=av.pinchIn.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break;case z:aR.trigger("pinchOut",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchOut){bc=av.pinchOut.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break}}}if(bd==A){if(bb===q||bb===h){clearTimeout(aW);clearTimeout(af);if(Y()&&!H()){N=at();aW=setTimeout(f.proxy(function(){N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}},this),av.doubleTapThreshold)}else{N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}}}}else{if(bd==j){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("doubletap",[be.target]);if(av.doubleTap){bc=av.doubleTap.call(aR,be,be.target)}}}else{if(bd==b){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("longtap",[be.target]);if(av.longTap){bc=av.longTap.call(aR,be,be.target)}}}}}return bc}function an(){var bb=true;if(av.threshold!==null){bb=ag>=av.threshold}return bb}function ba(){var bb=false;if(av.cancelThreshold!==null&&aP!==null){bb=(aT(aP)-ag)>=av.cancelThreshold}return bb}function ae(){if(av.pinchThreshold!==null){return aq>=av.pinchThreshold}return true}function aA(){var bb;if(av.maxTimeThreshold){if(ab>=av.maxTimeThreshold){bb=false}else{bb=true}}else{bb=true}return bb}function al(bb,bc){if(av.allowPageScroll===m||aX()){bb.preventDefault()}else{var bd=av.allowPageScroll===s;switch(bc){case p:if((av.swipeLeft&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case o:if((av.swipeRight&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case e:if((av.swipeUp&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break;case x:if((av.swipeDown&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break}}}function a8(){var bc=aO();var bb=X();var bd=ae();return bc&&bb&&bd}function aX(){return !!(av.pinchStatus||av.pinchIn||av.pinchOut)}function P(){return !!(a8()&&aX())}function aV(){var be=aA();var bg=an();var bd=aO();var bb=X();var bc=ba();var bf=!bc&&bb&&bd&&bg&&be;return bf}function V(){return !!(av.swipe||av.swipeStatus||av.swipeLeft||av.swipeRight||av.swipeUp||av.swipeDown)}function I(){return !!(aV()&&V())}function aO(){return((W===av.fingers||av.fingers===i)||!a)}function X(){return aQ[0].end.x!==0}function a6(){return !!(av.tap)}function Y(){return !!(av.doubleTap)}function aU(){return !!(av.longTap)}function Q(){if(N==null){return false}var bb=at();return(Y()&&((bb-N)<=av.doubleTapThreshold))}function H(){return Q()}function ax(){return((W===1||!a)&&(isNaN(ag)||ag<av.threshold))}function a0(){return((ab>av.longTapThreshold)&&(ag<r))}function ah(){return !!(ax()&&a6())}function aG(){return !!(Q()&&Y())}function ap(){return !!(a0()&&aU())}function F(){a5=at();ad=event.touches.length+1}function R(){a5=0;ad=0}function am(){var bb=false;if(a5){var bc=at()-a5;if(bc<=av.fingerReleaseThreshold){bb=true}}return bb}function aB(){return !!(aR.data(B+"_intouch")===true)}function ao(bb){if(bb===true){aR.bind(ay,a3);aR.bind(U,L);if(S){aR.bind(S,K)}}else{aR.unbind(ay,a3,false);aR.unbind(U,L,false);if(S){aR.unbind(S,K,false)}}aR.data(B+"_intouch",bb===true)}function ai(bc,bb){var bd=bb.identifier!==undefined?bb.identifier:0;aQ[bc].identifier=bd;aQ[bc].start.x=aQ[bc].end.x=bb.pageX||bb.clientX;aQ[bc].start.y=aQ[bc].end.y=bb.pageY||bb.clientY;return aQ[bc]}function aH(bb){var bd=bb.identifier!==undefined?bb.identifier:0;var bc=ac(bd);bc.end.x=bb.pageX||bb.clientX;bc.end.y=bb.pageY||bb.clientY;return bc}function ac(bc){for(var bb=0;bb<aQ.length;bb++){if(aQ[bb].identifier==bc){return aQ[bb]}}}function aj(){var bb=[];for(var bc=0;bc<=5;bc++){bb.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return bb}function aI(bb,bc){bc=Math.max(bc,aT(bb));M[bb].distance=bc}function aT(bb){if(M[bb]){return M[bb].distance}return undefined}function aa(){var bb={};bb[p]=aw(p);bb[o]=aw(o);bb[e]=aw(e);bb[x]=aw(x);return bb}function aw(bb){return{direction:bb,distance:0}}function aM(){return a2-T}function au(be,bd){var bc=Math.abs(be.x-bd.x);var bb=Math.abs(be.y-bd.y);return Math.round(Math.sqrt(bc*bc+bb*bb))}function a7(bb,bc){var bd=(bc/bb)*1;return bd.toFixed(2)}function ar(){if(G<1){return z}else{return c}}function aS(bc,bb){return Math.round(Math.sqrt(Math.pow(bb.x-bc.x,2)+Math.pow(bb.y-bc.y,2)))}function aE(be,bc){var bb=be.x-bc.x;var bg=bc.y-be.y;var bd=Math.atan2(bg,bb);var bf=Math.round(bd*180/Math.PI);if(bf<0){bf=360-Math.abs(bf)}return bf}function aL(bc,bb){var bd=aE(bc,bb);if((bd<=45)&&(bd>=0)){return p}else{if((bd<=360)&&(bd>=315)){return p}else{if((bd>=135)&&(bd<=225)){return o}else{if((bd>45)&&(bd<135)){return x}else{return e}}}}}function at(){var bb=new Date();return bb.getTime()}function aY(bb){bb=f(bb);var bd=bb.offset();var bc={left:bd.left,right:bd.left+bb.outerWidth(),top:bd.top,bottom:bd.top+bb.outerHeight()};return bc}function E(bb,bc){return(bb.x>bc.left&&bb.x<bc.right&&bb.y>bc.top&&bb.y<bc.bottom)}}}));
// Generated by CoffeeScript 1.6.3
/*
  FilmRoll (for jQuery)
  version: 0.1.12 (7/21/14)
  @requires $ >= v1.4

  By Noel Peden
  Examples at http://straydogstudio.github.io/film_roll

  Licensed under the MIT:
    http://www.opensource.org/licenses/mit-license.php

  Usage:
    var film_troll = new FilmRoll({container: '#container_id', OPTIONS});
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($) {
  this.FilmRoll = (function() {
    function FilmRoll(options) {
      this.options = options != null ? options : {};
      this.rotateRight = __bind(this.rotateRight, this);
      this.rotateLeft = __bind(this.rotateLeft, this);
      this.resize = __bind(this.resize, this);
      this.moveRight = __bind(this.moveRight, this);
      this.moveLeft = __bind(this.moveLeft, this);
      this.configureWidths = __bind(this.configureWidths, this);
      this.configureSwipe = __bind(this.configureSwipe, this);
      this.configureScroll = __bind(this.configureScroll, this);
      this.configureLoad = __bind(this.configureLoad, this);
      this.configureHover = __bind(this.configureHover, this);
      this.clearScroll = __bind(this.clearScroll, this);
      if (this.options.container) {
        this.div = $(this.options.container);
        if (this.div.length) {
          this.configure();
        }
      }
    }

    FilmRoll.prototype.configure = function() {
      var first_child,
        _this = this;
      this.children = this.div.children();
      this.children.wrapAll('<div class="film_roll_wrapper"></div>');
      this.children.wrapAll('<div class="film_roll_shuttle"></div>');
      this.wrapper = this.div.find('.film_roll_wrapper');
      this.shuttle = this.div.find('.film_roll_shuttle');
      this.rotation = [];
      this.shuttle.width(this.options.shuttle_width ? parseInt(this.options.shuttle_width, 10) : 10000);
      if (this.options.start_height) {
        this.wrapper.height(parseInt(this.options.start_height, 10));
      }
      if (this.options.vertical_center) {
        this.shuttle.addClass('vertical_center');
      }
      if (!(this.options.no_css === true || document.film_roll_styles_added)) {
        $("<style type='text/css'>.film_roll_wrapper{display:block;text-align:center;float:none;position:relative;top:auto;right:auto;bottom:auto;left:auto;z-index:auto;width:100%;height:100%;margin:0 !important;padding:0 !important;overflow:hidden;}.film_roll_shuttle{text-align:left;float:none;position:relative;top:0;left:0;right:auto;bottom:auto;height:100%;margin:0 !important;padding:0 !important;z-index:auto;}.film_roll_shuttle.vertical_center:before{content:'';display:inline-block;height:100%;vertical-align:middle;margin-right:-0.25em;}.film_roll_child{position:relative;display:inline-block;*display:inline;vertical-align:middle;zoom:1;}.film_roll_prev,.film_roll_next{position:absolute;top:48%;left:15px;width:40px;height:40px;margin:-20px 0 0 0;padding:0;font-size:60px;font-weight:100;line-height:30px;color:white;text-align:center;background:#222;border:3px solid white;border-radius:23px;opacity:0.5}.film_roll_prev:hover,.film_roll_next:hover{color:white;text-decoration:none;opacity:0.9}.film_roll_next{left:auto;right:15px}.film_roll_pager{text-align:center;}.film_roll_pager a{width:5px;height:5px;border:2px solid #333;border-radius:5px;display:inline-block;margin:0 5px 0 0;transition:all 1s ease}.film_roll_pager a:hover{background:#666}.film_roll_pager a.active{background:#333}.film_roll_pager span{display:none}.film_roll_pager a,a.film_roll_prev,a.film_roll_next{-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;}</style>").appendTo('head');
        document.film_roll_styles_added = true;
      }
      if (this.options.pager !== false) {
        this.pager = $('<div class="film_roll_pager">');
        this.div.append(this.pager);
        this.children.each(function(i, e) {
          var link;
          link = $("<a href='#' data-id='" + e.id + "'><span>" + (i + 1) + "</span></a>");
          _this.pager.append(link);
          return link.click(function() {
            _this.index = i;
            _this.moveToIndex(_this.index, 'best', true);
            return false;
          });
        });
      }
      this.pager_links = this.div.find('.film_roll_pager a');
      if (this.options.hover === 'scroll') {
        this.options.scroll = false;
        this.hover_in = function() {
          clearTimeout(_this.hover_timer);
          return _this.hover_timer = setTimeout(function() {
            _this.moveLeft();
            return _this.configureScroll();
          }, 300);
        };
        this.hover_out = this.clearScroll;
      } else {
        if (this.options.hover !== false) {
          this.hover_in = function() {
            clearTimeout(_this.hover_timer);
            return _this.hover_timer = setTimeout(function() {
              return _this.clearScroll();
            }, 300);
          };
          this.hover_out = this.configureScroll;
        }
      }
      if (this.options.hover !== false) {
        this.mouse_catcher = $('<div style="position:absolute; top:0; left: 0; height: 100%; width: 100%;" class="film_roll_mouse_catcher"></div>');
        this.mouse_catcher.appendTo(this.wrapper).mousemove(function() {
          _this.hover_in();
          return _this.mouse_catcher.remove();
        });
      }
      first_child = null;
      this.children.each(function(i, e) {
        var $el;
        $el = $(e);
        $el.attr('data-film-roll-child-id', i);
        $el.addClass("film_roll_child");
        return _this.rotation.push(e);
      });
      if (this.options.prev && this.options.next) {
        this.prev = $(this.options.prev);
        this.next = $(this.options.next);
      } else {
        this.wrapper.append('<a class="film_roll_prev" href="#">&lsaquo;</a>');
        this.wrapper.append('<a class="film_roll_next" href="#">&rsaquo;</a>');
        this.prev = this.div.find('.film_roll_prev');
        this.next = this.div.find('.film_roll_next');
      }
      this.prev.click(function() {
        return _this.moveRight();
      });
      this.next.click(function() {
        return _this.moveLeft();
      });
      this.index = this.options.start_index || 0;
      this.interval = this.options.interval || 4000;
      this.animation = this.options.animation || this.interval / 4;
      this.easing = this.options.easing || FilmRoll.default_easing;
      if (this.options.resize !== false) {
        $(window).resize(function() {
          return _this.resize();
        });
      }
      if (this.options.configure_load) {
        if (typeof this.options.configure_load === 'function') {
          this.options.configure_load.apply(this, arguments);
        } else {
          this.configureLoad();
        }
      } else {
        $(window).load(this.configureLoad);
      }
      if (this.options.swipe !== false) {
        this.configureSwipe();
      }
      this.div.trigger($.Event("film_roll:dom_ready"));
      return this;
    };

    FilmRoll.prototype.bestDirection = function(child, rotation_index) {
      rotation_index || (rotation_index = $.inArray(child, this.rotation));
      if (rotation_index < (this.children.length / 2)) {
        return 'right';
      } else {
        return 'left';
      }
    };

    FilmRoll.prototype.cancelClick = function(event) {
      if ($(this).hasClass('fr-no-click')) {
        event.preventDefault();
        return false;
      }
      return true;
    };

    FilmRoll.prototype.childIndex = function(child) {
      return $.inArray(child, this.children);
    };

    FilmRoll.prototype.childWidth = function(child) {
      var index;
      index = this.childIndex(child);
      return this.child_widths[index] || $(child).outerWidth(true);
    };

    FilmRoll.prototype.clearScroll = function() {
      if (this.scrolled !== false) {
        clearInterval(this.timer);
        this.scrolled = false;
      }
      return this;
    };

    FilmRoll.prototype.configureHover = function() {
      this.div.hover(this.hover_in, this.hover_out);
      if (this.options.prev && this.options.next) {
        this.prev.hover(this.hover_in, this.hover_out);
        return this.next.hover(this.hover_in, this.hover_out);
      }
    };

    FilmRoll.prototype.configureLoad = function() {
      this.configureWidths();
      this.moveToIndex(this.index, 'right', true);
      if (this.options.hover === 'scroll') {
        this.options.scroll = false;
        return this.configureHover();
      } else if (this.options.scroll !== false) {
        this.configureScroll();
        if (this.options.hover !== false) {
          return this.configureHover();
        }
      }
    };

    FilmRoll.prototype.configureScroll = function() {
      var _this = this;
      if (this.scrolled !== true) {
        this.timer = setInterval(function() {
          return _this.moveLeft();
        }, this.interval);
        this.scrolled = true;
      }
      return this;
    };

    FilmRoll.prototype.configureSwipe = function() {
      var _this = this;
      if (typeof $.fn.swipe !== 'undefined') {
        this.div.swipe({
          swipeStatus: function(event, phase, direction, distance) {
            var rotation_index, wrapper_width;
            if (direction === 'up' || direction === 'down') {
              return false;
            }
            if (phase === 'start') {
              wrapper_width = _this.wrapper.width();
              if (wrapper_width >= _this.real_width || _this.children.length === 1) {
                return false;
              }
              _this.was_scrolled = _this.scrolled;
              if (_this.scrolled) {
                _this.clearScroll();
              }
              _this.active_half = _this.child_widths[_this.index] / 100; // used to be 2, set to 100 to kill the over half requirement
              rotation_index = $.inArray(_this.children[_this.index], _this.rotation);
              _this.offscreen_left = parseInt(_this.shuttle.css('left'), 10);
              _this.offscreen_right = _this.marginRight(rotation_index) - (wrapper_width - _this.child_widths[_this.index]) / 2;
              _this.div.find('a').addClass('fr-no-click');
            } else if (phase === 'move') {
              if (direction === 'left') {
                if (distance > _this.active_half) {
                  $(_this.children[_this.index]).removeClass('active');
                  _this.index = (_this.index + 1) % _this.children.length;
                  $(_this.children[_this.index]).addClass('active');
                  _this.active_half += _this.child_widths[_this.index];
                }
                if (distance > _this.offscreen_right) {
                  _this.offscreen_left = _this.rotateLeft() + distance;
                  _this.offscreen_right += _this.childWidth(_this.rotation[_this.rotation.length - 1]);
                }
                _this.shuttle.css('left', _this.offscreen_left - distance);
              } else {
                if (distance > _this.active_half) {
                  $(_this.children[_this.index]).removeClass('active');
                  _this.index -= 1;
                  if (_this.index < 0) {
                    _this.index = _this.children.length - 1;
                  }
                  $(_this.children[_this.index]).addClass('active');
                  _this.active_half += _this.child_widths[_this.index];
                }
                if (distance + _this.offscreen_left > 0) {
                  _this.offscreen_left = _this.rotateRight() - distance;
                }
                 _this.shuttle.css('left', _this.offscreen_left + distance);
              }
            } else {
              if (phase === 'end') {
                _this.moveToIndex(_this.index, direction);
              } else if (phase === 'cancel') {
                _this.moveToIndex(_this.index, (direction === 'right' ? 'left' : 'right'));
              }
              if (_this.was_scrolled) {
                _this.configureScroll();
              }
            }
            return true;
          },
          excludedElements: 'label, button, input, select, textarea, .noSwipe',
          allowPageScroll: 'vertical',
          threshold: 40
        });
        return this.div.find('a').on('click', this.cancelClick);
      }
    };

    FilmRoll.prototype.configureWidths = function() {
      var min_height,
        _this = this;
      this.width = min_height = 0;
      this.wrapper.css({
        height: '',
        'min-height': 0
      });
      this.shuttle.width('').removeClass('film_roll_shuttle').addClass('film_roll_resizing');
      this.children.width('');
      this.div.trigger($.Event("film_roll:resizing"));
      this.child_widths = [];
      if (this.options.height && this.options.height.toString().match(/^\+/)) {
        this.options.height_padding = parseInt(this.options.height, 10);
        this.options.height = null;
      } else {
        this.options.height_padding = 0;
      }
      this.children.each(function(i, e) {
        var $el, el_height, el_width;
        $el = $(e);
        $el.width($el.outerWidth(true));
        el_width = $el.outerWidth(true);
        _this.child_widths.push(el_width);
        _this.width += el_width;
        if (!_this.options.height) {
          el_height = $el.outerHeight(true);
          if (el_height > min_height) {
            min_height = el_height;
          }
        }
        return e;
      });
      if (this.options.height) {
        this.wrapper.height(this.options.height);
      } else {
        this.wrapper.height('');
        this.wrapper.css('min-height', min_height + this.options.height_padding);
      }
      this.real_width = this.width;
      this.shuttle.width(this.real_width * 2).removeClass('film_roll_resizing').addClass('film_roll_shuttle');
      return this;
    };

    FilmRoll.prototype.rotationIndex = function(child) {
      return $.inArray(child, this.rotation);
    };

    FilmRoll.prototype.marginLeft = function(rotation_index) {
      var child, i, margin, _i, _len, _ref;
      margin = 0;
      _ref = this.rotation;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        child = _ref[i];
        if (i < rotation_index && i >= 0) {
          margin += this.childWidth(child);
        }
      }
      return margin;
    };

    FilmRoll.prototype.marginRight = function(rotation_index) {
      var child, i, margin, offset, _i, _len, _ref;
      offset = this.rotation.length - 1;
      margin = 0;
      _ref = this.rotation;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        child = _ref[i];
        if (i > rotation_index && i <= offset) {
          margin += this.childWidth(child);
        }
      }
      return margin;
    };

    FilmRoll.prototype.moveLeft = function() {
      this.index = (this.index + 1) % this.children.length;
      this.moveToIndex(this.index, 'left', true);
      return false;
    };

    FilmRoll.prototype.moveRight = function() {
      this.index -= 1;
      if (this.index < 0) {
        this.index = this.children.length - 1;
      }
      this.moveToIndex(this.index, 'right', true);
      return false;
    };

    FilmRoll.prototype.moveToChild = function(element) {
      var child_index;
      child_index = this.childIndex($(element)[0]);
      if (child_index > -1) {
        return this.moveToIndex(child_index);
      }
    };

    FilmRoll.prototype.moveToIndex = function(index, direction, animate) {
      var child, direction_class, new_left_margin, rotation_index, scrolled, visible_margin, wrapper_width,
        _this = this;
      if (animate == null) {
        animate = true;
      }
      this.index = index;
      scrolled = this.scrolled;
      this.clearScroll();
      child = this.children[index];
      rotation_index = $.inArray(child, this.rotation);
      if (!direction || direction === 'best') {
        direction = this.bestDirection(child, rotation_index);
      }
      this.children.removeClass('active');
      $(child).addClass('active').trigger($.Event("film_roll:activate"));
      this.pager_links.removeClass('active');
      $(this.pager_links[index]).addClass('active');
      wrapper_width = this.wrapper.width();
      if (wrapper_width < this.real_width && this.children.length > 1) {
        visible_margin = (wrapper_width - this.child_widths[index]) / 2;
        if (direction === 'right') {
          while (rotation_index === 0 || this.marginLeft(rotation_index) < visible_margin) {
            this.rotateRight();
            rotation_index = $.inArray(child, this.rotation);
          }
        } else {
          while (rotation_index === this.children.length - 1 || this.marginRight(rotation_index) < visible_margin) {
            this.rotateLeft();
            rotation_index = $.inArray(child, this.rotation);
          }
        }
        new_left_margin = -1 * (this.marginLeft(rotation_index) - visible_margin);
        if (animate) {
          direction_class = "moving_" + direction;
          this.shuttle.addClass(direction_class);
          this.div.trigger($.Event("film_roll:moving"));
          this.shuttle.stop().animate({
            'left': new_left_margin
          }, this.animation, this.easing, function() {
            _this.shuttle.removeClass(direction_class);
            return _this.div.trigger($.Event("film_roll:moved"));
          });
        } else {
          this.shuttle.css('left', new_left_margin);
          this.div.trigger($.Event("film_roll:moved"));
        }
      } else {
        this.shuttle.css('left', (wrapper_width - this.width) / 2);
      }
      if (scrolled) {
        this.configureScroll();
      }
      return this;
    };

    FilmRoll.prototype.resize = function() {
      var _this = this;
      clearTimeout(this.resize_timer);
      this.resize_timer = setTimeout(function() {
        var scrolled;
        scrolled = _this.scrolled;
        _this.clearScroll();
        if (scrolled) {
          _this.configureScroll();
        }
        _this.configureWidths();
        _this.moveToIndex(_this.index, 'best');
        return _this.div.trigger($.Event("film_roll:resized"));
      }, 200);
      return this;
    };

    FilmRoll.prototype.rotateLeft = function() {
      var _css_left, _first_child, _new_left, _shuttle_left;
      _css_left = this.shuttle.css('left');
      _shuttle_left = _css_left ? parseInt(_css_left, 10) : 0;
      _first_child = this.rotation.shift();
      _new_left = _shuttle_left + this.childWidth(_first_child);
      this.rotation.push(_first_child);
      this.shuttle.css('left', _new_left);
      this.shuttle.append(this.shuttle.children().first().detach());
      return _new_left;
    };

    FilmRoll.prototype.rotateRight = function() {
      var _css_left, _last_child, _new_left, _shuttle_left;
      _css_left = this.shuttle.css('left');
      _shuttle_left = _css_left ? parseInt(_css_left, 10) : 0;
      _last_child = this.rotation.pop();
      _new_left = _shuttle_left - this.childWidth(_last_child);
      this.rotation.unshift(_last_child);
      this.shuttle.css('left', _new_left);
      this.shuttle.prepend(this.shuttle.children().last().detach());
      return _new_left;
    };

    return FilmRoll;

  })();
  return this.FilmRoll.default_easing = 'swing';
})(jQuery);

var LS = LS || window.LS || {};

LS.tabletBreakpoint = 769;
LS.desktopBreakpoint = 1030;
LS.galleries = [];

LS.checkoutFieldsInit = function(){
	var $ = jQuery;

	/* Checkout Fields */
	var $checkoutForms = $('.checkout-section').find('form');

	$checkoutForms.find('.dropdown-menu a').on('click', function() {
		ga('send', 'event', 'checkout_field', 'select', $(this).closest('.pretty-select').find('select').attr('id') );
	});

	$checkoutForms.find('input.radio').on('change', function() {
		ga('send', 'event', 'checkout_field', 'select', $(this).attr('id') );
	});

	$checkoutForms.find('.checkbox').on('click', function() {
		ga('send', 'event', 'checkout_field', 'select', $(this).find('input').attr('id') );
	});

	$checkoutForms.find(':input').on('focus', function () {
		if( $(this).is('button') ){
			return;
		}
		if( $(this).hasClass('completed') || $(this).hasClass('skipped') ){
			return;
		}
		if( $(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio' ){
			return;
		}
		ga('send', 'event', 'checkout_field', 'start', $(this).attr('id') );
	});

	$checkoutForms.find(':input').on('blur', function () {
		if( $(this).is('button') ){
			return;
		}
		if( $(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio' ){
			return;
		}
		// for conditional logic, see: http://www.lunametrics.com/blog/2014/11/10/form-tracking-google-tag-manager/#sr=g&m=o&cp=or&ct=-tmc&st=(opu%20qspwjefe)&ts=1423008281
		if( $(this).val().length > 0 && !($(this).hasClass('completed')) ){
			ga('send', 'event', 'checkout_field', 'complete', $(this).attr('id') );
			$(this).addClass('completed');
		}
		else if( !($(this).hasClass('completed')) && !($(this).hasClass('skipped')) ){
			ga('send', 'event', 'checkout_field', 'skip', $(this).attr('id') );
			$(this).addClass('skipped');
		}
	});
};

LS.isDevSite = function(){
	var host = window.location.hostname;
	if( host.indexOf('.dev') !== -1 || host.indexOf('electric') !== -1 ){
		return true;
	}

	return false;
}

LS.haveAnalytics = function(){
	return typeof ga !== 'undefined';
};

LS.haveFbTracking = function(){
	return typeof fbq !== 'undefined';
};

LS.havePinterestTracking = function(){
	return typeof pintrk !== 'undefined';
};

LS.haveSegment = function(){
	return typeof analytics !== 'undefined';
};
LS.segmentTrack = function(eventName, data){
	if( LS.isDevSite() ){
		console.log('SEGMENT DEBUG :: ' + eventName, data); 
	}else{
		analytics.track(eventName, data); 
	}
};

LS.getProductName = function(){
	var $ = jQuery;
	return $('#product-title').text();
};

LS.getProductPrice = function(){
	var $ = jQuery;

	// selectors here are pretty gross but we want to get the price as shown when added to cart
	var price_str = $('.product-view-price .regular-price .price').text(),
		$special_price = $('.product-view-price .special-price .price');

	if( $special_price.length > 0 ){
		price_str = $special_price.text();
	}

	return price_str.replace('$', '');
};

LS.getProductVariant = function(){
	var $ = jQuery;
	return $('.product-view-selected-color').text();
};

LS.getProductCategories = function(){
	var $ = jQuery;
	if( $('#product-categories').length < 1 ){
		return '';
	}
	return $('#product-categories').val();
};


LS.getWaitlistProduct = function(){
	var $ = jQuery;
	return $('#wait-list-form .name').text();
};

LS.toggleGalleryControls = function($gallery){
	var $ = jQuery;
	var $parent = $gallery.parent('.product-gallery');
	var itemsWidth = 0;
	$gallery.find('.item').each(function(){
		itemsWidth = itemsWidth + $(this).width();
	});
	if( itemsWidth < $(window).width() ){
		$parent.addClass('is-singular');
	}else{
		$parent.removeClass('is-singular');
	}
};

// in case we want to tweak these settings
LS.toggleLoading = function(visibility, el){
	if( visibility == 'show')
		el.fadeIn(300);
	if( visibility == 'hide')
		el.fadeOut(500);
};

LS.equalHeights = function(parentSelector, childSelector, targetEl){
	var $ = jQuery,
		$parents = $(parentSelector);

	if( $parents.length === 0 ) return;

	$(targetEl).attr('style', ''); // clear out any previous heights

	if( $(window).width() < 768 ) return; // one column

	$parents.each(function(){
		var $children = $(this).find(childSelector);
		if( $children.length ){
			var height = 0;
			$children.each(function(){
				if( $(this).find(targetEl).outerHeight() > height ){
					height = $(this).find(targetEl).outerHeight();
				}
			});
			$children.find(targetEl).outerHeight(height);
		}
	});
};

LS.setupPdpElements = function(){
	var $ = jQuery;
	var $w = $(window);

	if( !$('body').hasClass('catalog-product-view') ) return;

	if( $w.width() < 768 ){
		$('.product-title-group .product-title').detach().appendTo('#product-title-group-xs');
		$('.product-title-group .product-short-description').detach().appendTo('#product-title-group-xs');

		$('.product-title-group .mini-divider').detach().appendTo('#product-description-xs');
		$('.product-title-group .product-description').detach().appendTo('#product-description-xs');
	}else{
		$('#product-title-group-xs .product-title').detach().appendTo('.product-title-group');
		$('#product-title-group-xs .product-short-description').detach().appendTo('.product-title-group');

		$('#product-description-xs .mini-divider').detach().appendTo('.product-title-group');
		$('#product-description-xs .product-description').detach().appendTo('.product-title-group');
	}

};

LS.doStickyColumn = function ( el_starting_pos ){

	var $ = jQuery,
		$el = $('.sticky'),
		$el_parent = $('.sticky-parent'),
		bd_height = $('body').height(),
		scroll_pos = $(window).scrollTop(),
		pin_start = $('#site-header').outerHeight(),
		el_window_offset = $el.offset().top - scroll_pos,
		el_bottom = bd_height - ( $el.offset().top + $el.outerHeight() ),
		column_bottom = bd_height - ( $el_parent.offset().top + $el_parent.outerHeight() );

		// pin the sidebar when it hits the navbar
		if( el_window_offset <= pin_start ){
			$el.addClass('pinned');
		}
		// if the bottom of the sidebar hits the bottom of the columnm, unpin from the top and pin to the bottom
		if( el_bottom <= column_bottom ){
			$el.addClass('pinned-bottom');
		}
		// we have room again when scrolling back up, repin to the top
		if( el_window_offset > pin_start ){
			$el.removeClass('pinned-bottom');
		}
		// we've scrolled passed our initial starting point, unpin
		if( el_starting_pos - scroll_pos > pin_start ){
			$el.removeClass('pinned');
		}
};

LS.filters = {

	moveFilters: function(){
		var $ = jQuery,
			window_w = $(window).width(),
			$filters_home = $('#filters-column-home'),
			$filters = $('#filters-column'),
			$main_col_el = $('.main .feature');

		if( $main_col_el.length > 0 ) {
			if( window_w < LS.desktopBreakpoint ){
				$filters.insertAfter( $main_col_el );
			}else{
				$filters_home.prepend( $filters );
			}
		}
	},

	countActiveFilters: function(){
		var $ = jQuery,
			total_active_count = 0;

		$('.filter-options').each(function(){
			var $this = $(this),
				active_count = $this.find('input[type="checkbox"]:checked').length;

			if( active_count > 0 ){
				total_active_count = total_active_count + active_count;
			}
		});
		if( total_active_count > 0 ){
			$('.all-filters-toggle .badge').text(total_active_count).removeClass('hidden');
		}else{
			$('.all-filters-toggle .badge').addClass('hidden');
		}
	},

	setStickyColumnHeight: function(target){
		var $ = jQuery;
		$('.sticky-parent').height( target.outerHeight() );
	},

	refreshFilters: function(url, clear){
		var $ = jQuery,
			$loading = $('#filters-column .loading'),
			$filters = $('#category-filters'),
			$open_filters = $('.m-filter-item-list.in'),
			filters_h = $filters.height();
			window_h = $(window).height();

		LS.toggleLoading('show', $loading );

		if (clear) {
			$('.main .product-grid').fadeTo('.25', '.1');
		}

		var open_filter_ids = [];
		$open_filters.each(function(){
			open_filter_ids.push($(this).attr('id'));
		});

		// adjust our loading indicator to be as tall as the filters, but not taller than the window so the spinner is always visible
		if( filters_h > window_h ){
			$loading.css('bottom', filters_h - window_h );
		}else{
			$loading.css('bottom', '0' );
		}

		$.get(url, function (data) {
			var newgrid = $(data).find('.main .product-grid').html(),
				newfilters = $(data).find('#filters-column .block-layered-nav').html(),
				scroll_pos = $(window).scrollTop();

			$('.main .product-grid').html(newgrid);
			// disable lazy loading, client request
			// $('img.lazy').lazyLoadXT({
			// 	edgeY : 500
			// });
			$('#filters-column .block-layered-nav').html(newfilters);

			if (clear) {
				$('.main .product-grid').fadeTo('.25', 1);
				$('#all-filters').removeClass('in');
				$('.all-filters-toggle').removeClass('open');
			}else{
				$('#all-filters').addClass('in');
				$('.all-filters-toggle').addClass('open');

				// reopen filters that may not have had something selected
				for (var i = open_filter_ids.length - 1; i >= 0; i--) {
					$('#'+open_filter_ids[i]).addClass('in');
					$('#'+open_filter_ids[i]).prev('.filter-toggle').removeClass('collapsed');
				}
			}

			if( $(window).width() > LS.desktopBreakpoint ){
				if( $('#category-filters').outerHeight() > $('.main').outerHeight() ){
					LS.filters.setStickyColumnHeight( $('#category-filters') );
				}else{
					LS.filters.setStickyColumnHeight( $('.main') );
				}
			}

			LS.filters.countActiveFilters();
			LS.toggleLoading('hide', $('#filters-column .loading') );
		});

	}

};

LS.overlay = {
	open: function(){
		var $ = jQuery;
		$('#overlay').fadeIn(300);
	},
	close: function(){
		var $ = jQuery;
		$('#overlay').fadeOut(300);
	}

};

LS.cart = {

	toggle: function (open) {
		var $ = jQuery;

		if (open) {
			if( open == 'add'){
				$('#add-to-cart-success').show();
			}
			$('body').addClass('cart-open');
		}
		else {
			$('#add-to-cart-success').hide(); // 
			$('body').toggleClass('cart-open');
		}

		if ($('body').hasClass('cart-open')) {
			$('#overlay').fadeIn(300, function(){
				var hideShippingForm = false;
				if (!$('.shipping .shipping-form').is(':visible')) {
					$('.shipping .shipping-form').show();
					hideShippingForm = true;
				}
				// $('.pretty-select select').selectpicker();
				if (hideShippingForm) {
					$('.shipping .shipping-form').hide();
				}
			});
			if( LS.haveSegment() ){
				var $cartItems = $('.cart-items .remove-item'); // the remove button has values attached, so use that
				var products = [];
				$cartItems.each(function(){
					products.push({product_id:$(this).data('product-id')});
				});
				LS.segmentTrack('Cart Viewed', {
				    products: products
				});
			}
		} else {
			LS.overlay.close();
		}
	},

	// updateCartCount: function (new_qty){
	// 	var $ = jQuery;

	// 	var $el = $('#cart-count-sm, #cart-count-md');
	// 	if( new_qty > 0 ){
	// 		$el.text(new_qty).removeClass('no-items');
	// 	}else{
	// 		$el.addClass('no-items');
	// 	}

	// },

	updateCartActions: function (new_qty){
		var $ = jQuery,
			$cartActions = $('.cart-window-actions');

		if(new_qty > 0){
			$cartActions.removeClass('no-checkout');
		}else{
			$cartActions.addClass('no-checkout');
		}
	},

	updateCounts: function(count){
		var $ = jQuery;
		var $cartCountBadge = $('#cart-count-sm');

		// cart title
		var cartSummary = count + ' Item';
		if( count > 1 ){
			cartSummary = cartSummary + 's';
		}
		if( count == 0 ){
			cartSummary = '';
		}
		$('.cart-title .subtitle').text(cartSummary);

		// cart button
		$cartCountBadge.text(count);
		if( count > 0 ){
			$cartCountBadge.removeClass('no-items'); // display: none on .no-items
		}else{
			$cartCountBadge.addClass('no-items');
		}
	},

	get: function(productAdded){
		var $ = jQuery;

		$('#side-cart .cart-inner').html('<div class="loading"></div>');
		var $loading = $('#side-cart .loading');
		LS.toggleLoading('show', $loading);
		
		$.ajax({
			url : '/checkout/cart',
			success : function(data, textStatus, jqXHR){
				var $items = $(data).find('#shopping-cart-table');
				var $totals = $(data).find('#shopping-cart-totals-table');
				var $proceedBtn = $(data).find('#cart-items .checkout-types .btn');

				if( $items.length ){
					// add items and totals
					$('#side-cart .cart-inner').append($items, $totals);
					LS.cart.calculateTotalDiscount();

					var $buttons = $('#cart-summary .btn').clone();
					$('#side-cart .cart-inner').append($buttons);

					// count elements
					LS.cart.updateCounts($items.data('count'));

					if( typeof productAdded !== 'undefined' ){
						var $cartItem = $('.remove-item[data-simple-sku="'+productAdded +'"]');
						var productPrice = $cartItem.data('product-price');

						$('#added-product-name').text($cartItem.data('product-name'));
						$('#added-product-image').attr('src', $cartItem.closest('tr').find('.cart-item-thumb img').attr('src'));
						$('#added-product-color').text($cartItem.data('product-variant'));
						$('#added-product-qty').text($cartItem.data('product-qty'));
						$('#added-product-price').text('$' + productPrice.replace('.00',''));
						$('#added-cart-count').text($items.data('count'));
						$('#added-cart-subtotal').text($('#subtotal-row .item-total').text());

						LS.toggleLoading('hide', $('.add-to-cart-wrapper .loading'));
						$('.add-to-cart-input').removeAttr('disabled');

						LS.cart.toggle('add'); // show cart panel after add action
					}
				}else{
					$('#side-cart .cart-inner').prepend($(data).find('.cart-empty'));
					$('#side-cart .cart-inner .btn').closest('p').remove(); // continue shopping
				}

				LS.toggleLoading('hide', $loading);
				
			}
		});
	},
	
	calculateTotalDiscount: function(){
		var $ = jQuery;

		$('#coupon-row').data('discount-value', $('#discount-row').data('discount-value'));  // our discount row stashes the value of the coupon applied 
		$('#coupon-total').text($('#discount-total').text());  // move the outputted value to this row 
		$('#discount-row').remove();  // remove the original discount row
		
		var totalDiscount = 0;  // gather discounts add add them to the custom totals row 
		$('#shopping-cart-totals-table tbody tr, #checkout-review-totals-table tbody tr').each(function(){
		    if( $(this).data('discount-value') ){
		        totalDiscount = totalDiscount + Number($(this).data('discount-value'));
		    }
		});
		if( !totalDiscount ){
		    $('#discount-total-row').remove();
		}else{
		    $('#discount-total').text('-$' + totalDiscount.toFixed(2));
		}
	}

};

LS.fireEvent = function(el, ev) {
	$(el).simulate(ev);
};

LS.handlePrettySelects = function() {
	var $ = jQuery;

    // Make sure the checkout dropdowns fire their events
    $('select').on('change', function(e){
      if (!e.originalEvent) {
        // Only fire this for the original jQuery change event
        if (typeof LS != 'undefined') {
          LS.fireEvent($(this)[0], 'change');
        }
      }
    });
};

LS.linkImagesToVideos = function(){
	var $ = jQuery;
	$('.has-video').on('click', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});
};

LS.productVideoOpen = function(videoId){
	var $ = jQuery;
	var $container = $('#product-video-container');
	var dataLayer = window.dataLayer || [];

	// video{n}Embed variables are defined in /app/design/frontend/lo-rwd/default/template/catalog/product/view.phtml
	switch(videoId){
		case 2:
			embedCode = video2Embed;
		break;
		case 3:
			embedCode = video3Embed;
		break;
		case 4:
			embedCode = video4Embed;
		break;
		case 5:
			embedCode = video5Embed;
		break;
		case 6:
			embedCode = video6Embed;
		break;
		default:
			embedCode = video1Embed; 
		break;
	}

	// embed it
	$container.prepend(embedCode);
	var $iframe = $container.find('iframe');

	// set the width to a value that makes the height of the embed 80% of the window height,
	// then convert that width to a percentage of the window width so it scales,
	// but only when that size isn't wider than the current window
	var iframeEmbedWidth = $iframe.attr('width');
	var ratio = ( $(window).height() * 0.8 ) / $iframe.attr('height');
	if( iframeEmbedWidth * ratio > $(window).width() ){
		$container.css('width', '100%');
	}else{
		$container.css('width', ((iframeEmbedWidth * ratio) / $(window).width()) * 100 +'%' );
	}

	// responsify it now that we have its size defined
	$container.fitVids();

	// show it
	$('#product-video').fadeIn();

	// center it in the window, do this after the fade in so the height is available. The user shouldn't see the shift.
	$container.css('margin-top', '-'+($container.outerHeight()/2)+'px' );

	// use the vimeo API to auto-play
	// NOTE: iOS doesn't allow js to auto-play media, so the user will still have to click play.
	player = new Vimeo.Player($iframe[0]);
	
	// only attempt the auto play for desktop. Vimeo changed something so autoplay attempts will leave the video in a paused state.
	if( $(window).width() >= LS.desktopBreakpoint ){
		player.play();	
	}

	player.on('play', function(data){
    	player.getVideoTitle().then(function(title) {
    		dataLayer.push({
    			'event' : 'videoStart',
    			'videoName' : title
    		});    
    	}).catch(function(error) {
    		console.log(error);
    	});
	});
	player.on('ended', function(data){
    	player.getVideoTitle().then(function(title) {
	        dataLayer.push({
	        	'event' : 'videoEnd',
	        	'videoName' : title
	        });
    	}).catch(function(error) {
    		console.log(error);
    	});
	});
};

LS.productVideoClose = function(){
	var $ = jQuery;
	$('#product-video').fadeOut();
    $('#product-video .fluid-width-video-wrapper').remove(); // have to destroy the video for iOS
};

LS.product_detail_zoom_init = function(){
	var $ = jQuery,
		isMobile = ($(window).width() < LS.desktopBreakpoint);

	if (!isMobile) {
		$('.product-images .item.active').zoom({
				on:'click',
				onZoomIn: function() {
					$('.product-images .carousel-control').hide();
					$('.product-images .item.active').addClass('zoomed');
				},
				onZoomOut: function() {
					$('.product-images .carousel-control').show();
					$('.product-images .item.active').removeClass('zoomed');
				},
				onDestroy: function() {
					$('.product-images .carousel-control').show();
					$('.product-images .item.active').removeClass('zoomed').attr('style','');
				}
		});
	}
};

LS.scrollToFirstError = function(form){
	var $ = jQuery;

	// Find first validation error in form element and scroll to it, if it's not visible in the viewport
	var $firstFailure = $(form).find('.validation-failed').first().closest('.form-group');
	if ($firstFailure.length === 0) {
		return;
	}

	var isElementInViewport = function (el) {

	    //special bonus for those using jQuery
	    if (typeof jQuery === "function" && el instanceof jQuery) {
	        el = el[0];
	    }

	    var rect = el.getBoundingClientRect();

	    return (
	        rect.top >= $('#header').outerHeight() &&
	        rect.top <= $(window).height()
	    );
	};

	if (!isElementInViewport($firstFailure)) {
		var pos = $firstFailure.offset().top - $('#header').outerHeight();
		$('html,body').animate({scrollTop: pos+'px'}, 250);
	}
};

LS.beforeValidateSelectPickers = function(form){
    var prettys = $(form).select('.pretty-select');

    prettys.each(function(el){
        var select = $(el).down('select');
        if( select.hasClassName('validate-select') ) select.addClassName('pretty-hide-me').show();
    });
};

LS.afterValidateSelectPickers = function(form){
    var prettys = $(form).select('.pretty-select');

    prettys.each(function(el){

        $(el).select('.pretty-hide-me').each(function(pel){
            $(pel).removeClassName('pretty-hide-me').hide();
        });

        var field = $(el).down('select.validate-select');

        if( field ){

            var fieldpicker = field.next('.validate-select').down('.selectpicker'),
                advice = field.next('.validation-advice');

            if (field.hasClassName('validation-failed')) {
                fieldpicker.addClassName('validation-failed');
            }
            else {
                fieldpicker.removeClassName('validation-failed');
            }
            if (field.hasClassName('validation-passed')) {
                fieldpicker.addClassName('validation-passed');
            }
            else {
                fieldpicker.removeClassName('validation-passed');
            }

	        $(el).insert(advice);

        }

    });
};

LS.setupPdpDetailPanels = function(){
	var $ = jQuery;
	if( $(window).width() < LS.desktopBreakpoint ){
		$('.product-details-panel [role="button"]').addClass('collapsed');
		$('.product-details-panel .collapse').removeClass('in');
	}else{
		$('.product-details-panel [role="button"]').removeClass('collapsed');
		$('.product-details-panel .collapse').addClass('in').attr('style', '');
	}
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Hijack Footer Subscription Action
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
LS.handleFooterNewsletterForm = function(form) {
	var $ = jQuery,
		$form = $(form);

    var validator = new Validation(form);
    // 	useSpecialPickerHandling = !$('#newsletter .pretty-select select').is(':visible');
    // if (useSpecialPickerHandling) {

    // 	// Hide the non-pretty dropdowns in the newsletter form to allow the validation to work
    // 	$form.find('.pretty-select select').css({
    // 		'position':'absolute',
    // 		'left':'-1000px'
    // 	});

	   //  LS.beforeValidateSelectPickers(form);
    // }

    validator.validate();

 //    if (useSpecialPickerHandling) {

	//     // Wait just a touch to keep the validation library from reversing its validation detection for the pretty dropdowns
	//     setTimeout(function(){
	// 	    LS.afterValidateSelectPickers(form);
	//     }, 10);

	// }

	if ($form.find('.validation-failed').length > 0) {
		return false;
	}

	// HTML for the form is in a static block, so let's add this here
	$form.find('.modal-footer #footer-newsletter-message').remove();
	$form.find('.modal-footer').prepend('<div id="footer-newsletter-message" class="message text-center"></div>');

	var $message = $('#footer-newsletter-message'),
		$btn = $form.find('button');

	$message.hide().removeClass('success error'); // in case it was shown after the ajax
	$btn.prop("disabled",true);

	$.ajax({
		type: $form.attr('method'),
		url: $form.attr('action'),
		data: $form.serialize()
	})
	.done(function(response){
		if( response.success ){
			$form.find('.modal-body,.modal-footer button,.modal-header p').slideUp();
			$message.addClass('success').html(response.message).fadeIn();

			// klaviyo 
			var _learnq = window._learnq || [];
			var _learnqParams = {
				'$email' : $('#footer-newsletter-email').val(),
				'Birth Year' : $('#footer-newsletter-birthyear').val(),
				'Mens Products' : $('#product-interests-men').is(':checked'),
				'Womens Products' : $('#product-interests-women').is(':checked'),
				'Welcome Code' :  response.data.coupon,
				'Sign Up Source' : 'footer'
			};

			_learnq.push(['identify', _learnqParams]);

		}else{
			$message.addClass('error').html(response.message).fadeIn();
		}
		$btn.prop("disabled",false);
	});

	return false;
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Load Dynamic Elements that bypass cache
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// LS.getDynamicElements = function(){
// 	var $ = jQuery;
// 	var data = {};

// 	// PDP needs the ID sent for the review form
// 	if( $('#product-id').length ){
// 		data = {
// 			id : $('#product-id').val()
// 		}
// 	}
	
// 	$.ajax({
// 		url : '/ls-elements/index/data',
// 		data : data,
// 		success : function(data, textStatus, jqXHR){

// 			// add in the current account links (might be the same as what was there before)
// 			$('#site-menu > ul').append(data.accountHtml); 

// 			$(data.marquee).insertAfter('#site-header');

// 			// review form
// 			if( $('#reviews-list').length ){
// 				$(data.reviewsFormHtml).insertAfter('#reviews-list');
// 				$('#add-review-form').show();	
// 			}

// 			// maybe fire off segment/fullstory identification
// 			if( ! LS.isDevSite() && LS.haveSegment() && data.segmentUser ){
// 			    analytics.ready(function() {
// 			        FS.identify(data.segmentUser.id, data.segmentUser);
// 			    });
// 			    analytics.identify(data.segmentUser.id, data.segmentUser);
// 			}
// 		}
// 	});
// };
// LS.setRefererUrls = function(){
// 	var $ = jQuery;

// 	// make sure referer URLs are the current page for cart actions
// 	var separator = '?';
// 	var bypassStr = 'cf-bypass=true';
	
// 	if( window.location.search !== '' ){
// 	    separator = '&';
// 	}
// 	var url = window.location.href + separator + bypassStr;

// 	jQuery('input[name="referer_url"]').val(url);
// };


LS.isElementInViewport = function(el) {

    var rect = el.getBoundingClientRect();

    return (
        // rect.top >= 0 &&
        // rect.left >= 0 &&
        // rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        // rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */

        // we only care about the top edge
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
};

$(document).ready(function(){
	// reload nav state
	var savedState = sessionStorage.getItem('lo-main-menu');
	if( savedState ){
		$('#site-menu-items').html(savedState);
	}
	$('#site-menu a').on('click', function(){
		sessionStorage.setItem('lo-main-menu', $('#site-menu-items').html());
	});

	// off canvas nav
	$('body').on('click', '.navbar-toggle', function(e){
		e.preventDefault();
		$('body').toggleClass('menu-open');
		LS.overlay.open();
	});
	$('body').on('click', '#nav-panel-close', function(e){
		e.preventDefault();
		$('body').removeClass('menu-open');
		LS.overlay.close();
	});
	$('.site-content').on('click', function(e){
		if( $('body').hasClass('menu-open') ){
			e.stopPropagation();
			$('body').removeClass('menu-open');
			LS.overlay.close();
		}
	});
	$('body').on('click', '.menu-toggle', function(e){
		e.preventDefault();
		$(this).closest('li').toggleClass('open');
	});

 	// local nav for updated shopify designs,
 	// other local navs exist for transferred WP pages
	var setActiveBar = function(){
		var $nav = $('nav.local');
		var $bar = $nav.find('.active-bar');
		var $active = $nav.find('.active');
		var barOffset = $(window).width() > LS.desktopBreakpoint ? 20 : 11; // margins on the nav items
		$bar.css({
			'left': $active.position().left + barOffset, 
			'width': $active.outerWidth()
		});
	};
	if( $('nav.local').length ){
		setActiveBar();
		$(window).resize(function(){
			setActiveBar();
			if( $(window).width() > LS.desktopBreakpoint ){
				$('.local-nav-section').show();
			}
		});

		// jump to/show a section
		if( location.hash ){
			$('nav.local a').removeClass('active')
			$('[href="'+location.hash+'"]').addClass('active');
			setActiveBar();
			if( $(window).width() <= LS.desktopBreakpoint ){
				$('.local-nav-section').hide();
				$($('nav.local .active').attr('href')).next('.local-nav-section').fadeIn();
			}
		}

		// scroll spy
		var $topics = $('nav.local a');
		var $targets = $('.jumptarget');
		var headerHeight = $('#site-header').outerHeight() + $('nav.local').outerHeight();
		$(window).scroll(function(){
			if( $(window).width() > LS.desktopBreakpoint ){
				var activeSectionIndex = 0;
				var scrollPosition = $(window).scrollTop();
				$targets.each(function(i){
					var sectionTopPosition = Math.floor($(this).offset().top) - scrollPosition;
					if( sectionTopPosition <= headerHeight ){
						if( i > activeSectionIndex ){
							activeSectionIndex = i;
							$topics.removeClass('active');
							$topics.eq(activeSectionIndex).addClass('active');
							setActiveBar();
						}
					}
				});
				if( scrollPosition < headerHeight ){
					$topics.removeClass('active');
					$topics.eq(0).addClass('active');
					setActiveBar();
				}
			}
		});
			
	}
	$('body').on('click', 'nav.local a', function(e){
		e.preventDefault();

		var $btn = $(this),
		selector = $btn.attr('href'),
		pos = 0;

		// If the target isn't an on-page anchor, treat it like a normal link
		if (!selector.match(/^#/)) {
			window.location = selector;
			return;
		}

		$target = $(selector);
		if ($target.length === 0) {
			$target = $('body');
		}

		if( $(window).width() > LS.desktopBreakpoint ){
			// smooth scroll on desktop 
			pos = $target.offset().top - $('#site-header').outerHeight() - $('nav.local').outerHeight();
			$('html,body').animate({scrollTop: pos+'px'});
			// scroll spy will update current state
		}else{
			// act like tabs on mobile
			if( !$(this).hasClass('active') ){
				$('nav.local a').removeClass('active');
				$('.local-nav-section').hide().removeClass('active');
				$(this).addClass('active');
				$($(this).attr('href')).next('.local-nav-section').fadeIn();
				$('html,body').animate({scrollTop: 0});
				setActiveBar();
			}
		}
	});
});
$(document).ready(function(){
	var $videos = $('.embed-container');
	$videos.each(function(){
		var $embed = $(this);
		var videoId = $(this).find('video').attr('id');
		var video = document.getElementById(videoId);
		var autoPlay = $(this).data('autoplay');
		var loops = $(this).data('loops');
		var videoUrl = $embed.data('desktop-url');
		var mobileVideoUrl = $embed.data('mobile-url');

		if ( $(window).width() < LS.desktopBreakpoint && mobileVideoUrl ) {
	        $('#'+videoId).append('<source src="' + mobileVideoUrl + '" type="video/mp4" />');
	    } else {
	        $('#'+videoId).append('<source src="' + videoUrl + '" type="video/mp4" />');
	    }

		video.oncanplay = function() {
			$embed.find('.loading').fadeOut();
			// play it if we can see it 
			if( LS.isElementInViewport(video) && $embed.data('autoplay') ){
				var playPromise = video.play();
				if (playPromise !== undefined) {
					playPromise.then(function() {
						// Automatic playback started, nothing to do
					}).catch(function(error) {
						console.log('Playback did not start. Reason: ' + error)
					});
				}
			}
		};

		// play/pause based on visibility
		$(window).scroll(function(){
			if( LS.isElementInViewport(video) ){
				if( !$embed.hasClass('ended') && $embed.data('autoplay') ){
					var playPromise = video.play();
					if (playPromise !== undefined) {
						playPromise.then(function() {
							// Automatic playback started, nothing to do
						}).catch(function(error) {
							console.log('Playback did not start. Reason: ' + error)
						});
					}
				}
			}else{
				var pausePromise = video.pause();
				if (pausePromise !== undefined) {
					pausePromise.then(function() {
						// Paused, nothing to do
					}).catch(function(error) {
						console.log('Pause error. Reason: ' + error)
					});
				}
			}
		});

		// limit number of plays and maybe hide overlay text
		var playCount= 0;
		var lastTime = 0;
		video.addEventListener("timeupdate", function() {
			if( playCount === loops ){
				video.pause();
				$embed.addClass('ended');
				$embed.find('.video-trigger').fadeIn('slow');
			}

			// catching the start of the video is tricky with the loop, so see if the current time is the last time we saved ?>
			if( video.currentTime < lastTime ){
				playCount++;
				lastTime = 0;
			}else{
				lastTime = video.currentTime;
			}
		}, true);

		// that was cool, play it again ?>
		$embed.find('.video-trigger').on('click', function(e){
			e.preventDefault();
			$(this).fadeOut('fast');
			$embed.removeClass('ended');
			playCount = 0;
			video.play();
		});
	});

	// Product video
	$('body').on('click', '.product-video-trigger', function(e){
		e.preventDefault();
		LS.productVideoOpen(1); // button always shows the first video
	});
	$('body').on('click', '.has-video', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});
	$('body').on('click', '.overview-video-trigger', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});

	$('body').on('click', '#product-video .panel-close', function(e){
		e.preventDefault();
		LS.productVideoClose();
	});
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) { // escape key maps to keycode `27`
	    	LS.productVideoClose();
	    }
	});
});
$(document).ready(function(){

	if( $('body').hasClass('template-collection') ){
	
		var sessionKey = 'lo'+$('.page-header').data('collection');
		var savedState = sessionStorage.getItem(sessionKey);
		if( savedState ){
			$('#MainContent').html(savedState);
		}

		var setFilterOptions = function(){
			// show/hide filter options
			$('.filter-option').each(function(){
				var $parentEl = $(this).closest('li');
				// might need to show after an AJAX update, so reset to shown as default
				$parentEl.attr('style', '').removeClass('not-shown');
				// hide if no products use this filter
				if( $( '.' + $(this).data('hook') ).length < 1 ){
					$parentEl.hide().addClass('not-shown');
				}
			});

			// reset before hiding things
			$('.filter-options').removeClass('not-shown');
			$('.filter-toggle').closest('li').attr('style', '').removeClass('not-shown');

			// hide filter groups if only one option is present
			$('.filter-options').each(function(){
				if( $(this).find('li').length - $(this).find('.not-shown').length < 2 ){
					$('[href="#' + $(this).attr('id') + '"]').closest('li').hide().addClass('not-shown');
					$(this).hide().addClass('not-shown');
				}
			});

			// nothing to filter with, hide the whole thing
			if( $('#filters').find('li').length == $('#filters').find('.not-shown').length ){
				$('[data-filters-wrap]').hide();
			}else{
				$('[data-filters-wrap]').show();
			}
		};

		// go get other pages so we can filter everything at once

		if( $('.ajax-pagination').length ){
			$('.ajax-pagination a').each(function(){
				$.ajax({
					async : false, // make sure we get the products back in the correct order
					url : $(this).attr('href'),
					success : function( data, textStatus, jqXHR ){
						// insert the product families from the requested page
						var $productFamilies = $(data).find('#MainContent .product-family');
						$productFamilies.insertBefore('#filter-alert');
					},
					complete : function(){
						/*
							clean up families in case a family is split between pages
						 */
						
						// grab all of the names
						var allFamilyNames = [];
						$('.product-family').each(function(){
							allFamilyNames.push($(this).data('family-name'));
						});

						// find duplicates, this indicates a split
						var duplicates = [];
						allFamilyNames.forEach(function(element, index) {
							// Find if there is a duplicate or not
							if (allFamilyNames.indexOf(element, index + 1) > -1) {
								// Find if the element is already in the result array or not
								if (duplicates.indexOf(element) === -1) {
									duplicates.push(element);
								}
							}
						});

						// move the second set into the first
						if( duplicates.length ){
							for (var i = 0; i < duplicates.length; i++) {
								var $firstSet = $('[data-family-name="' + duplicates[i] + '"]').eq(0);
								var $secondSet = $('[data-family-name="' + duplicates[i] + '"]').eq(1);
								var $productsToMove = $secondSet.find('.f-hook');
								$productsToMove.detach().appendTo($firstSet.find('.row'));
								$secondSet.remove();
							};
						}

						// update our filter options
						setFilterOptions();
					}
				});
			});
		}

		// setup filter options
		setFilterOptions();

		var $activeFilters = $('#active-filters');
		// var $activeFiltersList = $('[data-active-filters]');
		$('.filter-toggle').on('click', function(e){
		    e.preventDefault();
		    $('.filter-options').hide();
		    if( $(this).hasClass('active') ){
		    	$(this).removeClass('active');
		    	$('#filters-panel').hide();
		    }else{
		    	$('.filter-toggle').removeClass('active');
		    	$(this).addClass('active');
		    	$('#filters-panel').show();
		    	$($(this).attr('href')).fadeIn();
		    }
		});
		$('.filter-option').on('click', function(e){
		    e.preventDefault();
		    $(this).toggleClass('selected');

		    // assume nothing matches
		    $('.f-hook').addClass('hidden');
		    $('#filters-collapse').remove();
		    $('#filter-alert').hide();

		    // rebuild arrays of selections
		    var allActiveFilters = [];
		    $('.filter-options').each(function(){
		    	var $filterGroup = $(this);
		    	if( $filterGroup.find('.filter-option.selected').length > 0 ){
		    		var activeGroupFilters = [];
		    		$filterGroup.find('.filter-option.selected').each(function(){
		    			activeGroupFilters.push($(this).data('hook'));
		    		});
		    		allActiveFilters.push(activeGroupFilters);
		    	}
		    });

		    // update active filter list
		    // used to have a list of active filters but removed per Derek
		    // var activeTextArr = [];
		    // $('.filter-option.selected').each(function(){
		    // 	activeTextArr.push($(this).text()); 
		    // }
		    // $activeFiltersList.text(activeTextArr.join(', '));
		    
		    if( $('.filter-option.selected').length < 1 ){
		    	// no active filters, so show everything
		    	$('.page-header').removeClass('has-active-filters');
		    	$('.f-hook').removeClass('hidden');
		    	sessionStorage.removeItem(sessionKey);
		    }else{
		    	// show results
		    	$('.f-hook').each(function(){
		    		var itemClasses = $(this).attr('class').split(' ');
		    		var groupMatches = 0;
		    		// loop over each filter group
		    		for (var f = 0; f < allActiveFilters.length; f++) {
		    			// loop over each option in the group
		    			for (var k = 0; k < allActiveFilters[f].length; k++) {
		    				// if this option appears somewhere in the product's classes, we've matched the group
		    				if( itemClasses.indexOf(allActiveFilters[f][k]) > -1 ){
		    					groupMatches++;
		    					break; // don't over count
		    				}
		    			}
		    		};
		    		// compare the number of matches we found to the number of groups with active filters
		    		// if they're equal then this item satisfies each group requirement somehow
	 				if( groupMatches == allActiveFilters.length ){
		    			$(this).removeClass('hidden');
		    		}
		    	});
		    	
		    	// show our active filters element
		    	$('.page-header').addClass('has-active-filters');

		    	// no results
		    	if( $('.f-hook').length == $('.f-hook.hidden').length ){
		    		$('#filter-alert').fadeIn(); 
		    	}

		    	// mobile button to get the filters out of the way
		    	if( $(window).width() < LS.desktopBreakpoint ){
		    		var shown = $('.f-hook').length - $('.f-hook.hidden').length;
		    		var btnText = shown > 1 ? 'Show ' + shown + ' items' : 'Show 1 item';
		    		$('<button id="filters-collapse" class="btn">' + btnText + '</button>').insertBefore('#active-filters');
		    	}
		    }

		    // maybe hide the product group
		    $('.product-family').each(function(){
		    	if( $(this).find('.f-hook').length == $(this).find('.f-hook.hidden').length ){
		    		$(this).hide();
		    	}else{
		    		$(this).fadeIn();
		    	}
		    });
		});
		$('#reset-filters').on('click', function(e){
		    e.preventDefault();
		    $('.filter-option').removeClass('selected');
		    $('.page-header').removeClass('has-active-filters');
		    $('.f-hook').removeClass('hidden');
		    $('.product-family').fadeIn();
		    $('.pagination').show();
		    $('#filters-collapse').hide();
		    $('#filter-alert').hide();
		    sessionStorage.removeItem(sessionKey);
		});
		$('body').on('click', '#filters-collapse', function(e){
		    e.preventDefault();
		    $('.filter-toggle').removeClass('active');
		    $('#filters-panel').hide();
		});

		// save the state on exit
		// doing this on filter clicks can catch product families at 0% opacity while they fade in
		// the animations should all be done at this point
		$(window).on('unload', function(){
			if( $('.page-header').hasClass('has-active-filters') ){
				sessionStorage.setItem(sessionKey, $('#MainContent').html());
			}
		});
	
	} // endif is collection page 
	
});
$(document).ready(function(){
	var updatePricing = function(siblingId){
		var selectedVariant;
		var comparePrice;
		for (var i = siblingsJson[siblingId].variants.length - 1; i >= 0; i--) {
			if( siblingsJson[siblingId].variants[i].id == $('[data-product-select]').val() ){
				selectedVariant = siblingsJson[siblingId].variants[i];
			}
		};
		
		// sale pricing
		if( selectedVariant.compare_at_price && selectedVariant.compare_at_price > 0 ){
			comparePrice = slate.Currency.formatMoney(selectedVariant.compare_at_price, theme.moneyFormat);
			$('[data-discount-amount]').text( Math.round( 100*(selectedVariant.compare_at_price - selectedVariant.price) / selectedVariant.compare_at_price ) );
			$('.discount-badge').removeClass('is-hidden');
		}else{
			comparePrice = '';
			$('.discount-badge').addClass('is-hidden');
		}
		
		// update the regular price element
		$('[data-compare-price]').html(comparePrice);
		if( comparePrice == '' ){
			$('[data-compare-price]').hide();
		}else{
			$('[data-compare-price]').fadeIn();
		}

		// current price
		var price = slate.Currency.formatMoney(selectedVariant.price, theme.moneyFormat);
		$('[data-product-price]').html(price.replace('.00',''));
	};

	var updateCta = function(){
		var selectedVariantID = $('[data-product-select]').val();
		var $addToCartBtn = $('[data-add-to-cart]');
		var $addToWaitlistBtn = $('[data-add-to-waitlist]');
		var siblingId = $('.swatch.active').data('sibling');
		var newVariants = siblingsJson[siblingId].variants;
		for (var i = 0; i < newVariants.length; i++) {
			if( newVariants[i].id == selectedVariantID ){
				if( newVariants[i].available ){
					$addToCartBtn.show();
					$addToWaitlistBtn.hide();
				}else{
					$addToWaitlistBtn.data('variant-id', selectedVariantID).show();
					$addToCartBtn.hide();
					$('#wl-variant').val(selectedVariantID);
				}
			}
		};
	};

	var updateWaitlistMeta = function(){
		var wlMeta = [$('#current-option span').text(), $('#variant-buttons .selected').text()];
		$('[data-wl-meta]').text(wlMeta.join(' - '));
	};

	var updateDataLayer = function(){
		var dataLayer = window.dataLayer || [];
		var selectedSibling = $('.swatch.active').data('sibling');
		var selectedVariantID = $('[data-product-select]').val();
		for (var i = 0; i < siblingsJson[selectedSibling].variants.length; i++) {
			if( siblingsJson[selectedSibling].variants[i].id == selectedVariantID ){
				dataLayer.push({
					'event' : 'swatchClick',
					'productData.price' : siblingsJson[selectedSibling].variants[i].price * 0.01,
					'productData.comparePrice' : siblingsJson[selectedSibling].variants[i].compare_at_price * 0.01,
					'productData.sku' : siblingsJson[selectedSibling].variants[i].sku,
					'productData.name' : siblingsJson[selectedSibling].title,
					'productData.variant' : siblingsJson[selectedSibling].variants[i].title,
					'productData.url' : siblingsSupplimentalJson[selectedSibling].url,
					'productData.imageUrl' : siblingsSupplimentalJson[selectedSibling].featuredImage,
					'productData.collections' : siblingsSupplimentalJson[selectedSibling].collections
				});
			}
		};
	};

	// on page load
	updateWaitlistMeta();

	$('.swatch').on('click', function(e){
		e.preventDefault();
	    var siblingId = $(this).data('sibling');
	    var currentSize = $('#variant-buttons .selected').text();

	    // update active swatch
	    $('.swatch').removeClass('active');
	    $(this).addClass('active');

	    // replace chosen color
	    $('#current-option span').text( $(this).find('img').data('color-label') );

	    // replace options in our Size selector. hard coded for single option variants
	    var newVariants = siblingsJson[siblingId].variants;
	    $('#variant-buttons').html('');
	    $('[data-product-select]').html('');
	    for (var i = 0; i <= newVariants.length - 1; i++) {
	    	// build our hidden select
	    	$('[data-product-select]').append('<option value="'+newVariants[i].id+'">'+newVariants[i].title+'</option>');
	    	// build our buttons
	    	$('#variant-buttons').append('<a href="#" class="btn btn-secondary variant-option">'+newVariants[i].title+'</a>');
	    };

	    // reselect the size, or use the first option
	    var sizeFound = false;
	    $('#variant-buttons .btn').each(function(){
	    	if( $(this).text() == currentSize ){
	    		sizeFound = true;
	    		$(this).click();
	    	}
	    });
	    if( !sizeFound ){
	    	$('#variant-buttons .btn').first().click();
	    }

	    // update pricing
	    updatePricing(siblingId);

	    // toggle Add to cart / Join waitlist visibility
	    updateCta(); 

	    // update dataLayer values
	    updateDataLayer();

	    // update waitlist 
	    $('#wl-image').attr('src', siblingsJson[siblingId].featured_image);
	    $('#wl-product').val(siblingId);
	    updateWaitlistMeta();

	    // replace galleries
	    $('.product-gallery').removeClass('active');
	    $('.product-gallery').each(function(){
	    	if( $(this).data('sibling') == siblingId ){
	    		$(this).addClass('active');
	    		var $active_slide = $(this).find('.film_roll_pager a.active');
	    		var active_slide_position = $(this).find('.film_roll_pager a').index( $active_slide ) + 1; // using the pager here because film role adjusts the index of slides with each animation
    			dataLayer.push({
    				'event' : 'galleryNavigation',
    				'productImage' : active_slide_position
    			});
	    	}
	    });

	    // replace content
	    $('.product-detail-panel').each(function(){
	    	var $overrideContent = $(this).find('[data-sibling="'+siblingId+'"]');
	    	if( $overrideContent.length ){
	    		$(this).find('.default-content, .sibling-content').addClass('hide');
	    		$overrideContent.removeClass('hide');
	    	}else{
	    		$(this).find('.sibling-content').addClass('hide');
	    		$(this).find('.default-content').removeClass('hide');
	    	}
	    });

	    // update window URL
	    if ( history.replaceState ) {
	      var newurl = window.location.protocol + '//' + window.location.host + $(this).data('url');
	      window.history.replaceState({path: newurl}, '', newurl);
	      sessionStorage.setItem('lo-back-to', newurl); // for use in the cart
	    }

	});

	$('body').on('click', '.variant-option', function(e){
	    e.preventDefault();
	    var $btn = $(this);
	    $('#variant-buttons .validation-error').remove();
	    $('.variant-option').removeClass('selected');
	    $btn.addClass('selected');
	    $('[data-product-select] option').each(function(){
	    	if( $(this).text().trim() == $btn.text() ){
	    		$('[data-product-select]').val($(this).attr('value'));
	    		$('[data-product-select]').trigger('change');
	    	}
	    });
	    $('#wl-variant').val($('[data-product-select]').val());
	    updateCta();
	    updateDataLayer();
	    updateWaitlistMeta();
	});

	$('[data-product-select]').on('change', function(){
		updatePricing($('.swatch.active').data('sibling'));
	});

	$('[data-add-to-cart]').on('click', function(e){
	    if( !$('[data-product-select]').val() ){
	    	$('#variant-buttons').append('<div class="validation-error">Please select a size</div>');
	    	return false;
	    }
	});
});
$(document).ready(function(){
	var $wlOverlay = $('#wl-overlay');
	var waitlistClose = function(){
		$wlOverlay.fadeOut();
	};
	$('[data-add-to-waitlist]').on('click', function(e){
	    e.preventDefault();
	    $('#wl-content').show();
	    $('#wl-confirmation').hide();
	    $wlOverlay.fadeIn();
	});
	$('[data-wl-cancel]').on('click', function(e){
	    e.preventDefault();
	    waitlistClose();
	});
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) { // escape key maps to keycode `27`
	    	waitlistClose();
	    }
	});

	var notificationCallback = function(data) {
		var msg = '';
		if (data.status == 'OK') {
			$('#wl-content').hide();
			$('#wl-confirmation').fadeIn();
		} else { // it was an error
			for (var k in data.errors) {  // collect all the error messages into a string
				msg += (k + " " + data.errors[k].join());
			}
		}
		$('#wl-error').text(msg).show();
	};

	$('#wl-form').on('submit', function(e) {
	    e.preventDefault();
	    $('#wl-email').removeClass('has-error');
	    $('#wl-form .validation-error').hide();
	    var email = $('#wl-email').val();
	    if( !email ){
	    	$('#wl-email').addClass('has-error').next('.validation-error').text('Please enter your email address').show();
	    	return false;
	    }
	    var variantId = $('#wl-variant').val();
	    var productId = $('#wl-product').val();
	    BIS.create(email, variantId, productId).then(notificationCallback); // create the notification
	});

	var $img = $('#wl-image');
	var positionWaitlistImage = function(){
		if( $(window).width() < LS.tabletBreakpoint ){
			if( $('#wl-content #wl-img').length < 1 ){
				$img.detach().insertAfter('#wl-product-name');
			}
		}else{
			if( $('#wl-confirmation').next('#wl-img').length < 1 ){
				$img.detach().insertAfter('#wl-confirmation');
			}
		}
	};
	positionWaitlistImage();
	$(window).resize(function(){
		positionWaitlistImage();
	});
});
$(document).ready(function(){

	var setReviewMarkupOrder = function(){
		if( $(window).width() < LS.desktopBreakpoint ){
			if( $('.reviews-list dt .reviewer-name').length < 1){
				$('.reviews-list dt').each(function(){
					$(this).find('.review-date').detach().appendTo($(this).next('dd'));
				});
				$('.reviews-list dd').each(function(){
					$(this).find('.reviewer-name').detach().prependTo($(this).prev('dt'));
				});
			}
		}else{
			if( $('.reviews-list dd .reviewer-name').length < 1){
				$('.reviews-list dt').each(function(){
					$(this).find('.reviewer-name').detach().prependTo($(this).next('dd'));
				});
				$('.reviews-list dd').each(function(){
					$(this).find('.review-date').detach().prependTo($(this).prev('dt'));
				});
			}
		}
	};

	$(window).resize(function(){
		setReviewMarkupOrder();
	});

	// reviews-received is fired once all reviews have been returned from yatpo's API
	$('body').on('reviews-received', function(){
		//  the relevant info we need is sort of buried, and we're going to need to sort these, so start a new object
		var finalReviewsData = [];
		
		// rawReviewsData is a global variable set in product.liquid 
		for (var i = rawReviewsData.length - 1; i >= 0; i--) {
			var siblingReviews = rawReviewsData[i].response.reviews;
			if( siblingReviews.length ){
				for (var r = siblingReviews.length - 1; r >= 0; r--) {
					var m = moment(siblingReviews[r].created_at);
					finalReviewsData[m.format('x')] = {
						"content" : siblingReviews[r].content,
						"author" : 	siblingReviews[r].user.display_name,
						"date" : m.format('M/D/YYYY'),
						"score" : siblingReviews[r].score
					}
				};
			}
		};

		// sort on the unix timestamp
		var keys = Object.keys(finalReviewsData);
		keys.sort();
		keys.reverse();

		var reviewsCount = keys.length;
		var currentPage = 1;
		var perPage = 5;
		if( keys.length > 0 ){
			var reviewsHtml = '<dl class="reviews-list page" id="reviews-page-1">';
			for (var i = 0; i < keys.length; i++) {

				if( i > 0 && i % perPage == 0 ){
					currentPage++;
					reviewsHtml += '</dl><dl class="reviews-list page" style="display: none" id="reviews-page-'+currentPage+'">';
				}

				reviewsHtml += '<dt><span class="review-date">'+finalReviewsData[keys[i]].date+'</span>';
				reviewsHtml += '<span class="stars">';
				for (var c = 1; c <= 5; c++) {
					reviewsHtml += '<i class="star';
					if( c <= finalReviewsData[keys[i]].score ) reviewsHtml += ' filled';
					reviewsHtml += '"></i>';
				};
				reviewsHtml += '<span class="sr-only">rated '+finalReviewsData[keys[i]].score+' out of 5</span></span></dt>';
				reviewsHtml += '<dd><h3 class="reviewer-name">'+finalReviewsData[keys[i]].author+'</h3>';
				reviewsHtml += '<p>'+finalReviewsData[keys[i]].content+'</p></dd>';
			};
			reviewsHtml += '</dl>';
			$('#reviews').html(reviewsHtml);

			// now maybe rearrange things, because designers
			setReviewMarkupOrder();

			if( currentPage > 1 ){
				var pagination = '<div class="pagination" id="reviews-navigation">';
				for (var i = 1; i <= currentPage; i++) {
					pagination += '<span class="page"><a href="#reviews-page-'+i+'">'+i+'</a></span>';
				};
				pagination += '</div>';
				$('#reviews').append(pagination);
				$('#reviews-navigation span').first().addClass('current');
			}
		}else{
			$('#reviews').html('<div class="alert alert-muted">No reviews yet. Be the first to add a review.</div>');
		}
	});

	$('body').on('click', '#reviews-navigation a', function(e){
	    e.preventDefault();
	    $('#reviews dl.page').hide();
	    $($(this).attr('href')).fadeIn();
	    $('#reviews-navigation .page').removeClass('current');
	    $(this).closest('.page').addClass('current');
	});

	$('body').on('click', '.write-review-button', function(e){
		$('.write-form .yotpo-header-title').text('Write your review');
		$('.write-form .yotpo-submit').val('Submit review');
	    $(this).addClass('is-hidden');
	    if( $(window).width() < LS.desktopBreakpoint ){
	    	$(this).closest('.yotpo-regular-box').slideUp();
	    }
	});
});
$(document).ready(function(){
	var animation_speed = 800;
	if( $(window).width() < LS.desktopBreakpoint ){
		animation_speed = 500;
	}

	$('.product-gallery').each(function(){

		var galleryKey = $(this).find('.filmroll').attr('id');
		var galleryId = '#' + galleryKey;

		var fr = new FilmRoll({
			container: galleryId,
			scroll: false,
			hover: false, // must be false to allow clickable slides on
			animation: animation_speed,
			easing: 'easeInOutCubic',
			prev: '#gallery-' + $(this).data('sibling') + '-prev',
			next: '#gallery-' + $(this).data('sibling') + '-next',
			vertical_center: false,
			no_css: true
		});

		LS.galleries[galleryKey] = fr;

		// fix the image heights on resize
		var $gallery = $(galleryId);
		var $masterImage = $gallery.find('.master img');

		if($masterImage){
			$gallery.on('film_roll:resizing', function(){
				$gallery.find('.resize img').height($masterImage.height()); 
			});
		}

		// :moved happens on page load so we don't want to watch that one for GA events
		$gallery.data('is-first-move', true);

		$gallery
			.on('film_roll:moved', function(event) {
				// gallery (maybe) shifts to index 0 on load, so hide our loading state when it's done
				$('.gallery-container').removeClass('is-loading');
				$('.gallery-container .loading').fadeOut();
				if( $gallery.closest('.product-gallery').hasClass('active') ){ // protect against watching hidden galleries
				    var $active_slide = $gallery.find('.film_roll_pager a.active');
				    var active_slide_position = $gallery.find('.film_roll_pager a').index( $active_slide ) + 1; // using the pager here because film role adjusts the index of slides with each animation
				    var dataLayer = window.dataLayer || [];
				    // gallery has moved again, trigger GA
				    if( !$gallery.data('is-first-move') ){
				    	dataLayer.push({
				    		'event' : 'galleryNavigation',
				    		'productImage' : active_slide_position
				    	});
				    }
				}
				// update state to catch next event that moves the gallery 
				$gallery.data('is-first-move', false);
			})
			.on('film_roll:activate', function(event){ // done loading
				LS.toggleGalleryControls($gallery);
				// if the gallery doesn't need to move because it's narrower than the window, show it when ready
				// shuttle will be twice the width of the child elements
				if( $gallery.find('.film_roll_shuttle').width()/2 < $(window).width() ){
					$('.gallery-container').removeClass('is-loading');
					$('.gallery-container .loading').fadeOut();
				}
			})
			.on('film_roll:resized', function(event){ // window size changes
				LS.toggleGalleryControls($gallery);
			});
	});
});
$(document).ready(function(){
	var addressHeight = 0;
	var $addresses = $('#address-list .address');
	if( $(window).width() > LS.desktopBreakpoint ){
		$addresses.each(function(){
			if( $(this).outerHeight() > addressHeight ){
				addressHeight = $(this).outerHeight();
			}
		});
		$addresses.css('min-height', addressHeight);
	}

	// add address
	$('#address-new-open').on('click', function(e){
	    $('#address-list').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#AddressNewForm').fadeIn();
	});
	$('#address-new-close').on('click', function(e){
	    $('#AddressNewForm').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#address-list').fadeIn();
	});
	// edit address
	$('.address-edit-open').on('click', function(e){
	    $('#address-list').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#EditAddress_'+$(this).data('form-id')).fadeIn();
	});
	$('.address-edit-close').on('click', function(e){
	    $('#EditAddress_'+$(this).data('form-id')).hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#address-list').fadeIn();
	});
});

$(document).ready(function() {
	
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
	slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
	$tables: $(tableSelectors),
	tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
	'.rte iframe[src*="youtube.com/embed"],' +
	'.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
	$iframes: $(iframeSelectors),
	iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
	document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  $('#article-body').fitVids();

  // give GA something to hook onto
  $('.pagination .page a').addClass('pagination-link');

	// mobile collapsed panels
	if( $(window).width() < LS.desktopBreakpoint ){
		$('[data-collapse-toggle]').on('click', function(e){
		    $(this).toggleClass('collapsed');
		    if( !$(this).hasClass('collapsed') ){
		    	$(this).next('[data-collapse-panel]').slideDown().addClass('is-shown');
		    }else{
		    	$(this).next('[data-collapse-panel]').slideUp().removeClass('is-shown');
		    }
		});
	}

  // sticky sidebar
  var has_sticky_element = $('.sticky').length > 0;

  if( has_sticky_element ){
	var el_starting_pos = $('.sticky').offset().top;
	if( $(window).width() > LS.desktopBreakpoint ){
	  LS.filters.setStickyColumnHeight($('.main'));
	}
  }

  $(window).load( function() { // do this after the load so we have our images
	if( $(window).width() > LS.desktopBreakpoint && has_sticky_element ){
	  LS.doStickyColumn(el_starting_pos);
	}
  });

  $(window).scroll(function(){
	if( $(window).width() > LS.desktopBreakpoint && has_sticky_element ){
	  LS.doStickyColumn(el_starting_pos);
	}
  });

  // Smooth scrolling
  $('body').on('click', '.smoothscroll, .nav-local a, .page-nav-item, .scroll-down-indicator', function(e){
	e.preventDefault();

	var $btn = $(this),
	  selector = $btn.attr('href'),
	  pos = 0;

	// If the target isn't an on-page anchor, treat it like a normal link
	if (!selector.match(/^#/)) {
	  window.location = selector;
	  return;
	}

	$target = $(selector);
	if ($target.length === 0) {
	  $target = $('body');
	}

	pos = $target.offset().top;
	$('html,body').animate({scrollTop: pos+'px'});

  });

  /*
  Marquees
   */
  $('body').on('click', '.marquee .panel-close', function(e){
	e.preventDefault();
	$('#shopify-section-marquee').fadeOut('fast');
	sessionStorage.setItem("lo-marquee-dismissed", "1");
  });

  // marquees are hidden by default, so show if they haven't been closed
  if ( 'lo-marquee-dismissed' in sessionStorage) {
	// no nothing
  }else{
	$('#shopify-section-marquee .marquee').removeClass('hidden');
  }

  // hide marquees on pages with local navs
  if( $('nav.local').length ){
  	$('#shopify-section-marquee').hide();
  }



  	// swipable bs carousels
  	$(".carousel").swipe({
  		allowPageScroll:"auto",
  		threshold: 40,
  		excludedElements: "label, button, input, select, textarea, .noSwipe",
  		swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
          	// $(this).find('.item a').on('click', function(){ return false; }); interfering with custom layout blocks, doesn't seem to be applicable anywhere else
          	$(this).carousel('next');
          },
  		swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
  			// $(this).find('.item a').on('click', function(){ return false; }); interfering with custom layout blocks, doesn't seem to be applicable anywhere else
          	$(this).carousel('prev');
          }
  	});

	/*
		Floating form labels
	 */
	$('.form-control').on('keyup', function(){
		if( $(this).val() != '' ){
			$(this).closest('.form-group').addClass('has-value');
		}else{
			$(this).closest('.form-group').removeClass('has-value');
		}
	});

	/*
	 Forgot Password title update
	 */
	var $loginTitle = $('#login-title');
	$('#RecoverPassword').on('click', function(e){
	    $loginTitle.text($loginTitle.data('reset-text')).addClass('has-divider');
	});
	$('#HideRecoverPasswordLink').on('click', function(e){
	    $loginTitle.text($loginTitle.data('default-text')).removeClass('has-divider');
	});
	if( $('body').attr('id') == 'account' && window.location.hash == '#recover') {
	  $loginTitle.text($loginTitle.data('reset-text')).addClass('has-divider');
	}


	/* Newsletter Prompt - disabled */
	// $('#newsletter-prompt .panel-close, #newsletter-prompt .btn').on('click', function(){
	// 	$('#newsletter-prompt').addClass('closed');
	// 	$.cookie('lo-nl-prompt-dismissed', '1', { path: '/' });
	// });

	// var displayNewsletterPrompt = function() {

	// 	// Not on the /sale page
	// 	if (window.location.pathname.match(/^\/sale/)) {
	// 		return;
	// 	}

	// 	// Not on the cart or checkout pages
	// 	if (window.location.pathname.match(/^\/checkout/)) {
	// 		return;
	// 	}

	// 	if ( ! $.cookie('lo-nl-prompt-dismissed') ) {
	// 		$('#newsletter-prompt').removeClass('closed');
	// 	}

	// };
	// var newletterTimeout = setTimeout(displayNewsletterPrompt, 30000);

	$("#newsletter-signup").on('submit', function(e) {
        e.preventDefault();
        $('#newsletter-signup .form-group .validation-error').remove();
        var email = $('#signup-email').val();
        if( !email ){
        	$('#newsletter-signup .form-group').append('<small class="validation-error">Please enter your email.</small>');
        	return;
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://manage.kmail-lists.com/subscriptions/external/subscribe",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            },
            "data": {
                "g": "KUBRaR",
                "$fields": "Sign Up Source",
                "email": email,
                "Sign Up Source": "footer"
            }
        };
        $.ajax(settings)
        	.fail(function(jqXHR, textStatus, errorThrown){
        		$('#newsletter-signup .form-group').append('<small class="validation-error">Something went wrong. Perhaps you\'ve already subscribed to our list? <a href="/pages/support#contact">Contact us</a> for further assistance.</small>');
        	})
        	.done(function (response) {
	            if( response.success ){
	            	$("#newsletter-signup .form-group, #newsletter-signup label").hide();
	            	$("#newsletter-signup .alert").fadeIn();
	            }
	        });
    });

	// page nav
	$('#page-nav-items-toggle').on('click', function(e){
	    e.preventDefault();
	    $('.page-nav').toggleClass('open');
	});
	$('.page-nav-item').on('click', function(e){
	    e.preventDefault();
	    $('.page-nav').removeClass('open');
	});

	var lastScrollTop = 0;
	var lowestScrollPos = 0;
	var $pageNav = $('.page-nav');
	var $header = $('#site-header');
	var headerOffset = $header.outerHeight();

	$(window).scroll(function(){

		var $ = jQuery;

		// sticky sidebars
		if( $(window).width() > LS.desktopBreakpoint && has_sticky_element ){
			LS.doStickyColumn(el_starting_pos);
		}

		var $el = $('.page-header-image, #overview-block-0');
		if( $el.length > 0 ){
			var container_bottom = $el.offset().top + $el.outerHeight() - $(window).scrollTop();
			var	indicator_bottom = $('.scroll-down-indicator').offset().top + $('.scroll-down-indicator').outerHeight() - $(window).scrollTop();
			var window_height = $(window).height();

			// deactivate the stick when the image is not below the window
			if( container_bottom < window_height ){
				$('.scroll-down-indicator').addClass('pinned');
			}
			// stick to the window when the indicator hits the bottom
			if( indicator_bottom > window_height ){
				$('.scroll-down-indicator').removeClass('pinned');
			}
		}

		// hide the back to top when at the top of the page
		var $totop = $('.back-to-top.persistent'),
			window_pos = $(window).scrollTop();

		if( window_pos > 240 ){
			$totop.addClass('active');
		}else{
			$totop.removeClass('active');
		}

		// trigger the newsletter prompt
	  //   if ( window_pos > $('body').height() * 0.7 ) {
			// displayNewsletterPrompt();
	  //   }

		// shift main nav out of the way when we have a page nav
		if( $pageNav.length ){
			var currentScrollTop = $(this).scrollTop();
			if (currentScrollTop > lastScrollTop){
				// scrolling down
				if( currentScrollTop > headerOffset ){
					$header.css('top', -headerOffset);
					$pageNav.css('margin-top', -headerOffset); // "top" value set by css, so shift it with margin
					$pageNav.addClass('is-shown'); // on mobile this makes it visible
				}
				// set our furthest point down the page
				lowestScrollPos = currentScrollTop;
			} else {
				// scrolling up, with a buffer so the header isn't shown immediately
				if( currentScrollTop + headerOffset < lowestScrollPos ){
					$header.attr('style', '');
					$pageNav.attr('style', '');
				}
			}

			// hides the page nav on mobile when we're at the top of the page
			if( currentScrollTop < headerOffset ){
				$pageNav.removeClass('is-shown');
			}

			lastScrollTop = currentScrollTop;
		}
	});

	/*
	Rebuild article headers for mobile
	 */
	var rebuildArticleHeader = function(){
		var $postTitle = $('.entry-header h1').detach();
		var $postExcerpt = $('.entry-header .excerpt').detach();
		var $postSharing = $('.entry-header .social-sharing').detach();
		var $postImage = $('.entry-header .image picture').detach();
		if( $(window).width() < 768 && $('#m-variation h1').length < 1 ){
			$('#m-variation [data-image-container]')
				.append($postTitle)
				.append($postImage);
			$('#m-variation [data-content-container]')
				.append($postExcerpt)
				.append($postSharing);
		}else if( $('#d-variation h1').length < 1 ){
			$('#d-variation [data-image-container]')
				.append($postImage);
			$('#d-variation [data-content-container]')
				.append($postTitle)
				.append($postExcerpt)
				.append($postSharing);
		}
		if( $(window).width() < 768 ){
			$('#m-variation [data-image-container]').css( 'height', $(window).outerHeight() - $('#site-header').outerHeight() + 2 ); // the +2 fixes a white line at the bottom
		}
	}
	if( $('body').hasClass('template-article') ){
		rebuildArticleHeader();
		$(window).resize(function(){
			rebuildArticleHeader();
		});
	}

	/*
	Cart
	 */

	$('.number-down').on('click', function(e){
	    e.preventDefault();
	    var $input = $(this).next('input');
	    var number = $input.val();
	    if( number > 0 ){
	    	number--;
	    	$input.val(number);
	    }
	});
	$('.number-up').on('click', function(e){
	    e.preventDefault();
	    var $input = $(this).prev('input');
	    var number = $input.val();
	    number++;
	    $input.val(number);
	});

	// move the qty control
	var setCartQtyInputLocation = function(){
		var $cartRows = $('#cart-items tr');
		$cartRows.each(function(){
			var $control = $(this).find('.number-control').detach();
			if( $(window).width() < 768 && $(this).find('.item-info .number-control').length < 1 ){
				$(this).find('.item-info').append($control);
			}else if( $(this).find('.item-qty .number-control').length < 1 ){
				$(this).find('.item-qty').append($control);
			}
		});
	}
	if( $('body').hasClass('template-cart') ){
		setCartQtyInputLocation();
		$(window).resize(function(){
			setCartQtyInputLocation();
		});
	}

	$('#cart-continue').on('click', function(e){
	    e.preventDefault();
	    var previousPage = sessionStorage.getItem('lo-back-to');
	    console.log(previousPage);
	    if( previousPage ){
	    	window.location = previousPage;
	    }else{
	    	window.location = window.location.protocol + '//' + window.location.hostname;
	    }
	});

	/*
	Tables
	 */

	var addTableLabels = function(){
		if( $(window).width() < 768 ){
			$('td.has-label').each(function(){
				if( $(this).find('.key').length < 1 ){
					$(this).wrapInner('<span class="value" />');
					$(this).prepend('<span class="key">' + $(this).data('label') + '</span>');
				}
			});
		}else{
			$('td.has-label .key').remove();
		}
	}
	addTableLabels();
	$(window).resize(function(){
		addTableLabels();
	});

	/*
	 Tabs
	 */

	$('.tab-headings .active-bar').width($('.tab-headings a.active').width());
	$('.tab-headings a').on('click', function(e){
	    e.preventDefault();
	    if( !$(this).hasClass('active') ){
	    	$('.tab-headings a').removeClass('active');
	    	$('.tab-panel').hide().removeClass('active');
	    	$(this).addClass('active');
	    	$($(this).attr('href')).fadeIn();
	    	$('.tab-headings .active-bar').css({ 
	    		'left': $(this).position().left,
	    		'width': $('.tab-headings a.active').width()
	    	});
	    }
	});

	/*
	 Products
	 */
	var setProductTitleLocation = function(){
		if( $(window).width() < 768 ){
			if( $('#product-galleries').prev('#product-identity').length < 1 ){
				$('#product-identity').detach().insertBefore('#product-galleries');
			}
		}else if( $('#product-description').prev('#product-identity').length < 1 ){
			$('#product-identity').detach().insertBefore('#product-description');
		}
	}
	setProductTitleLocation();
	$(window).resize(function(){
		setProductTitleLocation();
	});

	// Product video
	$('#product-video-trigger').detach().insertAfter('#product-description p:first-child');
	$('body').on('click', '#product-video-trigger', function(e){
		e.preventDefault();
		LS.productVideoOpen(1); // button always shows the first video
	});
	$('body').on('click', '#product-video .panel-close', function(e){
		e.preventDefault();
		LS.productVideoClose();
	});
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) { // escape key maps to keycode `27`
	    	LS.productVideoClose();
	    }
	});
	if( $('body').hasClass('template-product') ){
		sessionStorage.setItem('lo-back-to', window.location.href); // for use in the cart
	}
	
});
