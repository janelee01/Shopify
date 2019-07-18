$(document).ready(function(){

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
        `<button data-id="${variant.id}" class="btn btn-secondary">${variant.title}</buton>`
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
    setActiveElement(
      $('.sibling-image-set'),
      $('.sibling-image-set[data-sibling="' + getActiveProductId() + '"]'),
      'active');
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

});
