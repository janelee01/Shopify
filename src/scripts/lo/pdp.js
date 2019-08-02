import PhotoSwipe from './../vendor/photoswipe.min.js'
import PhotoSwipeUI from './../vendor/photoswipe-ui-default.min.js'
$(document).ready(function(){
  if( $('body').hasClass('product') ){

    // move the pdp header to the main header so it can slide in sync with it
    $('.pdp-header').detach().appendTo('#site-header'); 

    const $variantInput = $('#variant-selector');
    const $variantButtons = $('.variants');
    const $swatches = $('.swatch');
    const $selectedColor = $('#selected-color');
    const $soldOutMsg = $('#sold-out-message');
    const $addToCartRow = $('#add-to-cart');
    const $addToWaitlistBtn = $('#waitlist-open');

    var dataLayer = window.dataLayer || [];

    // helper to set a new active item
    function setActiveElement($elGroup,$el,className){
      $elGroup.removeClass(className);
      $el.addClass(className);
    }

    // helper for money formatting
    function stripCents(str){
      return str.replace('.00','');
    }
    
    // fetch current state values
    function getActiveProductId(){
      return $('.swatch.active').data('sibling');
    };
    function getActiveVariantId(){
      return Number($variantInput.val());
    };
    function getActiveVariantData(){
      var variants = getProductVariants(getActiveProductId());
      var activeVariant = getActiveVariantId();
      for (var i = 0; i < variants.length; i++) {
        if (variants[i].id === activeVariant) {
          return variants[i];
        }
      }
    }

    // fetch any value
    function getProduct(id){
      return siblingsJson[id];
    }
    function getProductVariants(id){
      var product = getProduct(id);
      return product.variants;
    }

    // update values
    var setVariantInputValue = function(id){
      $variantInput.val(id);
    }
    var updateVariants = function() {
      // clear the old options
      $variantInput.html('');
      if ($variantButtons.length) {
        $variantButtons.find('.btn').remove();
      }
      // build the new options
      var variants = getProductVariants(getActiveProductId());
      variants.forEach(variant => {
        $variantInput.append(
          `<option value="${variant.id}">${variant.title}</option>`
        );
        $variantButtons.append(
          `<a href="#" data-id="${variant.id}" class="btn btn-secondary">${variant.title}</a>`
        )
      });

      // select the previously selected size/option
      $variantButtons.find('.btn').each(function(){
        if ($(this).text() === window.selectedVariantText) {
          $(this).addClass('selected');
          setVariantInputValue($(this).data('id'));
        }
      });
    }

    function updatePrice(){
      var $compareEl = $('#compare-price');
      var $priceEl = $('#price');
      var $discountEl = $('.discount-label');
      var $discountValue = $('.discount-amount');
      var variant = getActiveVariantData();

      var price = variant.price;
      var comparePrice = variant.compare_at_price;
      var discountAmount = Math.round(100 * (comparePrice - price) / comparePrice);

      var formattedCompare = stripCents(slate.Currency.formatMoney(comparePrice, theme.moneyFormat));
      var formattedPrice = stripCents(slate.Currency.formatMoney(price, theme.moneyFormat));
      
      if (comparePrice > 0 && price !== comparePrice){
        $priceEl.html(formattedPrice);
        $compareEl.html(formattedCompare).show();
        $discountValue.text(discountAmount);
        $discountEl.show();
      }else{
        $discountEl.hide();
        $compareEl.hide();
        $priceEl.html(formattedPrice);
      }
    };

    function updateDataLayer(){
      var productId = getActiveProductId();
      var product = getProduct(productId);
      var variant = getActiveVariantData();
      var update = {
        'event': 'swatchClick',
        'productData.price': variant.price * 0.01,
        'productData.comparePrice': variant.compare_at_price * 0.01,
        'productData.sku': variant.sku,
        'productData.name': product.title,
        'productData.variant': variant.title,
        'productData.variantId': variant.id,
        'productData.url': siblingsSupplimentalJson[productId].url,
        'productData.imageUrl': siblingsSupplimentalJson[productId].featuredImage,
        'productData.collections': siblingsSupplimentalJson[productId].collections,
        'productData.color': $selectedColor.text(),
        'pinterestPage': product.title
      };
      dataLayer.push(update);
    };

    function updateGallery(){
      // show the new gallery
      setActiveElement(
        $('.sibling-image-set'),
        $('.sibling-image-set[data-sibling="' + getActiveProductId() + '"]'),
        'active');
      // get our lazy images
      $('.sibling-image-set.active').find('.lazy').each(function(){
        $(this).attr('src',$(this).data('lazy')).addClass('in');
      });
    };

    function updateUrl(){
      const url = $('.swatch.active').data('url');
      if (history.replaceState) {
        const newurl = window.location.protocol + '//' + window.location.host + url
        window.history.replaceState({ path: newurl }, '', newurl)
        sessionStorage.setItem('lo-back-to', newurl) // for use in the cart

        dataLayer.push({
          'event': 'afterUrlUpdate'
        })
      }
    };

    function updateWaitlistMeta() {
      var productId = getActiveProductId();
      var variantId = getActiveVariantId();
      var product = getProduct(productId);

      $('#wl-image').attr('src', product.featured_image);
      $('#wl-product').val(productId);
      $('#wl-variant').val(variantId);

      var swatch = $selectedColor.text();
      var size = '';
      if( $variantButtons.length ){
        size = '- ' + $('.variants .selected').text();
      }
      $('[data-wl-meta]').text(`${swatch} ${size}`);

      var wlExpected = (variantStockData[variantId] || {}).restockMessage;

      if (wlExpected) {
        $('[data-wl-expected]').text('Expected in stock: ' + wlExpected);
      } else {
        $('[data-wl-expected]').text('');
      }
    };

    function updateCta(variantId){
      var variant = getActiveVariantData(variantId);
      let stockData = variantStockData[variantId];
      let isAvailable = variant.available;

      // reset to normal
      $addToCartRow.show();
      $soldOutMsg.hide();
      $addToWaitlistBtn.hide();

      // check for manual override of availability
      if (stockData.oosSettings === 'unavailable') {
        isAvailable = false;
      }

      // check for manual override of out of stock level
      if (stockData.oosThreshold >= stockData.stockLevel) {
        isAvailable = false;
      }

      // normal, nothing left to do
      if (isAvailable) {
        return;
      }

      // Unavailable and won't be later, show sold out
      if (stockData.oosPolicy === 'soldout') {
        $addToCartRow.hide();
        $soldOutMsg.show();
        return;
      }

      // Unavailable but will be later, show waitlist
      $addToWaitlistBtn.data('variant-id', variantId).show();
      $addToCartRow.hide();

      $('#wl-variant').val(variantId);
    };

    function updateLowStockWarning(variantId) {
      const inventoryLevel = variantStockData[variantId].stockLevel;
      const $warning = $('.low-stock-warning');
      const lowStockThreshold = variantStockData[variantId].lowStockThreshold;
      const oosThreshold = variantStockData[variantId].oosThreshold;
      if (inventoryLevel > oosThreshold && inventoryLevel <= lowStockThreshold) {
        $warning.show();
      } else {
        $warning.hide();
      }
    };

    function updateFinalSaleMessage(variantId) {
      const $warning = $('.final-sale-warning');
      let finalSaleValue = variantStockData[variantId].finalSale;
      if (finalSaleValue.toLowerCase() === 'true') {
        $warning.show();
      } else {
        $warning.hide();
      }
    };

    // visual changes when variants change
    function updateUi(){
      var variantId = getActiveVariantId();
      updatePrice();
      updateCta(variantId);
      updateLowStockWarning(variantId);
      updateFinalSaleMessage(variantId);
      updateWaitlistMeta();
    };

    // doing this on page load so we don't duplicate logic in the template
    updateUi();

    // changing colors, which also changes the entire product
    $swatches.on('click', function(e){
      e.preventDefault();
      let $selectedSwatch = $(this);
      // show swatch as selected
      setActiveElement($swatches, $selectedSwatch, 'active');
      // stash the currently selected size for use when we rebuild the variants
      if( $variantButtons.length ){
        window.selectedVariantText = $variantButtons.find('.btn.selected').text();
      }
      // update the active color
      $selectedColor.text($selectedSwatch.find('img').data('color-label'));
      // rebuild variant buttons and the hidden select element
      updateVariants();
      // show the color's images
      updateGallery();
      // switch to this color's PDP, also triggers GTM
      updateUrl();
      // rebuild
      updateUi();
      updateDataLayer();
      updateWaitlistMeta();
    });

    // changing sizes, product remains the same
    if( $variantButtons.length ){
      $('body').on('click', '.variants .btn', function(e){
        e.preventDefault();
        let $selectedSize = $(this);
        // show variant as selected
        setActiveElement($('.variants .btn'), $selectedSize, 'selected');
        // set the hidden select element to the new value
        setVariantInputValue($selectedSize.data('id'));
        // rebuild
        updateUi();
        updateDataLayer();
        updateWaitlistMeta();
      });
    }

    /*
    Modals
    */
    $('.pdp-modal-trigger').on('click', function(e){
      e.preventDefault();
      $($(this).attr('href')).addClass('active');
    });
    $('.pdp-modal .panel-close').on('click', function(e){
      e.preventDefault();
      $(this).closest('.pdp-modal').removeClass('active');
    });

    $('.size-fit-slider .slides').slick({
      dots: false,
      arrows: true
    });

    let activeGallery = null;

    $('.zoomable').on('click', function(e){
      e.preventDefault();
      let pswpElement = $('.pswp')[0];
      let items = pswpData[$(this).data('gallery-id')];
      var options = {
        showHideOpacity: true,
        showAnimationDuration: 500,
        loop: true,
        history: false,
        closeOnVerticalDrag: false,
        allowPanToNext: false,
        pinchToClose: false,
        closeEl: true,
        captionEl: false,
        fullscreenEl: false,
        zoomEl: false,
        shareEl: false,
        counterEl: false,
        arrowEl: false,
        preloaderEl: false,
        tapToToggleControls: false,
        index: $(this).data('index'),
        errorMsg: '<p class="pswp__error-msg">Error Message..</p>',
        getDoubleTapZoom (e, t) {
          return 1
        }
      }
      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI, items, options);
      gallery.init();
      activeGallery = gallery;
    });

    $('#zoomed-gallery .panel-close').on('click', function(e){
      e.preventDefault();
      activeGallery.close();
    });
    $('#zoomed-gallery .prev').on('click', function(e){
      e.preventDefault();
      activeGallery.prev();
    });
    $('#zoomed-gallery .next').on('click', function(e){
      e.preventDefault();
      activeGallery.next();
    });
    

    /*
    Mobile swatch scrolling - initially planned for, then bailed. leaving this around in case they want to revisit because this took a while to figure out
    const $swatchGroups = $('#swatch-groups');
    // $swatchGroups gets flexed, so each group needs a min-width to avoid collapsing and to trigger side scrolling
    $('.swatches').each(function(){
      let $group = $(this).closest('.swatch-group');
      let swatchTotalWidth = Number($(this).find('li').outerWidth()) + Number($(this).find('li').css('margin-right').replace('px',''));
      let swatchesWidth = $(this).find('li').length * swatchTotalWidth;
      let swatchLabelWidth = Number($(this).prev('.group-name').outerWidth()) + 1; // text can have fractional widths so bump the result by 1px to prevent wrapping
      if (swatchesWidth > swatchLabelWidth){
        $group.css('min-width', swatchesWidth);
      }else{
        $group.css('min-width', swatchLabelWidth);
      }
    });
    // trigger the flex display after calculations above have run;
    $swatchGroups.addClass('ready');
    // do we have sidescrolling?
    let swatchGroupsWidth = Number($swatchGroups.css('padding-left').replace('px',''));
    $('.swatch-group').each(function(){
      swatchGroupsWidth += Number($(this).outerWidth()) + Number($(this).css('margin-right').replace('px',''));
    });
    // gonna need to scroll
    if( swatchGroupsWidth > $(window).outerWidth() ){
      // how many pixels are we hanging off the side
      let amountToScroll = swatchGroupsWidth - $(window).outerWidth();
      // let the indicator size represent how many groups we have
      let indicatorWidth = Number(100/$('.swatch-group').length).toPrecision(2);
      // inject the bar
      $('<div class="form-row" id="swatch-groups-scrollbar"><div id="position-indicator" style="width:' + indicatorWidth + '%"></div></div>').insertAfter($swatchGroups);
      $swatchGroups.on('scroll', function(){
        // of the distance we need to scroll, how far have we gone?
        let percentScrolled = $swatchGroups.scrollLeft()/amountToScroll * 100;
        // we can't move the indicator 1:1 with the scroll amount, otherwise its left edge would be at 100% of the width
        // so, move it a percentage of the percentage moved to accomodate its width
        // Example: if the indicator is 33% wide, then it can only move 66% of the bar area, so at 100% of the percent scrolled, the indicator should be at 66%;
        let modifier = (100 - indicatorWidth) / 100;
        $('#position-indicator').css('left', percentScrolled * modifier + '%');
      });
    }
    */

  }// end if PDP
  
});
